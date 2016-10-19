#!/bin/sh

set -e

echo "========================================================================"
echo "                                                                        "
echo "  CRAFT - Community-based Retro-synthetic Analysis Functional plaTform  "
echo "  SYSU Software 2016.                                                   "
echo "                                                                        "
echo "========================================================================"

cd "`dirname $0`"

echo "installing pip"
pushd data
python2 get-pip.py

echo "installing dependencies"
pushd app
python2 -m pip install flask
python2 -m pip install wkhtmltopdf
python2 -m pip install flask-sqlalchemy
python2 -m pip install xlrd
python2 -m pip install pytz
python2 -m pip install pdfkit

popd
popd

echo "Done"
echo "python2 data/app/run.py to run server"
