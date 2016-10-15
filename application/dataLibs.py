# -*- coding=utf-8 -*-
from __future__ import print_function
from flask import Flask, render_template, abort, redirect, session, url_for, request, jsonify
from jinja2 import TemplateNotFound
from application import app, db
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
# from flask.ext.login import logout_user
# from .forms import LoginForm
from model import *
from dirtylist import *
from functools import wraps
from werkzeug import secure_filename
import os, sys
import urllib, pytz
import json
import math
from sets import Set
import pdfkit
import wkhtmltopdf
from xlrd import open_workbook
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
    ret = design.query.filter_by(shared = True).all()
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


def libs_success(ret = None):
    return jsonify({'code': 0, 'ret': ret})


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
        return libs_errorMsg("Error Design ID")
    else:
        return libs_success(design_query.state)


def save_state1(cur_design, data_dict):
    #myPrint(request.json)

    # state1 data generation
    # cur_design.design_mode = request.form.get('mode')
    cur_data = state1_data()
    d_input = data_dict.get('inputs')
    if data_dict.get('mode') == 'make':
        for m in d_input:
            new_make_matter = make_matter(cur_data, matterDB.query.filter_by(matter_name = m.get('name')).first(), float(m.get('lower')), float(m.get('upper')), bool(m.get('maxim')))
            new_make_matter.save()
            tmplist = libs_list_insert(cur_data.make_matter, new_make_matter.id)
            cur_data.make_matter = tmplist
    elif data_dict.get('mode') == 'resolve':
        for m in d_input:
            new_resolve_matter = resolve_matter(cur_data, matterDB.query.filter_by(matter_name = m.get('name')).first(), float(m.get('begin')))
            new_resolve_matter.save()
            tmplist = libs_list_insert(cur_data.resolve_matter, new_resolve_matter.id)
            cur_data.resolve_matter = tmplist

    d_order = data_dict.get('other')
    cur_data.reaction_time = float(d_order.get('time'))
    cur_data.medium = mediumDB.query.filter_by(id = int(d_order.get('medium'))).first()

    for floras in d_order.get('env'):
        # myPrint(floras)
        flora = floraDB.query.filter_by(name = floras).first()
        if not flora:
            continue
        # myPrint(cur_data.flora)
        tmplist = libs_list_insert(cur_data.flora, flora.id)
        # myPrint(tmplist)
        if tmplist is not None:
            cur_data.flora = tmplist

    if cur_design.state1_data:
        db.session.delete(cur_design.state1_data)
    cur_design.state1_data = cur_data


def save_state2(cur_design, data_dict):
    for bact in data_dict["bacteria"]:
        cur_bact = used_bacteria.query.filter_by(id = bact["_id"]).first()
        if cur_bact is None:
            continue
        for plas in bact["plasmid"]:
            for enzy in plas["pathway"]:
                cur_enzy = enzyme.query.filter_by(name = enzy["name"]).first()
                if cur_enzy is None:
                    continue
                cur_enzy.mRNA_s = enzy["mRNA_s"]
                cur_enzy.protein_s = enzy["protein_s"]
                cur_enzy.detected_promoter = libs_list_query(cur_enzy.promoter).index(id = enzy["prom"])
                cur_enzy.detected_rbs = libs_list_query(cur_enzy.rbs).index(id = enzy["RBS"])


@app.route('/save_state_<int:state_id>', methods = ['POST'])
@login_required
def save_state(state_id):
    # need attention, you should change `request.form` to `request.json`
    #   and access other parmas in a totally different way
    if request.method == 'POST':

        #
        # get design from db
        #
        cur_design = design.query.filter_by(id = request.json.get('design_id')).first()

        if cur_design.owner_id != session['user']:
            return redirect(url_for('router_profile'))
        if cur_design.state < state_id:
            return libs_errorMsg("Invalid state id!")

        if state_id == 1:
            # myPrint(request.json)
            save_state1(cur_design, request.json)
        
        elif state_id == 2:
            save_state2(cur_design, request.json)

        elif state_id == 5:
            cur_design.state5_saved_data = json.dumps(request.json)
            cur_design.state5_upload_file = False

        db.session.commit()
        return libs_success()


