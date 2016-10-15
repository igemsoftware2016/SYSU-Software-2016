# -*- coding=utf-8 -*-
from __future__ import print_function
from flask import Flask, render_template, abort, redirect, session, url_for, request, jsonify
from jinja2 import TemplateNotFound
from application import app, db
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
#from flask.ext.login import logout_user
#from .forms import LoginForm
from model import *
from functools import wraps
from werkzeug import secure_filename
import os
import urllib
import json
from dataLibs import *

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('user'):
            return redirect(url_for('router_index'))
        return f(*args, **kwargs)
    return decorated_function


@app.route('/')
def router_index():
    if session.get('user'):
        if not user.query.filter_by(id = session.get('user')).first():
            return redirect(url_for('router_logout'))
        return redirect(url_for('router_profile'))
    return render_template('login.html')


@app.route('/testlogin')
def router_testlogin():
    return render_template('testlogin.html')


@app.route('/login', methods = ['POST'])
def router_login():
    if request.method == "POST":
        # print(request.form)
        checker = user.query.filter_by(email = request.form.get("email")).first()
        if checker is None:
            return libs_errorMsg('Invalid e-mail or password!')
        if not checker.check_pw(request.form.get("password")):
            return libs_errorMsg('Invalid e-mail or password!')
        session['user'] = checker.get_id()
        session['nickname'] = checker.nickname
        session['icon'] = checker.icon
        return libs_success()
    else:
        return redirect(url_for('router_index'))


@app.route('/register', methods = ['POST'])
def router_register():
    if request.method == "POST":
        if not user.query.filter_by(email = request.form.get("email")).first() is None:
            return libs_errorMsg('E-mail has been registered!')
        new_user = user(request.form.get("nickname"), request.form.get("email"), request.form.get("password"))
        new_user.save()
        session['user'] = new_user.get_id()
        session['nickname'] = new_user.nickname
        session['icon'] = new_user.icon
        return libs_success()


@app.route('/profile')
@login_required
def router_profile():
    designs, info = getAllPosts(session['user'])
    return render_template('profile.html', title='My Profile', designs = designs, info = info)


# @app.route('/profile/<int:user_id>')
# @login_required
# def router_others_profile(user_id):
#     if user_id == session['user']:
#         return redirect(url_for('router_profile'))
#     return render_template('profile.html', userid = user.query.filter_by(id = session['user']).first().nickname)


@app.route('/setting', methods = ['GET', 'POST'])
@login_required
def router_setting():
    if request.method == 'POST':
        myPrint(request.json.get("setIcon"))
        # data = json.loads(request.json)
        u = user.query.filter_by(id = session['user']).first()
        if request.json.get("setPassword"):
            if u.password != request.json.get("oldPassword"):
                return jsonify({
                    'code': 1,
                    'message': 'Wrong old password.'
                    })
            u.password = request.json.get("newPassword")
        if request.json.get("setName"):
            u.nickname = request.json.get("newName")
        if request.json.get("setIcon"):
            myPrint(request.json.get("newIcon"))
            u.icon = request.json.get("newIcon")
        # db.session.add(u)
        db.session.commit()
        session['nickname'] = u.nickname
        session['icon'] = u.icon
        return jsonify({'code': 0})
    return render_template('setting.html', title="Setting")


@app.route('/state/<int:design_id>/<int:state_id>')
@login_required
def router_state(design_id, state_id):
    cur_design = design.query.filter_by(id = design_id).first()
    if cur_design is None:
        return redirect(url_for('router_profile'))
    session['design'] = design_id
    if state_id > cur_design.state:
        return redirect(url_for('router_state', design_id = design_id, state_id = cur_design.state))

    if state_id == 1:
        mlist = []
        for ms in mediumDB.query.all():
            if ms.name != "user_inserted":
                mlist.append({"id": ms.id, "value": ms.name})
        return render_template('state_1.html', design = cur_design, medium_list = mlist)

    elif state_id == 2:
        # if cur_design.state2_data is None:
            # return render_template('wait.html', design = cur_design)
        return render_template('state_2.html', design = cur_design)

    elif state_id == 3:
        if cur_design.state3_matter_list == '[]':
            return render_template('wait.html', design_id = design_id)
        return render_template('state_3.html', design_id = design_id)

    elif state_id == 4:
        return render_template('state_4.html', design_id = design_id)

    return render_template('state_%r.html' % state_id, design_id = design_id)


