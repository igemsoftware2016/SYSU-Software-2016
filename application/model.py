from application import db
from flask.ext.login import UserMinix

class user(db.Model, UserMinix):
	id = db.Column(db.Integer, primary_key = True)
	nickname = db.Column(db.String(60), unique = False)
	email = db.Column(db.String(120), unique = True)
	password = db.Column(db.String(120), unique = False)
	posts = db.relationship('Post', backref = 'author', lazy = 'dynamic')
	def get_id(self):
		return self.id

	def check_pw(self, pw):
		return password == pw

	def __init__(self, nickname, email, password):
		self.nickname = nickname
		self.email = email
		self.password = password

	def __repr__(self):
		return '<User %r>' % (self.nickname)

