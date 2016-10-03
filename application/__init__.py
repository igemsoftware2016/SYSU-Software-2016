from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy
#from flask.ext.login import LoginManager
#from flask.ext.openid import openid
import os, sys

app = Flask(__name__)
#app.config.from_object('config')
#app.config["APPLICATION_ROOT"] = 'application'
db = SQLAlchemy(app)
#lm = LoginManager()
#lm.login_view(app)

from application import router
