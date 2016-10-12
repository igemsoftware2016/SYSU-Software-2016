from application import db
import random
import datetime, pytz
import hashlib
#from flask.ext.login import UserMinix

class user(db.Model):
    id = db.Column(db.Integer, primary_key = True)          
    nickname = db.Column(db.String(60))                 # User's nickname, shown at the top of pages
    email = db.Column(db.String(120), unique = True)    # User's email, an unique key
    password = db.Column(db.String(120))                # Password('s md5)
    icon = db.Column(db.Integer)                        # User's icon's id
    mark = db.Column(db.String(320))                    # the mark list   
    def get_id(self):
        return self.id
    def check_pw(self, pw):
        return self.password == pw
    def __init__(self, nickname, email, password):
        self.nickname = nickname
        self.email = email
        self.password = password
        self.icon = random.randint(1,10)
        self.mark = '[]'
    def __repr__(self):
        return '<User %r>' % self.nickname
    def save(self):
        db.session.add(self)
        db.session.commit()


matter_in_medium = db.Table('matter_in_medium',
                   db.Column('medium_id', db.Integer, db.ForeignKey('mediumDB.id')),
                   db.Column('matter_id', db.Integer, db.ForeignKey('matterDB.id'))
                   )

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
    name = db.Column(db.String(100))
    matters = db.relationship('matterDB', secondary = matter_in_medium, backref = db.backref('used_mediums', lazy = 'dynamic'))
    def __init__(self, name):
        self.name = name
    def __repr__(self):
        return '<Medium %r>' % self.name
    def save(self):
        db.session.add(self)
        db.session.commit()

