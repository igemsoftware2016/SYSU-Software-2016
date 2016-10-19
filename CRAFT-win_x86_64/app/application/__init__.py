from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
#from flask.ext.login import LoginManager
from config import SQLALCHEMY_DATABASE_URI, SECRET_KEY, UPLOAD_FOLDER
import os, sys

app = Flask(__name__)
#app.config.from_object('config')
#app.config["APPLICATION_ROOT"] = 'application'
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.secret_key = SECRET_KEY
db = SQLAlchemy(app)

from application import router, model, dataLibs, dirtylist