@app.route('/square')
def router_square():
    designs, info = getPublic(session.get('user'))
    helpList = getNeedHelp()
    num = getUserNum(session.get('user'))
    return render_template('square.html', title='Square', designs = designs, info = info, help = helpList, num=num)

@app.route('/logout')
@login_required
def router_logout():
    session.pop('user', None)
    session.pop('nickname', None)
    return redirect(url_for('router_index'))

@app.route('/user/<int:user_id>')
def route_user(user_id):
    if user_id == session.get('user'):
        return redirect(url_for('router_profile'))
    u = user.query.filter_by(id=user_id).first_or_404()
    designs, info = getAllPosts(user_id)
    num = getUserNum(user_id)
    return render_template('user.html', title='Square', designs = designs, info = info, num=num, user=u)

@app.route('/design/<int:design_id>')
@login_required
def designDetail(design_id):
    d = design.query.filter_by(id=design_id).first_or_404()
    u = user.query.filter_by(id=session['user']).first()

    otherInfo = {}
    l = json.loads(d.liked_by)
    # myPrint(l, session['user'])
    otherInfo['icon'] = d.owner.icon
    otherInfo['like_num'] = len(l)
    otherInfo['liked'] = (session['user'] in l)
    otherInfo['datetime'] = d.design_time.strftime("%Y-%m-%d %H:%M")
    l = json.loads(u.mark)
    # myPrint(l, d.id, (str(d.id) in l))
    otherInfo['marked'] = (str(d.id) in l)
    otherInfo['myCreation'] = (d.owner == session["user"])
    return render_template("detail.html", title="Design detail", design = d, info=otherInfo)

@app.errorhandler(404)
def router_not_found(error):
    return render_template('404.html'), 404

###################################################
# for states test!!!!
import sys
@app.route("/s/<int:state>")
def test_s(state):
    if state == 2:
        dict_bacteria = [{
            "_id": 1,
            "name": "firstba"
        }, {
            "_id": 2,
            "name": "secondba"
        }]
        dict_plasmid = [{
            "_id": 1,
            "name": "firstpl"
        }, {
            "_id": 2,
            "name": "secondpl"
        }]
        return render_template('state_2.html', bacteria = dict_bacteria, plasmid = dict_plasmid, design_id = 233)
    return render_template("state_%s.html" % state, design_id=233)

@app.route("/save_test", methods=["POST"])
def save_test():
    myPrint(request.json)
    return jsonify({"code":0})