@app.route('/commit_state_<int:state_id>', methods = ['GET', 'POST'])
@login_required
def commit_state(state_id):
    if request.method == 'POST':
        # myPrint("I'm in!")
        cur_design = design.query.filter_by(id = request.json['design_id']).first()
        if cur_design.owner_id != session['user']:
            return jsonify({"code": 1})

        if state_id == 1:
            save_state1(cur_design, request.json)
        
        elif state_id == 2:
            save_state2(cur_design, request.json)
        
        if state_id == 5:
            return libs_errorMsg("No next step")

        if state_id == cur_design.state:
            cur_design.state += 1

        db.session.commit()
        return libs_success("/state/%d/%d" % (state_id, cur_design.state))

    # cur_design = design.query.filter_by(id = request.args.get('design_id')).first()
    # cur_design.state += 1 #for test
    # db.session.commit()
    # return jsonify({"code": 0, "state": cur_design.state})


@app.route('/get_state_<int:state_id>_saved', methods = ['GET'])
@login_required
def get_state_saved(state_id):
    if request.method == 'GET':
        cur_design = design.query.filter_by(id = request.args.get('design_id')).first()
        if cur_design is None:
            return libs_errorMsg("Design not found")
        if cur_design.owner_id != session['user']:
            return libs_errorMsg('Not your design')
        if state_id > cur_design.state:
            return libs_errorMsg('Not reach that step yet')
        if cur_design.state1_data is None:
            return libs_success()

        if state_id == 1:
            ret = dict()
            ret["design_id"] = cur_design.id
            ret["mode"] = cur_design.design_mode
            cur_data = cur_design.state1_data
            ret["other"] = {"medium": cur_data.medium_id, "time": cur_data.reaction_time, "env": [], "mediumName": cur_data.medium.name}
            for x in libs_list_query(cur_data.flora):
                ret["other"]["env"].append(floraDB.query.filter_by(id = x).first().name)
            ret["input"] = []
            if cur_design.design_mode == "make":
                for x in libs_list_query(cur_data.make_matter):
                    tmp_matter = make_matter.query.filter_by(id = x).first()
                    ret["input"].append({"upper": tmp_matter.upper, "lower": tmp_matter.lower, "name": tmp_matter.matter.matter_name, "maxim": tmp_matter.maxim})
            else:
                for x in libs_list_query(cur_data.resolve_matter):
                    tmp_matter = resolve_matter.query.filter_by(id = x).first()
                    ret["input"].append({"name": tmp_matter.matter.matter_name, "begin": tmp_matter.begin})
            return libs_success(ret)

        elif state_id == 2:
            cur_data = cur_design.state2_data
            if cur_data is None:
                return libs_errorMsg("Not calculated yet")
            ret = dict()
            ret["time"] = cur_design.state1_data.reaction_time
            ret["bacteria"] = []
            _id = 1
            total_pro = []
            total_rbs = []
            # myPrint(cur_data)
            # myPrint(cur_data.bacteria)
            for bact in libs_list_query(cur_data.bacteria):
                cur_bact = used_bacteria.query.filter_by(id = bact).first()
                if cur_bact is None:
                    break
                ret_bact = {"name": cur_bact.flora.name, "_id": _id}
                _id += 1
                ret_bact["plasmid"] = []
                plasmid_count = int(math.ceil(len(libs_list_query(cur_bact.enzyme)) / 3.0))
                print(plasmid_count)
                for i in range(plasmid_count):
                    cur_plas = plasmidDB.query.filter_by(id = i + 1).first()
                    ret_plas = {"_id": i + 1, "name": cur_plas.name, "pathway": []}
                    for j in range(3):
                        if len(libs_list_query((cur_bact.enzyme))) <= i * 3 + j:
                            break
                        cur_enzy = enzyme.query.filter_by(id = libs_list_query(cur_bact.enzyme)[i * 3 + j]).first()
                        ret_enzy =  {
                                        "_id": j + 1,
                                        "name": cur_enzy.name[0 : cur_enzy.name.find('_')],
                                        "prom": promoter.query.filter_by(id = libs_list_query(cur_enzy.promoter)[cur_enzy.detected_promoter]).first().id,
                                        "RBS": rbs.query.filter_by(id = libs_list_query(cur_enzy.rbs)[cur_enzy.detected_rbs]).first().id,
                                        "CDS": 1,
                                        "term": 1,
                                        "mRNA_s" : cur_enzy.mRNA_s,
                                        "protein_s" : cur_enzy.protein_s,
                                        "strength": {}
                                    }
                        all_pro = []
                        for t in libs_list_query(cur_enzy.promoter):
                            tmppro = promoter.query.filter_by(id = t).first()
                            if tmppro:
                                all_pro.append(tmppro)
                        total_pro.extend(all_pro)
                        ret_enzy["strength"]["promoter_lower"] = all_pro[0].strength
                        ret_enzy["strength"]["promoter_upper"] = all_pro[len(all_pro) - 1].strength
                        ret_enzy["strength"]["promoter"] = []
                        for pro in all_pro:
                            ret_enzy["strength"]["promoter"].append({"s": pro.strength, "info": pro.id})
                        all_rbs = []
                        for t in libs_list_query(cur_enzy.rbs):
                            tmprbs = rbs.query.filter_by(id = t).first()
                            if tmprbs:
                                all_rbs.append(tmprbs)
                        total_rbs.extend(all_rbs)
                        ret_enzy["strength"]["RBS_lower"] = all_rbs[0].strength
                        ret_enzy["strength"]["RBS_upper"] = all_rbs[len(all_rbs) - 1].strength
                        ret_enzy["strength"]["RBS"] = []
                        for rbss in all_rbs:
                            ret_enzy["strength"]["RBS"].append({"s": rbss.strength, "info": rbss.id})
                        ret_enzy["strength"]["mRNA_lower"] = 0
                        ret_enzy["strength"]["mRNA_upper"] = 10
                        ret_enzy["strength"]["protein_lower"] = 0
                        ret_enzy["strength"]["protein_upper"] = 10
                        ret_plas["pathway"].append(ret_enzy)
                    ret_bact["plasmid"].append(ret_plas)    
                ret["bacteria"].append(ret_bact)
            ret["promoter_Info"] = dict()
            for pro in total_pro:
                ret["promoter_Info"][pro.id] =  {
                                                    "name": pro.name,
                                                    "type": pro.type_,
                                                    "BBa": pro.BBa,
                                                    "Introduction": pro.Introduction,
                                                    "NCBI": pro.NCBI,
                                                    "FASTA": pro.FASTA
                                                }
            ret["RBS_Info"] = dict()
            for rbss in total_rbs:
                ret["RBS_Info"][rbss.id] =  {
                                                    "name": rbss.name,
                                                    "type": rbss.type_,
                                                    "BBa": rbss.BBa,
                                                    "Introduction": rbss.Introduction,
                                                    "NCBI": rbss.NCBI,
                                                    "FASTA": rbss.FASTA
                                            }
            ret["CDS_Info"] =   {
                                    "1": {
                                        "name": "Specified CDS for enzyme"
                                    }
                                }
            ret["term_Info"] =  {
                                    "1": {
                                        "name": terminalDB["name"],
                                        "BBa": terminalDB["BBa"],
                                        "Introduction": terminalDB["Introduction"]
                                    }
                                }

            return libs_success(ret)

        elif state_id == 3:
            ret = {"time": cur_design.state1_data.reaction_time, "datasets" : []}
            plot_dict = libs_dict_query_all(cur_design.state3_matter_plot)
            for reac_name in plot_dict.keys():
                ret["datasets"].append({"name": reac_name, "data": plot_dict[reac_name]})
            return libs_success(ret)

        elif state_id == 5:
            return libs_success(json.loads(cur_design.state5_saved_data))


