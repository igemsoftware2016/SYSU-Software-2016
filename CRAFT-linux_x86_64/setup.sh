#!/bin/bash

set -e

echo "========================================================================"
echo "                                                                        "
echo "  CRAFT - Community-based Retro-synthetic Analysis Functional plaTform  "
echo "  SYSU Software 2016.                                                   "
echo "                                                                        "
echo "========================================================================"

cd "`dirname $0`"

echo "Installing pip..."
pushd data
python2 get-pip.py

echo "Installing wkhtmltopdf..."
tar xvfJ wkhtmltox-0.12.3_linux-generic-amd64.tar.xz
pushd wkhtmltox/bin
sudo mv ./wkhtmltopdf /usr/bin/wkhtmltopdf
sudo chmod +x /usr/bin/wkhtmltopdf
popd

pushd app
echo "Installing other dependencies..."
python2 -m pip install -r requirements.txt
popd
popd
echo ""
echo "Deployment DONE!"
echo "Please run runserver.sh to run the server :-)"

