from application import db
import random
import datetime, pytz
#from flask.ext.login import UserMinix

class user(db.Model):
    #__tablename__ = 'user'
    id = db.Column(db.Integer, primary_key = True)
    nickname = db.Column(db.String(60))
    email = db.Column(db.String(120), unique = True)
    password = db.Column(db.String(120))
    icon = db.Column(db.Integer)
    mark = db.Column(db.String(320)) # the mark list
    def get_id(self):
        return self.id
    def check_pw(self, pw):
        return self.password == pw
    def __init__(self, nickname, email, password):
        self.nickname = nickname
        self.email = email
        self.password = password
        self.icon = random.randint(0,5)
        self.mark = '[]'
    def __repr__(self):
        return '<User %r>' % self.nickname
    def save(self):
        db.session.add(self)
        db.session.commit()

class design(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    design_name = db.Column(db.String(60))
    design_mode = db.Column(db.String(30))
    description = db.Column(db.String(60))
    state = db.Column(db.Integer)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    owner = db.relationship('user', backref = db.backref('design_set', lazy = 'dynamic'))
    liked_by = db.Column(db.String(320)) # liked by user
    design_time = db.Column(db.DateTime)
    shared = db.Column(db.Boolean)
    needHelp = db.Column(db.Boolean)
    #state1 data region
    md5_state1 = db.Column(db.String(60))
    time = db.Column(db.Integer)
    medium_id = db.Column(db.Integer, db.ForeignKey('mediumDB.id'))
    medium = db.relationship('mediumDB', backref = 'all_design')
    flora_id = db.Column(db.Integer, db.ForeignKey('floraDB.id'))
    flora = db.relationship('floraDB', backref = 'all_design')
    #state2 data region
    md5_state2 = db.Column(db.String(60))
    d = dict()
    def get_id(self):
        return self.id
    def __init__(self, owner, design_mode):
        self.owner = owner
        self.state = 1
        self.liked_by = '[]'
        self.design_name = None
        self.design_mode = design_mode
        self.md5_state1 = ''
        self.md5_state2 = ''
        self.medium_id = 0
        self.flora_id = 0
        self.design_time = datetime.datetime.now(pytz.timezone('America/New_York'))
        self.d = {}
    def __repr__(self):
        return '<Design %r> %r' % (self.id, self.d)
    def __getitem__(self,key):  
        return self.d[key]  
    def __setitem__(self,key,value):
        self.d[key] = value  
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

class matterDB(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    matter_name = db.Column(db.String(120))
    matter_code = db.Column(db.String(120))
    def __init__(self, matter_name, matter_code):
        self.matter_name = matter_name
        self.matter_code = matter_code
    def __repr__(self):
        return '<Matter %r>' % self.matter_name
    def save(self):
        db.session.add(self)
        db.session.commit()

class mediumDB(db.Model):
    id = db.Column(db.Integer, primary_key = True)

class floraDB(db.Model):
    id = db.Column(db.Integer, primary_key = True)

class make_matter(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    design_id = db.Column(db.Integer, db.ForeignKey('design.id'))
    design = db.relationship('design', backref = db.backref('maked_set', lazy = 'dynamic'))
    matter_id = db.Column(db.Integer, db.ForeignKey('matterDB.id'))
    matter = db.relationship('matterDB', backref = db.backref('maked_set', lazy = 'dynamic'))
    lower = db.Column(db.Float)
    upper = db.Column(db.Float)
    maxim = db.Column(db.Boolean)
    def __init__(self, design, matter, lower, upper, maxim):
        self.design = design
        self.matter = matter
        self.lower = lower
        self.upper = upper
        self.maxim = maxim
    def __repr__(self):
        return '<Make mode matter %r>' % self.id
    def save(self):
        db.session.add(self)
        db.session.commit()

class resolve_matter(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    design_id = db.Column(db.Integer, db.ForeignKey('design.id'))
    design = db.relationship('design', backref = db.backref('resolved_set', lazy = 'dynamic'))
    matter_id = db.Column(db.Integer, db.ForeignKey('matterDB.id'))
    matter = db.relationship('matterDB', backref = db.backref('resolved_set', lazy = 'dynamic'))
    begin = db.Column(db.Float)
    def __init__(self, design, matter, begin):
        self.design = design
        self.matter = matter
        self.begin = begin
    def __repr__(self):
        return '<Resolve mode matter %r>' % self.id
    def save(self):
        db.session.add(self)
        db.session.commit()


# tip off
class report(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    design_id = db.Column(db.Integer)
    by_user_id = db.Column(db.Integer)