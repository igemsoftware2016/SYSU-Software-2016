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
            return jsonify({
                            'code': 1,
                            'message': 'Invalid e-mail or password!'
                            })
        if not checker.check_pw(request.form.get("password")):
            return jsonify({
                            'code': 1,
                            'message': 'Invalid e-mail or password!'
                            })
        session['user'] = checker.get_id()
        session['nickname'] = checker.nickname
        session['icon'] = checker.icon
        return jsonify({'code': 0})
    else:
        return redirect(url_for('router_index'))

@app.route('/register', methods = ['POST'])
def router_register():
    if request.method == "POST":
        if not user.query.filter_by(email = request.form.get("email")).first() is None:
            return jsonify({
                            'code': 1,
                            'message': 'E-mail has been registered!'
                            })
        new_user = user(request.form.get("nickname"), request.form.get("email"), request.form.get("password"))
        new_user.save()
        session['user'] = new_user.get_id()
        session['nickname'] = new_user.nickname
        session['icon'] = new_user.icon
        return jsonify({'code': 0})

@app.route('/profile')
@login_required
def router_profile():
    return render_template('profile.html', userid = user.query.filter_by(id = session['user']).first().nickname)

@app.route('/profile/<int:user_id>')
@login_required
def router_others_profile(user_id):
    if user_id == session['user']:
        return redirect(url_for('router_profile'))
    return render_template('profile.html', userid = user.query.filter_by(id = session['user']).first().nickname)


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
        #state_id = cur_design.state

    if state_id == 1:
        return render_template('state_1.html', design_id = design_id)#, matters = dict_matters, medium = dict_medium, flora = dict_flora)

    elif state_id == 2:
        cur_calculator = calculator.query.filter_by(md5 = cur_design.md5_state1).first()
        if cur_calculator.ans == -1:
            return render_template('wait.html', design_id = design_id)
        return render_template('state_2.html')#, bacteria = dict_bacteria, plasmid = dict_plasmid)

    elif state_id == 3:
        cur_calculator = calculator.query.filter_by(md5 = cur_design.md5_state2).first()
        if cur_calculator.ans == -1:
            return render_template('wait.html', design_id = design_id)
        return render_template('state_3.html', design_id = design_id)#, y_list = dict_ylist)

    elif state_id == 4:
        return render_template('state_4.html', design_id = design_id)#, pdf_pos = where_is_the_pdf)

    return render_template('state_%r.html' % state_id, design_id = design_id)

@app.route('/square')
def router_square():
    if session.get('user'):
        return render_template('square.html', userid = user.query.filter_by(id = session['user']).first().nickname)
    return render_template('square.html')

@app.route('/logout')
@login_required
def router_logout():
    session.pop('user', None)
    session.pop('nickname', None)
    return redirect(url_for('router_index'))

@app.errorhandler(404)
def router_not_found(error):
    return render_template('404.html'), 404

# Implements

@app.route('/new_design')
@login_required
def new_design():
    new_design = design(user.query.filter_by(id = session['user']).first(), "")
    new_design.save()
    return redirect(url_for('router_state', design_id = new_design.id, state_id = 1))

@app.route('/mod_design_name', methods = ['POST'])
@login_required
def mod_design_name():
    if request.method == "POST":
        cur_design = design.query.filter_by(id = request.form.get('_id')).first()
        if cur_design is None:
            return jsonify({'code': 1})
        if cur_design.owner_id != session['user']:
            return jsonify({'code': 1})
        cur_design.design_name = request.form.get('name')
        db.session.commit()
        return jsonify({'code': 0})

@app.route('/get_steps')
@login_required
def get_steps():
    # test!
    # myPrint("----- _id:%s" % request.args.get('_id'))
    if str(request.args.get('_id')) == "233":
        return jsonify({
                    'code': 0,
                    'ret': 5
                    })
    design_query = design.query.filter_by(id = request.args.get('_id')).first()
    # design_query =None
    if design_query is None:
        return jsonify({
            'code': 1,
            'message': "Error Design ID"
            })
    else:
        return jsonify({
                'code': 0,
                'ret': design_query.state
                })

