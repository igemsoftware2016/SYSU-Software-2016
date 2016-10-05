from flask import Flask, render_template, abort, redirect, session, url_for, request, g, jsonify
from jinja2 import TemplateNotFound
from application import app, db
#from flask.ext.login import logout_user
#from .forms import LoginForm
from model import user
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
		print request.form.get("email")
		print request.form.get("password")
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
		print session['user']
		print checker
		return redirect(url_for('router_profile'))

@app.route('/register', methods = ['GET', 'POST'])
def router_register():
	if request.method == "POST":
		print request.form.get("email")
		print request.form.get("nickname")
		print request.form.get("password")
		if not user.query.filter_by(email = request.form.get("email")).first() is None:
			return jsonify({
							'code': 1,
							'message': 'E-mail has been registered!'
							})
		new_user = user(request.form.get("nickname"), request.form.get("email"), request.form.get("password"))
		db.session.add(new_user)
		db.session.commit()
		session['user'] = new_user.get_id()
		print session['user']
		print new_user
		return redirect(url_for('router_profile'))

@app.route('/profile')
@login_required
def router_profile():
	return render_template('profile.html', user = user.query.filter_by(id = session['user']).first().nickname)

@app.route('/state<int:state_id>')
@login_required
def router_state(state_id):
	try:
		return render_template('state_%r.html' % state_id)
	except TemplateNotFound:
		abort(404)

@app.route('/logout')
@login_required
def router_logout():
	session.pop('user', None)
	return redirect(url_for('router_index'))

@app.errorhandler(404)
def router_not_found(error):
	return render_template('404.html'), 404
