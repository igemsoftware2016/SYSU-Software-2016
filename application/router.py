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
        print(request.form)
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
        return jsonify({'code': 0})

@app.route('/profile')
@login_required
def router_profile():
    return render_template('profile.html', user = user.query.filter_by(id = session['user']).first().nickname)

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
        return render_template('state_1.html')#, matters = dict_matters, medium = dict_medium, flora = dict_flora)

    elif state_id == 2:
        cur_calculator = calculator.query.filter_by(md5 = cur_design.md5_state1).first()
        if cur_calculator.ans == -1:
            return render_template('pending.html')
        return render_template('state_2.html')#, bacteria = dict_bacteria, plasmid = dict_placmid)

    elif state_id == 3:
        cur_calculator = calculator.query.filter_by(md5 = cur_design.md5_state2).first()
        if cur_calculator.ans == -1:
            return render_template('pending.html')
        return render_template('state_3.html')#, y_list = dict_ylist)

    elif state_id == 4:
        return render_template('state_4.html')#, pdf_pos = where_is_the_pdf)

    return render_template('state_%r.html' % state_id)

@app.route('/logout')
@login_required
def router_logout():
    session.pop('user', None)
    return redirect(url_for('router_index'))

@app.errorhandler(404)
def router_not_found(error):
    return render_template('404.html'), 404

# Implements

@app.route('/new_design')
@login_required
def new_design():
    new_design = design(user.query.filter_by(id = session['user']).first())
    new_design.save()
    return redirect(url_for('router_state', design_id = new_design.id, state_id = 1))

@app.route('/get_steps', methods = ['GET'])
@login_required
def get_steps():
    if request.method == "GET":
        design_query = design.query.filter_by(id = request.args.get('_id')).first()
        return_code = 0
        return_state = 0
        if design_query is None:
            return_code = 1
            return_state = -1
        else:
            return_code = 0
            return_state = design_query.state
        return jsonify({
                        'code': return_code,
                        'ret': return_state
                        })

@app.route('/save_state_<state_id>', methods = ['POST'])
@login_required
def save_state(state_id):
    if method == 'POST':
        cur_design = design.query.filter_by(id = session['design']).first()
        if cur_design.owner_id != session['user']:
            return redirect(url_for('router_profile'))
        #process data
        db.session.commit()
        return redirect(url_for('router_state'), design_id = session['design'], state_id = state_id)

@app.route('/commit_state_<state_id>', methods = ['POST'])
@login_required
def commit_state(state_id):
    if method == 'POST':
        cur_design = design.query.filter_by(id = session['design']).first()
        if cur_design.owner_id != session['user']:
            return redirect(url_for('router_profile'))
        #process data
        db.session.commit()
        if state_id == cur_design.state:
            cur_design.state += 1
        if state_id == 5:
            return redirect(url_for('router_profile'))
        return redirect(url_for('router_state'), design_id = session['design'], state_id = state_id + 1)

@app.route('/get_state_<state_id>_saved', methods = ['GET'])
@login_required
def get_state_saved(state_id):
    if method == 'GET':
        cur_design = design.query.filter_by(id = request.args.get('_id')).first()
        if cur_design.owner_id != session['user']:
            return redirect(url_for('router_profile'))
        if state_id > cur_design.state:
            return redirect(url_for('router_state', design_id = cur_design.id, state_id = cur_design.state))
        return jsonify({})

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
        ares = {"title": m.matter_name, "description": ""}
        results.append(ares)
        counter += 1
        if counter >= 10:
            break
    return jsonify({
                    "success": True,
                    "results": 
                    {"matters":
                        {
                        "name": "Matters",
                        "results": results
                        }
                    }
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