@app.route('/save_state_<int:state_id>', methods = ['POST'])
@login_required
def save_state(state_id):
    # need attention, you should change `request.form` to `request.json`
    #   and access other parmas in a totally different way
    if method == 'POST':
        cur_design = design.query.filter_by(id = request.form.get('design_id')).first()
        if cur_design.owner_id != session['user']:
            return redirect(url_for('router_profile'))
        if cur_design.state < state_id:
            return jsonify({"code": 1})

        if state_id == 1:
            cur_design.design_mode = request.form.get('mode')
            if request.form.get('mode') == 'make':
                d_input = request.form.get('inputs')
                for m in d_input:
                    new_make_matter = make_matter(cur_design, matterDB.query.filter_by(matter_name = m.get('name')).first(), m.get('lower'), m.get('upper'), m.get('maxim'))
                    new_make_matter.save()                   
            elif request.form.get('mode') == 'resolve':
                for m in d_input:
                    new_resolve_matter = resolve_matter(cur_design, materDB.query.filter_by(matter_name = m.get('name')).first(), m.get('begin'))
                    new_resolve_matter.save()
            d_order = request.form.get('other')
            cur_design.time = d_order.get('time')
            cur_design.medium = mediumDB.query.filter_by(id = d_order.get('medium')).first()
            cur_design.flora = floraDB.query.filter_by(id = d_order.get('flora')).first()
        #elif state_id == 2:

        db.session.commit()
        return jsonify({"code": 0})

@app.route('/commit_state_<int:state_id>', methods = ['POST'])
@login_required
def commit_state(state_id):
    if method == 'POST':
        cur_design = design.query.filter_by(id = request.form['design_id']).first()
        if cur_design.owner_id != session['user']:
            return jsonify({"code": 1})

        if state_id == 1:
            cur_design.design_mode = request.form.get('mode')
            if request.form.get('mode') == 'make':
                d_input = request.form.get('inputs')
                for m in d_input:
                    new_make_matter = make_matter(cur_design, matterDB.query.filter_by(matter_name = m.get('name')).first(), m.get('lower'), m.get('upper'), m.get('maxim'))
                    new_make_matter.save()                   
            elif request.form.get('mode') == 'resolve':
                for m in d_input:
                    new_resolve_matter = resolve_matter(cur_design, materDB.query.filter_by(matter_name = m.get('name')).first(), m.get('begin'))
                    new_resolve_matter.save()
            d_order = request.form.get('other')
            cur_design.time = d_order.get('time')
            cur_design.medium = mediumDB.query.filter_by(id = d_order.get('medium')).first()
            cur_design.flora = floraDB.query.filter_by(id = d_order.get('flora')).first()
        #elif state_id == 2:
            
        db.session.commit()
        if state_id == cur_design.state:
            cur_design.state += 1
        if state_id == 5:
            return jsonify({"code": 1})
        return jsonify({"code": 0})

@app.route('/get_state_<int:state_id>_saved', methods = ['GET'])
@login_required
def get_state_saved(state_id):
    if method == 'GET':
        cur_design = design.query.filter_by(id = request.args.get('design_id')).first()
        if cur_design.owner_id != session['user']:
            return redirect(url_for('router_profile'))
        if state_id > cur_design.state:
            return redirect(url_for('router_state', design_id = cur_design.id, state_id = cur_design.state))
        return jsonify({}) #TODO

@app.route('/search/matters/<matter_name>')
def search_matters_name(matter_name):
    querier = matterDB.query.filter(matterDB.matter_name.ilike('%'+matter_name+'%'))
    if querier.first() is None:
        return jsonify({
                        "success": False
                        })
    results = []
    counter = 1;
    for m in querier:
        ares = {"title": m.matter_name, "description": "xxxxxx"}
        results.append(ares)
        counter += 1
        if counter >= 10:
            break
    # return jsonify({
    #                 "success": True,
    #                 "results": 
    #                 {"matters":
    #                     {
    #                     "name": "Matters",
    #                     "results": results
    #                     }
    #                 }
    #                 })
    return jsonify({
                    "success": True,
                    "results": results
                    })


