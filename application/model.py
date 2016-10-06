from application import db
#from flask.ext.login import UserMinix

class user(db.Model):
	#__tablename__ = 'user'
	id = db.Column(db.Integer, primary_key = True)
	nickname = db.Column(db.String(60))
	email = db.Column(db.String(120), unique = True)
	password = db.Column(db.String(120))
	def get_id(self):
		return self.id
	def check_pw(self, pw):
		return self.password == pw
	def __init__(self, nickname, email, password):
		self.nickname = nickname
		self.email = email
		self.password = password
	def __repr__(self):
		return '<User %r>' % self.nickname
	def save(self):
		db.session.add(self)
		db.session.commit()

class design(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	design_mode = db.Column(db.String(30))
	state = db.Column(db.Integer)
	owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	owner = db.relationship('user', backref = db.backref('design_set', lazy = 'dynamic'))
	md5_state1 = db.Column(db.String(60))
	md5_state2 = db.Column(db.String(60))
	def get_id(self):
		return self.id
	def __init__(self, owner):
		self.owner = owner
		self.state = 1
		self.md5_state1 = ''
		self.md5_state2 = ''
	def __repr__(self):
		return '<Design %r>' % self.id
	def save(self):
		db.session.add(self)
		db.session.commit()

class calculator(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	state = db.Column(db.Integer)
	ans = db.Column(db.Integer)
	md5 = db.Column(db.String(60))
	def __init__(self, state):
		self.state = state
		self.md5 = ''
		self.ans = -1
	def __repr__(self):
		return '<Calculator %r>' % self.md5
	def save(self):
		db.session.add(self)
		db.session.commit()
