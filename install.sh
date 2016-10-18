#!/bin/sh

set -e

echo "================================"
echo "CRAFT"
echo "              SYSU-Software 2016"
echo "================================"

echo "installing pip"

python get-pip.py

echo "installing dependencies"

pip install flask
pip install wkhtmltopdf
pip install flask-sqlalchemy
pip install xlrd
pip install pytz
pip install pdfkit

echo "Done"
echo "python2.7 run.py to run server"