@app.route("/getState2Info")
def getState2Info():
    null = None
    ret = {
  "code": 0, 
  "ret": {
    "CDS_Info": {
      "1": {
        "name": "Specified CDS for enzyme"
      }
    }, 
    "RBS_Info": {
      "156": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "157": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "158": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "159": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "160": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "161": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "162": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "163": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "164": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "165": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "166": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "167": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "168": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "169": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "170": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }
    }, 
    "bacteria": [
      {
        "_id": 1, 
        "name": "BREVIBACTERIUM MCBRELLNERI ATCC 49030", 
        "plasmid": [
          {
            "_id": 1, 
            "name": "pSB1AK3", 
            "pathway": [
              {
                "CDS": 1, 
                "RBS": 5, 
                "_id": 1, 
                "name": "EC-2.1.2.11_0_pum_0", 
                "prom": 5, 
                "strength": {
                  "RBS": [
                    {
                      "info": 156, 
                      "s": 0.11111
                    }, 
                    {
                      "info": 157, 
                      "s": 0.22222
                    }, 
                    {
                      "info": 158, 
                      "s": 0.33333
                    }, 
                    {
                      "info": 159, 
                      "s": 0.44444
                    }, 
                    {
                      "info": 160, 
                      "s": 0.55555
                    }
                  ], 
                  "RBS_lower": 0.11111, 
                  "RBS_upper": 0.55555, 
                  "mRNA_lower": 0, 
                  "mRNA_s": 6.7, 
                  "mRNA_upper": 10, 
                  "promoter": [
                    {
                      "info": 161, 
                      "s": 0.11111
                    }, 
                    {
                      "info": 162, 
                      "s": 0.22222
                    }, 
                    {
                      "info": 163, 
                      "s": 0.33333
                    }, 
                    {
                      "info": 164, 
                      "s": 0.44444
                    }, 
                    {
                      "info": 165, 
                      "s": 0.55555
                    }
                  ], 
                  "promoter_lower": 0.11111, 
                  "promoter_upper": 0.55555, 
                  "protein_lower": 0, 
                  "protein_s": 1.4, 
                  "protein_upper": 10
                }, 
                "term": 1
              }, 
              {
                "CDS": 1, 
                "RBS": 5, 
                "_id": 2, 
                "name": "EC-4.1.2.12_0_pum_0", 
                "prom": 5, 
                "strength": {
                  "RBS": [
                    {
                      "info": 161, 
                      "s": 0.11111
                    }, 
                    {
                      "info": 162, 
                      "s": 0.22222
                    }, 
                    {
                      "info": 163, 
                      "s": 0.33333
                    }, 
                    {
                      "info": 164, 
                      "s": 0.44444
                    }, 
                    {
                      "info": 165, 
                      "s": 0.55555
                    }
                  ], 
                  "RBS_lower": 0.11111, 
                  "RBS_upper": 0.55555, 
                  "mRNA_lower": 0, 
                  "mRNA_s": 6.7, 
                  "mRNA_upper": 10, 
                  "promoter": [
                    {
                      "info": 166, 
                      "s": 0.11111
                    }, 
                    {
                      "info": 167, 
                      "s": 0.22222
                    }, 
                    {
                      "info": 168, 
                      "s": 0.33333
                    }, 
                    {
                      "info": 169, 
                      "s": 0.44444
                    }, 
                    {
                      "info": 170, 
                      "s": 0.55555
                    }
                  ], 
                  "promoter_lower": 0.11111, 
                  "promoter_upper": 0.55555, 
                  "protein_lower": 0, 
                  "protein_s": 1.4, 
                  "protein_upper": 10
                }, 
                "term": 1
              }
            ]
          }
        ]
      }, 
      {
        "_id": 2, 
        "name": "TEPIDANAEROBACTER ACETATOXYDANS", 
        "plasmid": [
          {
            "_id": 1, 
            "name": "pSB1AK3", 
            "pathway": [
              {
                "CDS": 1, 
                "RBS": 5, 
                "_id": 1, 
                "name": "EC-1.11.1.6_1_pum_0", 
                "prom": 5, 
                "strength": {
                  "RBS": [
                    {
                      "info": 166, 
                      "s": 0.11111
                    }, 
                    {
                      "info": 167, 
                      "s": 0.22222
                    }, 
                    {
                      "info": 168, 
                      "s": 0.33333
                    }, 
                    {
                      "info": 169, 
                      "s": 0.44444
                    }, 
                    {
                      "info": 170, 
                      "s": 0.55555
                    }
                  ], 
                  "RBS_lower": 0.11111, 
                  "RBS_upper": 0.55555, 
                  "mRNA_lower": 0, 
                  "mRNA_s": 6.7, 
                  "mRNA_upper": 10, 
                  "promoter": [
                    {
                      "info": 171, 
                      "s": 0.11111
                    }, 
                    {
                      "info": 172, 
                      "s": 0.22222
                    }, 
                    {
                      "info": 173, 
                      "s": 0.33333
                    }, 
                    {
                      "info": 174, 
                      "s": 0.44444
                    }, 
                    {
                      "info": 175, 
                      "s": 0.55555
                    }
                  ], 
                  "promoter_lower": 0.11111, 
                  "promoter_upper": 0.55555, 
                  "protein_lower": 0, 
                  "protein_s": 1.4, 
                  "protein_upper": 10
                }, 
                "term": 1
              }
            ]
          }
        ]
      }
    ], 
    "promoter_Info": {
      "161": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "162": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "163": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "164": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "165": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "166": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "167": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "168": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "169": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "170": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "171": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "172": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "173": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "174": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }, 
      "175": {
        "BBa": null, 
        "FASTA": null, 
        "Introduction": null, 
        "NCBI": null, 
        "name": null, 
        "type": null
      }
    }, 
    "term_Info": {
      "1": {
        "BBa": "BBa_B0015", 
        "Introduction": "double terminator (B0010-B0012)", 
        "name": "A 202 Terminator"
      }
    }
  }
}
    return jsonify({
            "code": 0,
            "ret": ret
        })
