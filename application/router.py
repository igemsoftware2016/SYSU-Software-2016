from flask import Flask, render_template, abort, redirect, session, url_for, request, g, jsonify
from jinja2 import TemplateNotFound
from application import app, db
#from flask.ext.login import logout_user
#from .forms import LoginForm
from model import *
from functools import wraps

def login_required(f):
	@wraps(f)
	def decorated_function(*args, **kwargs):
		if not session.get('user'):
			return redirect(url_for('router_index'))
		return f(*args, **kwargs)
	return decorated_function

@app.route('/')
def router_index():
	return render_template('login.html')

@app.route('/testlogin')
def router_testlogin():
	return render_template('testlogin.html')

@app.route('/login', methods = ['GET', 'POST'])
def router_login():
	if request.method == "POST":
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
		return redirect(url_for('router_profile'))

@app.route('/register', methods = ['GET', 'POST'])
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
		return redirect(url_for('router_profile'))

@app.route('/profile')
@login_required
def router_profile():
	return render_template('profile.html', user = user.query.filter_by(id = session['user']).first().nickname)

@app.route('/state/<design_id>/<state_id>')
@login_required
def router_state(design_id, state_id):
	cur_design = design.query.filter_by(id = design_id).first()
	if cur_design is None:
		return redirect(url_for('router_profile'))
	session['design'] = design_id
	if state_id > cur_design.state:
		state_id = cur_design.state
	if state_id == 1:
		return render_template('state_1.html', matters = dict_matters, medium = dict_medium, flora = dict_flora)
	elif state_id == 2:
		cur_calculator = calculator.query.filter_by(md5 = cur_design.md5_state1).first()
		if cur_calculator.ans == -1:
			return render_template('pending.html')
		return render_template('state_2.html', bacteria = dict_bacteria, plasmid = dict_placmid)
	elif state_id == 3:
		cur_calculator = calculator.query.filter_by(md5 = cur_design.md5_state2).first()
		if cur_calculator.ans == -1:
			return render_template('pending.html')
		return render_template('state_3.html', y_list = dict_ylist)
	elif state_id == 4:
		return render_template('state_4.html', pdf_pos = where_is_the_pdf)
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
	new_design = design(session['user'])
	new_design.save()
	return redirect(url_for('router_state', design_id = new_design.id, state_id = 1))

@app.route('/get_steps', methods = ['GET', 'POST'])
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

@app.route('/save_state_<state_id>', methods = ['GET', 'POST'])
@login_required
def save_state():
	if method == 'POST':
		cur_design = design.query.filter_by(id = session['design']).first()
		if cur_design.owner_id != session['user']:
			return redirect(url_for('router_profile'))
		#process data
		db.session.commit()
		return redirect(url_for('router_state'), design_id = session['design'], state_id = state_id)

@app.route('/commit_state_<state_id>', methods = ['GET', 'POST'])
@login_required
def save_state():
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

@app.route('/get_state_<state_id>_saved', methods = ['GET', 'POST'])
@login_required
def get_state_saved():
	if method == 'GET':
		cur_design = design.query.filter_by(id = request.args.get('_id')).first()
		if cur_design.owner_id != session['user']:
			return redirect(url_for('router_profile'))
		if state_id > cur_design.state:
			return redirect(url_for('router_state', design_id = cur_design.id, state_id = cur_design.state))
		return jsonify({})

