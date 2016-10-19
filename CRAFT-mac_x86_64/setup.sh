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

echo "================================"
echo "Please manually install ./data/wkhtmltox-0.12.3_osx-cocoa-x86-64.pkg to finish the installation."
echo "If you faced permission problem while installing, please check"
echo "    System Preferences > Security & Privacy > General > Allow apps downloaded from"
echo "And switch it to \"Allow any way\"."
echo " "
echo "Please run runserver.sh to run the server :-)"
