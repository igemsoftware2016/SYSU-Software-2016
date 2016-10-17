# CRAFT
Community-based Retro-synthetic Analysis Functional plaTform

## Overview
CRAFT is a integrated software for crafting synthetic biological system from design, validation to share. 
It provides concise and convenient user interface, where you can customize your own synthetic biological system by using specific algorithms to search appropriate circuits and simulate and your validation experiment will be supported with our standard protocols. Your also can share your designs in user community, help others by searching solutions or sharing your computing resources, or upload your experiment data to improve the accuracy of our model.

## Dependences
### Algorithm
- gcc g++ gfortran
- subversion
- patch
- wget
- cmake
- ipopt - https://projects.coin-or.org/Ipopt
- openblas - http://www.openblas.net/

### Front end
 - Semantic UI - http://semantic-ui.com/
 - jQuery - https://jquery.com/
 - Chart.js - http://www.chartjs.org/
 - Sweetalert2 - https://limonte.github.io/sweetalert2/
 - AngularPlasmid - https://github.com/vixis/angularplasmid
 - Plax - http://cameronmcefee.com/blog/plax
 - Backstretch - http://srobbin.com/jquery-plugins/backstretch/
 - jQuery-MD5 - https://github.com/placemarker/jQuery-MD5
 - Semantic-UI-range - https://github.com/tyleryasaka/semantic-ui-range

### Back end
- flask - http://flask.pocoo.org/
- wkhtmltopdf - http://wkhtmltopdf.org

## Installation
### Normal
For general users, they can visit our website (http://craft.sysusoftware.info/square) and view the designs on the square, or register in our software and design their own synthetic biological system with CRAFT Designer.


### Advanced
#### Website Installation
**UNIX-Like**
todo
**Windows**
1. Download and install [Python 2.7](https://www.python.org/downloads/) and [wkhtmltopdf for windows](http://wkhtmltopdf.org/downloads.html).
2. Add the directory path of binary executable files (the default is `C:\Program Files\wkhtmltopdf\bin`) into system `Path` variable.
3. Download the latest release package and unzip it to anywhere you like.
4. Double click the setup.bat at the root of unziped floder.
5. Point your browser to `http://127.0.0.1:5000`.
#### Satellite Plugin Installation
These instructions are for UNIX-like systems only. Not supports for windows yet. 

 **HARDWARE REQUIRED:**
```
Hardisk:	20G
Memory:		3G
CPU:		Intel I5-2500k / AMD Phenom II 

** Highly recommended **
Memory:		4G memory or better
Storage:	20G SSD
```

**Get All the Code**

Open terminal at the working directory.

about Package manager: Usually, your Package manager is apt(for ubuntu/debian), yum(for fedora) or brew(for mac)
do not run the commands below with sudo if you're using mac OS
```
$sudo (Your Package manager) update
$sudo (Your Package manager) upgrade
$sudo (Your Package manager) install gcc g++ gfortran subversion patch wget cmake unzip
cd /where/to/install
$svn co https://projects.coin-or.org/svn/Ipopt/stable/3.12 CoinIpopt
$unzip OpenBLAS-0.2.19.zip
$cd ./CoinIpopt/ThirdParty/Mumps
$./get.Mumps
$cd ../Metis
$./get.Metis
```

 **INSTALL**

Open terminal at the working directory.
```
$cd ./OpenBLAS-0.2.19
$make
$make PREFIX=/where/to/install install
$cd ../CoinIpopt
$./configure --prefix=/where/to/install -with-blas="-L/where/to/install/lib -lopenblas"
$make
$make install
$cd ..
$rm -rf ./CoinIpopt ./OpenBLAS-0.2.19
```

 **MAKE**

Edit `Makefile`

Find

`/home/ngzm/2016_SYSU_iGEM/algorithm`

Replace with

`/where/to/install`

Open terminal at the working directory.
```
$make
```
## Documentation
Please visit our online help page：[CRAFT HELP](http://craft.sysusoftware.info/help)
## About
Developed by SYSU-Software team.
Base on GPL-3.0 licence.