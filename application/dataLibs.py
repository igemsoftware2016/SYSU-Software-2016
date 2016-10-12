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
import os, sys
import urllib, pytz
import json

def getAllPosts(_id=None):
    otherInfo = {}
    if _id:
        u = user.query.filter_by(id = _id).first()
        ret = u.design_set
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
            myPrint(r.design_mode)
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


def libs_errorMsg(msg):
    return jsonify({'code': 1, 'message': msg})

def libs_success():
    return jsonify({'code': 0})


def libs_setLike(user_id, design_id, isLike):
    d = design.query.filter_by(id=design_id).first()
    if not d:
        return libs_errorMsg('Error Design ID: %s' % design_id)
    l = json.loads(d.liked_by)
    if isLike:
        if user_id in l:
            return libs_errorMsg('Already Liked')
        l.append(user_id)
    else:
        if user_id not in l:
            return libs_errorMsg('Not Liked')
        l.remove(user_id)
    d.liked_by = json.dumps(l)
    db.session.commit()
    return libs_sucess()


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
    return libs_sucess()


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