@app.route('/process/<int:design_id>', methods = ['GET', 'POST'])
def process_local_calc(design_id):
    cur_design = design.query.filter_by(id = design_id).first()
    if cur_design is None:
        return jsonify({"state": 0})

    # Receive from local
    if request.method == 'POST':
        if request.json.get("code") != 0:
            return libs_errorMsg("Local calculate failed")
        if cur_design.state == 2:

            print(request.json)
            cur_data = state2_data()
            # myPrint(cur_data)
            for bact in request.json.get("bacteria"):
                origin_bact = floraDB.query.filter_by(code = bact.get("name")).first()
                cur_bact = used_bacteria(origin_bact)
                for enzy in bact.get("enzyme"):
                    cur_enzy = enzyme(enzy.get("sequence"), enzy.get("name"), floraDB.query.filter_by(code = enzy.get("from")).first())
                    for pro in enzy.get("promoter"):
                        cur_promo = promoter(pro.get("sequence"), float(pro.get("strength")))
                        cur_promo.save()
                        tmpprolist = libs_list_insert(cur_enzy.promoter, cur_promo.id)
                        if tmpprolist:
                            cur_enzy.promoter = tmpprolist
                    for rbss in enzy.get("rbs"):
                        cur_rbs = rbs(rbss.get("sequence"), rbss.get("strength"))
                        cur_rbs.save()
                        tmprbslist = libs_list_insert(cur_enzy.rbs, cur_rbs.id)
                        if tmprbslist:
                            cur_enzy.rbs = tmprbslist
                    tmpenzylist = libs_list_insert(cur_bact.enzyme, cur_enzy.id)
                    if tmpenzylist:
                        cur_bact.enzyme = tmpenzylist
                tmpbactlist = libs_list_insert(cur_data.bacteria, cur_bact.id)
                if tmpbactlist:
                    cur_data.bacteria = tmpbactlist
                # print(cur_data.bacteria)
            if cur_design.state2_data:
                db.session.delete(cur_design.state2_data)
            cur_design.state2_data = cur_data

        elif cur_design.state == 3:
            plot_data = request.json.get("data")
            cur_design.state3_matter_plot = '{}'
            for i in plot_data.keys():
                tmpplot = libs_dict_insert(cur_design.state3_matter_plot, i, plot_data[i])
                if tmpplot:
                    cur_design.state3_matter_plot = tmpplot

        db.session.commit()
        return libs_success()

    ret = dict()
    ret["state"] = cur_design.state

    # Send to local
    if cur_design.state == 2:
        cur_data = cur_design.state1_data
        if cur_data is None:
            return jsonify({"state": 0})
        ret["matters"] = []
        if cur_design.design_mode == "make":
            ret["mode"] = "synthetic"
            for x in libs_list_query(cur_data.make_matter):
                tmpmat = make_matter.query.filter_by(id = x).first()
                tmpcon = tmpmat.lower
                if tmpmat.maxim:
                    tmpcon = tmpmat.upper
                ret["matters"].append({"code": tmpmat.matter.matter_code, "con": tmpcon})
        else:
            ret["mode"] = "decompose"
            for x in libs_list_query(cur_data.resolve_matter):
                tmpmat = resolve_matter.query.filter_by(id = x).first()
                ret["matters"].append({"code": tmpmat.matter.matter_code, 'con': tmpmat.begin})
        ret["medium"] = []
        for x in libs_list_query(cur_data.medium.matters):
            ret["medium"].append({"code": matterDB.query.filter_by(id = x).first().matter_code, "con": libs_dict_query(cur_data.medium.concentration, x)})
        return jsonify(ret)

    if cur_design.state == 3:
        cur_data = cur_design.state2_data
        if cur_data is None:
            return jsonify({"state": 0})
        ret["initial_matters"] = []
        ret["insert_matters"] = []
        for x in libs_list_query(cur_design.state1_data.medium.matters):
            ret["insert_matters"].append({"code": matterDB.query.filter_by(id = x).first().matter_code, "con": libs_dict_query(cur_design.state1_data.medium.concentration, x)})
        ret["bacteria"] = []
        for x in libs_list_query(cur_data.bacteria):
            tmpbact = used_bacteria.query.filter_by(id = x).first()
            tmpret = {"code": tmpbact.flora.code}
            tmpret["enzyme"] = []
            for e in libs_list_query(tmpbact.enzyme):
                tmpret["enzyme"].append(enzyme.query.filter_by(id = e).first().name)
            ret["bacteria"].append(tmpret)
        return jsonify(ret)

    return libs_errorMsg("Now not calculating state")


