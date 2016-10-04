from flask import Flask, render_template, abort
from jinja2 import TemplateNotFound
from application import app

@app.route('/')
def router_index():
	return render_template('login.html')

@app.route('/profile')
def router_profile():
	return render_template('profile.html')

@app.route('/state<int:state_id>')
def router_state(state_id):
	try:
		return render_template('state_%r.html' % state_id)
	except TemplateNotFound:
		abort(404)

@app.errorhandler(404)
def router_not_found(error):
	return render_template('404.html'), 404