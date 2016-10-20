#!/bin/bash

set -e


echo "========================================================================"
echo "                                                                        "
echo "  CRAFT - Community-based Retro-synthetic Analysis Functional plaTform  "
echo "  SYSU Software 2016.                                                   "
echo "                                                                        "
echo "========================================================================"

cd "`dirname $0`"

echo "Starting CRAFT server..."
echo "Please open a browser and navigate to http://127.0.0.1:5000 :-)"

python2.7 data/app/run.py