@app.route('/search/matters/<matter_name>')
def search_matters_name(matter_name):
    querier = matterDB.query.filter(matterDB.matter_name.ilike('%'+matter_name+'%'))
    if querier.first() is None:
        return jsonify({
                        "success": False
                        })
    results = []
    counter = 1
    for m in querier:
        ares = {"title": m.matter_name}
        results.append(ares)
        counter += 1
        if counter >= 10:
            break
    return jsonify({
                    "success": True,
                    "results": results
                    })


@app.route('/search/microbiota/<bact_name>')
def search_bact_name(bact_name):
    querier = floraDB.query.filter(floraDB.name.ilike('%'+bact_name+'%'))
    if querier.first() is None:
        return jsonify({
                        "success": False
                        })
    results = []
    counter = 1
    for m in querier:
        ares = {"title": m.name}
        results.append(ares)
        counter += 1
        if counter >= 5:
            break
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

# mark manually
# libs_success()
# libs_errorMsg()
@app.route('/upload/<int:design_id>/<int:state_id>', methods = ['GET', 'POST'])
@login_required
def upload_file(design_id, state_id):

    if not design.query.filter_by(id = state_id).first():
        return libs_errorMsg("No such design")
    if state_id != 1 and state_id != 5:
        return libs_errorMsg("Invalid state")
    cur_design = design.query.filter_by(id = design_id).first()
    if cur_design is None:
        return libs_errorMsg("Invalid design ID")
    if state_id == 5 and cur_design.state < 5:
        return libs_errorMsg("Invalid state")

    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = "design-" + str(design_id) + ".xls"
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            if state_id == 1:
                book = open_workbook(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                sheet = book.sheet_by_index(0)
                
                data = {}
                data["design_id"] = str(design_id)
                if sheet.cell(0,1).value == 'Products' :
                    data["mode"] = "make"
                else:
                    data["mode"] = "resolve"
                data["inputs"] = []

                numMater = int(sheet.cell(0,3).value)
                for i in xrange(2, 2 + numMater):
                    mater_name = sheet.cell(i, 0).value
                    init_con = sheet.cell(i, 1).value
                    lower = sheet.cell(i, 2).value
                    upper = sheet.cell(i, 3).value
                    max_con = sheet.cell(i, 4).value

                    matter_i = {}
                    matter_i["name"] = mater_name
                    if data["mode"] == "resolve":
                        matter_i["begin"] = str(init_con)
                    else:
                        matter_i["lower"] = str(lower)
                        matter_i["upper"] = str(upper)
                        matter_i["maxim"] = (max_con > 0)
                    data["inputs"].append(matter_i)
                
                cnt = 2 + numMater + 1
                numEnv = int(sheet.cell(cnt, 1).value)
                data["other"] ={}
                data["other"]["env"] = []
                for i in xrange(cnt + 1, cnt + 1 + numEnv):
                    envBtr = sheet.cell(i, 0).value
                    data["other"]["env"].append(envBtr)
                
                cnt += 1 + numEnv

                time = sheet.cell(cnt, 1).value
                data["other"]["time"] = str(time)
                cnt += 1
                matNum = int(sheet.cell(cnt, 1).value)

                medium_cur = {}
                ##########
                for i in xrange(cnt + 1, cnt + 1 + matNum):
                    mater_name = sheet.cell(i, 0).value
                    con = sheet.cell(i, 1).value
                    medium_cur[mater_name] = str(con)
                ##########
                
                new_medium = mediumDB("user_inserted", medium_cur)
                new_medium.save()

                data["other"]["medium"] = new_medium.id
                save_state1(cur_design, data)
                cur_design.state1_upload_file = True
            else:
                cur_design.state5_upload_file = True
                cur_design.state5_file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            return libs_success()

        return libs_errorMsg("Upload failed")

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
    d = design.query.filter_by(id = request.json.get("_id")).first_or_404()
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


@app.route('/setDesignName', methods=['POST'])
@login_required
def setDesignName():
    myPrint(request.json)
    designID = request.json.get("_id")
    d = design.query.filter_by(id=designID).first()
    if not d:
        return libs_errorMsg("Error ID")
    if d.owner_id != session['user']:
        abort(403)
    name = request.json.get("name")
    mode = request.json.get("mode")
    d.design_name = name
    if mode:
        d.design_mode = mode
    db.session.commit()
    return libs_success()


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

@app.route('/state2_chart/<float:promoter>/<float:rbs>/<float:mrna>/<float:protein>', methods=['GET', 'POST'])
def state2_chart(promoter, rbs, mrna, protein):
    k1 = promoter
    k2 = rbs
    d1 = mrna
    d2 = protein
    res = {}
    y = []
    for t in xrange(0, 21):
        if abs(d1 - d2) < 1e-8:
            d = (d1 + d2) / 2.0
            pro = -k2 * math.exp(-d * t) * (k1 + k1 * (d * t - 1) * math.exp(d * t)) / d / d
            pro -= k2 * t * math.exp(-d * t) * (k1 - k1 * math.exp(d * t)) / d
            y.append(round(pro, 4))
        else:
            part1 = math.exp(-d2 * t) * (k1 * k2 / (d2 - d1) / d1 + k1 * k2 / (d1 - d2) / d1 - k1 * k2 / (d1 - d2) / d2 +
            k1 * k2 * math.exp(d2 * t)/ (d1 - d2) / d2)
            part2 = math.exp(-d1 * t) * (- k1 * k2 * math.exp(d1 * t) + k1 * k2) / (d2 - d1) / d1
            y.append(round(part1 - part2, 4))
    res["y"] = y
    return libs_success(res)

@app.route('/protocol_pdf/<int:design_id>', methods=['GET', 'POST'])
def protocol_pdf(design_id):

    #sudo apt-get install wkhtmltopdf
    filename = str(design_id) + ".pdf"
    appdir = os.path.abspath(os.path.dirname(__file__))

    protocol_html = """
    <html>
        <head>
            <title> protocol </title>
        </head>
        <body>
            <div>
    """

    for i in xrange(1, 5):
        file_object = open(os.path.join(appdir, 'static/protocol/exp1/part' + str(i) + '/1.txt'))
        try:
            all_the_text = file_object.read( )
        finally:
            file_object.close( )
        protocol_html += "<h1>exp1 part" + str(i) + "</h1>"
        protocol_html += '<div>' + all_the_text + '</div>'

    for i in xrange(1, 6):
        file_object = open(os.path.join(appdir, 'static/protocol/exp2/part' + str(i) + '/1.txt'))
        try:
            all_the_text = file_object.read( )
        finally:
            file_object.close( )
        protocol_html += "<h1>exp2 part" + str(i) + "</h1>"
        protocol_html += '<div>' + all_the_text + '</div>'

    protocol_html += """
            </div>
        </body>
    </html>
    """
    
    print (protocol_html)

    pdfkit.from_string(protocol_html, os.path.join(appdir, 'static/pdf/' + filename))
    res = {}
    res["name"] = str(design_id) + ".pdf"
    return libs_success(res)
