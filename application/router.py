from flask import Flask, render_template, abort, redirect, session, url_for, request, g, jsonify
from jinja2 import TemplateNotFound
from application import app, lm, db
#from flask.ext.login import logout_user
#from .forms import LoginForm
from model import user
from functools import wraps

def login_required(f):
	@wraps(f)
	def decorated_function(*args, **kwargs):
		if not session['login']:
			return redirect(url_for('router_index'))
		return f(*args, **kwargs)
	return decorated_function

@app.route('/')
def router_index():
	return render_template('login.html')

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
		session['login'] = True
		session['user'] = checker.get_id()
		return redirect(url_for('router_profile'))

@app.route('/register', methods = ['GET', 'POST'])
def router_register():
	if request.method == "POST":
		if user.query.filter_by(email = request.form.get("email")).first() is None:
			return jsonify({
							'code': 1,
							'message': 'E-mail has been registered!'
							})
		new_user = user(request.form.get("nickname"), request.form.get("email"), request.form.get("password"))
		db.session.add(new_user)
		db.session.commit()
		session['login'] = True
		session['user'] = new_user.get_id()
		return redirect(url_for('router_profile'))

@app.route('/profile')
@login_required
def router_profile():
	return render_template('profile.html')

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
	session['login'] = False
	return redirect(url_for('router_index'))

@app.errorhandler(404)
def router_not_found(error):
	return render_template('404.html'), 404
