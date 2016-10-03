from application import db

class user(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	nickname = db.Column(db.String(60), unique = False)
	email = db.Column(db.String(120), unique = True)
	#password = db.Column(db.String(120), unique = False)
	posts = db.relationship('Post', backref = 'author', lazy = 'dynamic')
	def is_authenticated(self):
		return True
	def is_active(self):
		return True
	def is_anonymous(self):
		return False
	def get_id(self):
		return unicode(self.id)
	def __repr__(self):
		return '<User %r>' % (self.nickname)