class floraDB(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    code = db.Column(db.String(100))
    name = db.Column(db.String(100))
    def __init__(self, code, name):
        self.code = code
        self.name = name
    def __repr__(self):
        return '<Flora %r>' % self.name
    def save(self):
        db.session.add(self)
        db.session.commit()

class plasmidDB(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(60))
    sequence = db.Column(db.String(500))
    def __init__(self, sequence):
        self.sequence = sequence
    def __repr__(self):
        return '<Plasmid %r>' % self.name
    def save(self):
        db.session.add(self)
        db.session.commit()

class design(db.Model):
    id = db.Column(db.Integer, primary_key = True)              # Index
    design_name = db.Column(db.String(60))                      # Name of the design
    design_mode = db.Column(db.String(30))                      # Mode of the design (Should be "synthetic" or "decompose")
    description = db.Column(db.String(300))                     # Description of the design
    state = db.Column(db.Integer)                               # State that the design is now in (1 to 5)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Owner's user id 
    owner = db.relationship('user', backref = db.backref('design_set', lazy = 'dynamic'))
    liked_by = db.Column(db.String(320))                        # List of the users like the design
    design_time = db.Column(db.DateTime)                        # Design's created time
    shared = db.Column(db.Boolean)                              # If the design is shared
    needHelp = db.Column(db.Boolean)                            # If the design's owner need help
    #state1 data region
    state1_data_id = db.Column(db.Integer, db.ForeignKey("state1_data.id"))
    state1_data = db.relationship('state1_data', backref = db.backref('owners', lazy = 'dynamic'))
    #state2 data region
    state2_data_id = db.Column(db.Integer, db.ForeignKey("state2_data.id"))
    state2_data = db.relationship('state2_data', backref = db.backref('owners', lazy = 'dynamic'))
    def get_id(self):
        return self.id
    def __init__(self, owner):
        self.owner = owner
        self.state = 1
        self.liked_by = '[]'
        self.design_name = None
        self.design_mode = ''
        self.design_time = datetime.datetime.now(pytz.timezone('America/New_York'))
        self.shared = False
        self.needHelp = False
    def __repr__(self):
        return '<Design %r> %r' % (self.id, self.d)
    def save(self):
        db.session.add(self)
        db.session.commit()

class state1_data(db.Model):
    id = db.Column(db.Integer, primary_key = True)                  # Index
    design_mode = db.Column(db.String(60))                          # Mode of the design (Should be "synthetic" or "decompose")
    reaction_time = db.Column(db.Integer)                           # Total time of the reaction
    medium_id = db.Column(db.Integer, db.ForeignKey('mediumDB.id')) # Used medium's id
    medium = db.relationship('mediumDB', backref = 'all_design')
    flora_id = db.Column(db.String(320))
    md5 = db.Column(db.String(60))                                  # All data's md5(For multi used of the calculating result)
    def refresh_md5(self):                                          # Refresh the md5 hash with all the data
        src = self.design_mode + str(self.reaction_time) + str(self.medium_id) + self.flora_id
        m = hashlib.md5()
        m.update(src)
        self.md5 = m.hexdigest()
    def __init__(self):
        self.md5 = ''
        self.flora_id = '[]'
    def __repr__(self):
        return '<State 1 data %r>' % self.md5
    def save(self):
        self.refresh_md5()
        db.session.add(self)
        db.session.commit()

class make_matter(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    data_id = db.Column(db.Integer, db.ForeignKey('state1_data.id'))
    data = db.relationship('state1_data', backref = db.backref('maked_set', lazy = 'dynamic'))
    matter_id = db.Column(db.Integer, db.ForeignKey('matterDB.id'))
    matter = db.relationship('matterDB', backref = db.backref('maked_set', lazy = 'dynamic'))
    lower = db.Column(db.Float)
    upper = db.Column(db.Float)
    maxim = db.Column(db.Boolean)
    def __init__(self, data, matter, lower, upper, maxim):
        self.data = data
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
    data_id = db.Column(db.Integer, db.ForeignKey('state1_data.id'))
    data = db.relationship('state1_data', backref = db.backref('resolved_set', lazy = 'dynamic'))
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

bacteria_set = db.Table('bacteria_set',
               db.Column('data_id', db.Integer, db.ForeignKey('state2_data.id')),
               db.Column('bacteria_id', db.Integer, db.ForeignKey('used_bacteria.id'))
            )

class state2_data(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    bacteria = db.relationship('used_bacteria', secondary = bacteria_set, backref = db.backref('used_data', lazy = 'dynamic'))
    def refresh_md5(self):
        src = ""
        m = hashlib.md5()
        m.update(src)
        self.md5 = m.hexdigest()
    def __init__(self):
        self.md5 = ''
    def __repr__(self):
        return '<State 2 data %r>' % self.md5
    def save(self):
        self.refresh_md5()
        db.session.add(self)
        db.session.commit()

bacteria_enzyme = db.Table('bacteria_enzyme',
                  db.Column('bacteria_id', db.Integer, db.ForeignKey('used_bacteria.id')),
                  db.Column('enzyme_id', db.Integer, db.ForeignKey('enzyme.id'))
                )

class used_bacteria(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    flora_id = db.Column(db.Integer, db.ForeignKey('floraDB.id'))
    flora = db.relationship('floraDB', backref = db.backref('used_bacteria_set', lazy = 'dynamic'))
    enzyme = db.relationship('enzyme', secondary = bacteria_enzyme, backref = db.backref('used_bactedia', lazy = 'dynamic'))
    def __init__(self, flora):
        self.flora = flora
    def __repr__(self):
        return '<Edited bacteria based on %r>' % self.flora_id
    def save(self):
        db.session.add(self)
        db.session.commit()

promoter_table = db.Table('promoter_table',
                 db.Column('enzyme_id', db.Integer, db.ForeignKey('enzyme.id')),
                 db.Column('promoter_id', db.Integer, db.ForeignKey('promoter.id'))
                )

# rbs_table = db.Table(
#             db.Column('enzyme_id', db.Integer, db.ForeignKey('enzyme.id')),
#             db.Column('rbs_id', db.Integer, db.ForeignKey('rbs.id'))
#             )

class enzyme(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(60))
    sequence = db.Column(db.String(500))
    promoter = db.relationship('promoter', secondary = promoter_table, backref = db.backref('used_enzyme', lazy = 'dynamic'))
    # rbs = db.relationship('rbs', secondary = promoter_table, backref = db.backref('used_enzyme', lazy = 'dynamic'))
    def __init__(self, sequence, name):
        self.sequence = sequence
        self.name = name
    def __repr__(self):
        return '<Enzyme %r>' % self.name
    def save(self):
        db.session.add(self)
        db.session.commit()

class promoter(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    sequence = db.Column(db.String(300))
    strength = db.Column(db.Float)
    def __init__(self, sequence, strength):
        self.sequence = sequence
        self.strength = strength
    def __repr__(self):
        return '<Promoter with strength %r>' % self.strength
    def save(self):
        db.session.add(self)
        db.session.commit()

# class rbs(db.Model):
#     id = db.Column(db.Integer, primary_key = True)
#     sequence = db.Column(db.String(300))
#     strength = db.Column(db.Float)
#     def __init__(self, sequence, strength):
#         self.sequence = sequence
#         self.strength = strength
#     def __repr__(self):
#         return '<RBS with strength %r>' % self.strength
#     def save(self):
#         db.session.add(self)
#         db.session.commit()

# tip off
class report(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    design_id = db.Column(db.Integer)
    by_user_id = db.Column(db.Integer)
    def __init__(self, design, user):
        self.design_id = design
        self.by_user_id = user
    def __repr__(self):
        return '<Report of design %r>' % self.design_id
    def save(self):
        db.session.add(self)
        db.session.commit()