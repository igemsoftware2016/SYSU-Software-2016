import os
basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'iGEM.db')
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
SQLALCHEMY_TRACK_MODIFICATIONS = True

UPLOAD_FOLDER = os.path.join(basedir, 'application/static/upload')

CSRF_ENABLED = True
SECRET_KEY = "0AQ38M80GtVXi0k9N0szUEIdI2jm7UhM"