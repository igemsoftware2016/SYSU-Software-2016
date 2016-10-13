# -*- coding=utf-8 -*-
from __future__ import print_function
from flask import Flask, render_template, abort, redirect, session, url_for, request, jsonify
from jinja2 import TemplateNotFound
from application import app, db
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
# from flask.ext.login import logout_user
# from .forms import LoginForm
from model import *
from functools import wraps
from werkzeug import secure_filename
import os, sys
import urllib, pytz
import json
from sets import Set
# from router import login_required

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('user'):
            return redirect(url_for('router_index'))
        return f(*args, **kwargs)
    return decorated_function


def getAllPosts(_id=None):
    otherInfo = {}
    if _id:
        u = user.query.filter_by(id = _id).first()
        if _id != session.get('user'):
            ret = filter(lambda x: x.shared, [x for x in u.design_set])
        else:
            ret = [x for x in u.design_set]
        ret += filter(lambda x: x.shared and x not in ret, [design.query.filter_by(id=x).first() for x in json.loads(u.mark)])
        for r in ret:
            otherInfo[r.id] = {}
            l = json.loads(r.liked_by)
            # myPrint(l, session['user'])
            otherInfo[r.id]['icon'] = r.owner.icon
            otherInfo[r.id]['like_num'] = len(l)
            otherInfo[r.id]['liked'] = (session['user'] in l)
            otherInfo[r.id]['datetime'] = r.design_time.strftime("%Y-%m-%d %H:%M")
            if session.get('user'):
                l = json.loads(user.query.filter_by(id = session['user']).first().mark)
                otherInfo[r.id]['marked'] = (str(r.id) in l)
            else:
                otherInfo[r.id]['marked'] = False
            otherInfo[r.id]['myCreation'] = (r.owner_id == session["user"])
            # myPrint(r.design_mode)
    else:
        ret = design.query.all()
        for r in ret:
            otherInfo[r.id] = {}
            l = json.loads(r.liked_by)
            otherInfo[r.id]['icon'] = r.owner.icon
            otherInfo[r.id]['like_num'] = len(l)
            otherInfo[r.id]['liked'] = False
            otherInfo[r.id]['datetime'] = r.design_time.strftime("%Y-%m-%d %H:%M")
            otherInfo[r.id]['marked'] = False
    return ret, otherInfo


def getNeedHelp():
    return filter(lambda x: x.state==1 or x.state==3, design.query.filter_by(needHelp = True).all())
    # return filter(lambda x: x.state==2 or x.state==3, design.query.filter_by(needHelp = True).all())

def getPublic(_id=None):
    ret = design.query.filter_by(shared = True)
    otherInfo = {}
    if _id:
        u = user.query.filter_by(id = _id).first()
        for r in ret:
            otherInfo[r.id] = {}
            l = json.loads(r.liked_by)
            # myPrint(l, session['user'])
            otherInfo[r.id]['icon'] = r.owner.icon
            otherInfo[r.id]['like_num'] = len(l)
            otherInfo[r.id]['liked'] = (session['user'] in l)
            otherInfo[r.id]['datetime'] = r.design_time.strftime("%Y-%m-%d %H:%M")
            if session.get('user'):
                l = json.loads(user.query.filter_by(id = session['user']).first().mark)
                otherInfo[r.id]['marked'] = (str(r.id) in l)
            else:
                otherInfo[r.id]['marked'] = False
            otherInfo[r.id]['myCreation'] = (r.owner == session["user"])
            # myPrint(r.design_mode)
    else:
        ret = design.query.all()
        for r in ret:
            otherInfo[r.id] = {}
            l = json.loads(r.liked_by)
            otherInfo[r.id]['icon'] = r.owner.icon
            otherInfo[r.id]['like_num'] = len(l)
            otherInfo[r.id]['liked'] = False
            otherInfo[r.id]['datetime'] = r.design_time.strftime("%Y-%m-%d %H:%M")
            otherInfo[r.id]['marked'] = False
    return ret, otherInfo


def getUserPublic(_id):
    u = user.query.filter_by(id = _id).first()
    ret = filter(lambda x: x.shared, u.design_set)
    otherInfo = {}
    for r in ret:
        otherInfo[r.id] = {}
        l = json.loads(r.liked_by)
        # myPrint(l, session['user'])
        otherInfo[r.id]['icon'] = r.owner.icon
        otherInfo[r.id]['like_num'] = len(l)
        otherInfo[r.id]['liked'] = (session['user'] in l)
        otherInfo[r.id]['datetime'] = r.design_time.strftime("%Y-%m-%d %H:%M")
        l = json.loads(u.mark)
        # myPrint(l, r.id, (str(r.id) in l))
        otherInfo[r.id]['marked'] = (str(r.id) in l)
        otherInfo[r.id]['myCreation'] = (r.owner == session["user"])
        # myPrint(r.design_mode)
    return ret, otherInfo


def libs_errorMsg(msg):
    return jsonify({'code': 1, 'message': msg})


def libs_success():
    return jsonify({'code': 0})


# General dirty list processor
def libs_list_insert(list_string, element):
    l = json.loads(list_string)
    if element in l:
        return None
    l.append(element)
    ret = json.dumps(l)
    return ret