#upload file
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/upload', methods = ['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(urllib.quote(file.filename.encode('utf-8')))
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return os.path.join(app.config['UPLOAD_FOLDER'], filename)
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form action="" method=post enctype=multipart/form-data>
      <p><input type=file name=file>
         <input type=submit value=Upload>
    </form>
    '''



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
        return render_template('state_2.html', bacteria = dict_bacteria, plasmid = dict_plasmid, design_id=233)
    return render_template("state_%s.html" % state, design_id=233)

@app.route("/save_test", methods=["POST"])
def save_test():
    myPrint(request.json)
    return jsonify({"code":0})

def myPrint(str):
    print(str, file=sys.stderr)



@app.route("/getState2Info")
def getState2Info():
    ret = {
    "bacteria": [{
        "name": "bac_name1",
        "_id": 1,
        "plasmid": [{
            "_id": 1,
            "name": "first",
            "pathway": [{
                "_id": 1,
                "name": "P1",
                "prom": 1,
                "RBS": 2,
                "CDS": 1,
                "term": 1,
                "strength": {
                    "promoter_lower": 0.1,
                    "promoter_upper": 1.33,
                    "promoter": [{
                        "s": 0.19,
                        "info": "1"
                    }, {
                        "s": 1.33,
                        "info": "2"
                    }],
                    "RBS_lower": 0.1,
                    "RBS_upper": 2.9,
                    "RBS": [{
                        "s": 0.8,
                        "info": "1"
                    }, {
                        "s": 2.9,
                        "info": "2"
                    }],
                    "mRNA_lower": 0.5,
                    "mRNA_upper": 7.5,
                    "mRNA_s": 4.8,
                    "protein_lower": 1.1,
                    "protein_upper": 9.8,
                    "protein_s": 2.4,
                }
            }, {
                "_id": 2,
                "name": "P2",
                "prom": 2,
                "RBS": 1,
                "CDS": 1,
                "term": 2,
                "strength": {
                    "promoter_lower": 0.1,
                    "promoter_upper": 1.33,
                    "promoter": [{
                        "s": 0.1,
                        "info": "1"
                    }, {
                        "s": 1.33,
                        "info": "2"
                    }],
                    "RBS_lower": 0.1,
                    "RBS_upper": 2.9,
                    "RBS": [{
                        "s": 0.8,
                        "info": "1"
                    }, {
                        "s": 2.9,
                        "info": "2"
                    }],
                    "mRNA_lower": 0.5,
                    "mRNA_upper": 7.5,
                    "mRNA_s": 6.7,
                    "protein_lower": 1.1,
                    "protein_upper": 9.8,
                    "protein_s": 1.4,
                }
            }]
        }]
    }],

    "promoter_Info": {
        "1": {
            "name": "prom1",
            "type": "PA",
            "BBa": "BBa_213213",
            "Introduction": "no",
            "NCBI": "No.",
            "FASTA": "No."
        },
        "2": {
            "name": "ahahahah",
            "type": "Z",
            "BBa": "BBa_2sssd",
            "Introduction": "no",
            "NCBI": "No.2",
            "FASTA": "No.2"
        },
    },
    
    "RBS_Info": {
        "1": {
            "name": "RBS1",
            "type": "RA",
            "BBa": "BBa_213213",
            "Introduction": "no",
            "NCBI": "No.b",
            "FASTA": "No.b"
        },
        "2": {
            "name": "2222",
            "type": "B",
            "BBa": "BBa_3322222",
            "Introduction": "no",
            "NCBI": "No.333",
            "FASTA": "No223."
        },
    },

    "CDS_Info": {
        "1": {
            "name": "CDS_sdasd",
            "type": "CA",
            "BBa": "BBa_213213",
            "Introduction": "no",
            "NCBI": "No.b",
            "FASTA": "No.b"
        },
        "2": {
            "name": "CDS_2222",
            "type": "B",
            "BBa": "BBa_3322222",
            "Introduction": "no",
            "NCBI": "No.333",
            "FASTA": "No223."
        },
    },

    "term_Info": {
        "1": {
            "name": "term_sdasd",
            "type": "TA",
            "BBa": "BBa_213213",
            "Introduction": "no",
            "NCBI": "No.b",
            "FASTA": "No.b"
        },
        "2": {
            "name": "term_2222",
            "type": "B",
            "BBa": "BBa_3322222",
            "Introduction": "no",
            "NCBI": "No.333",
            "FASTA": "No223."
        },
    }
}
    return jsonify({
            "code": 0,
            "ret": ret
        })