def libs_list_delete(list_string, element):
    l = json.loads(list_string)
    if not element in l:
        return None
    l.remove(element)
    ret = json.dumps(l)
    return ret
##############################


def libs_setLike(user_id, design_id, isLike):
    d = design.query.filter_by(id=design_id).first()
    if not d:
        return libs_errorMsg('Error Design ID: %s' % design_id)
    tmp = ""
    if isLike:
        tmp = libs_list_insert(d.liked_by, user_id)
        if tmp is None:
            return libs_errorMsg('Already Liked')
    else:
        tmp = libs_list_delete(d.liked_by, user_id)
        if tmp is None:
            return libs_errorMsg('Not Liked')
    d.liked_by = tmp
    db.session.commit()
    return libs_success()


def libs_setMark(user_id, design_id, isMark):
    d = design.query.filter_by(id=design_id).first()
    u = user.query.filter_by(id=user_id).first()
    if not d:
        return libs_errorMsg('Error Design ID: %s' % design_id)
    l = json.loads(u.mark)
    if isMark:
        if design_id in l:
            return libs_errorMsg('Already Marked')
        l.append(design_id)
    else:
        if design_id not in l:
            return libs_errorMsg('Not Marked')
        l.remove(design_id)
    u.mark = json.dumps(l)
    db.session.commit()
    return libs_success()


def myPrint(*str):
    print(str, file=sys.stderr)


#upload file
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


def userInfo(_id):
    u = user.query.filter_by(id=_id).first()
    ret = {
        "name": u.nickname,
        "icon": u.icon,
        "mark_num": len(json.loads(u.mark)),
        "create_num": len(u.design_set)
    }
    return ret


@app.route('/new_design')
@login_required
def new_design():
    new_design = design(user.query.filter_by(id = session['user']).first())
    new_design.save()
    return redirect(url_for('router_state', design_id = new_design.id, state_id = 1))

# @app.route('/mod_design_name', methods = ['POST'])
# @login_required
# def mod_design_name():
#     if request.method == "POST":
#         cur_design = design.query.filter_by(id = request.form.get('_id')).first()
#         if cur_design is None:
#             return jsonify({'code': 1})
#         if cur_design.owner_id != session['user']:
#             return jsonify({'code': 1})
#         cur_design.design_name = request.form.get('name')
#         db.session.commit()
#         return jsonify({'code': 0})


@app.route('/get_steps')
@login_required
def get_steps():
    # test!
    # myPrint("----- _id:%s" % request.args.get('_id'))
    # if str(request.args.get('_id')) == "233":
    #     return jsonify({
    #                 'code': 0,
    #                 'ret': 5
    #                 })
    design_query = design.query.filter_by(id = request.args.get('_id')).first()
    # design_query = None
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


@app.route('/set_like', methods=['POST'])
@login_required
def set_like():
    myPrint(request.json)
    return libs_setLike(session['user'], request.json.get("design_id"), request.json.get("isLike"))


@app.route('/set_mark', methods=['POST'])
@login_required
def set_mark():
    myPrint(request.json)
    return libs_setMark(session['user'], request.json.get("design_id"), request.json.get("isMark"))


@app.route('/delete_design', methods=['DELETE'])
@login_required
def deleteDesign():
    d = design.query.filter_by(id=request.json.get("design_id")).first()
    if not d:
        return libs_errorMsg("Error Design ID: %s" % request.json.get("design_id"))
    if d.owner_id != session['user']:
        return libs_errorMsg("You can only delete YOUR designs")
    # remove mark
    u = user.query.filter_by(id=session['user']).first()
    l = json.loads(u.mark)
    if request.json.get("design_id") in l:
        l.remove(request.json.get("design_id"))
        u.mark = json.dumps(l)
    db.session.delete(d)
    db.session.commit()
    return libs_success()


@app.route('/upload', methods = ['GET', 'POST'])
@login_required
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

@app.route('/report', methods=['POST'])
def report():
    # save report
    myPrint(request.json)
    return libs_success()


@app.route('/set_design_shared', methods=['POST'])
def setDesignShared():
    d = design.query.filter_by(id = request.json.get("_id"))
    if not d or not request.json.get("shared"):
        return libs_errorMsg("Error Design: %s" % request.json.get("_id"))
    d.shared = request.json.get("shared")
    db.session.commit()
    return libs_success()


@app.route('/set_design_need_help', methods=['POST'])
def setDesignNeedHelp():
    d = design.query.filter_by(id = request.json.get("_id"))
    if not d or not request.json.get("shared"):
        return libs_errorMsg("Error Design: %s, Shared: %S" % (request.json.get("_id"), request.json.get("shared")))
    d.needHelp = request.json.get("needHelp")
    db.session.commit()
    return libs_success()


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


def getUserNum(_id):
    if _id:
        num = {}
        u = user.query.filter_by(id=_id).first()
        num["design"] = len([x for x in u.design_set])
        num["mark"] = len(json.loads(u.mark))
        num["share"] = len(filter(lambda x: x.shared, u.design_set))
        return num
    else:
        return {}