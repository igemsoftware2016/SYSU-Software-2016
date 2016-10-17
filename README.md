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
- flask sqlalchemy - http://flask-sqlalchemy.pocoo.org/2.1/
- xlrd
- pytz
- pdfkit
- uwsgi
- nginx

## Installation
### Normal
For general users, they can visit our website (http://craft.sysusoftware.info/square) and view the designs on the square, or register in our software and design their own synthetic biological system with CRAFT Designer.


### Advanced
#### Website Installation
**UNIX-Like**

Web server software(such as Nginx or Apache) and UWSGI are required.

First of all, fetch package for the target machine and extract all the files.
```
wget ......
tar -xvsf xxxxxx.tar.gz
```

Run the command below to install all packages that our web application depended. Root permission is required.
```
cd xxxxxx
pip install -r requirement.txt
```

However, package "wkhtmltopdf" have extra steps to finish the installation. Follow the commands below to complete it (Take CentOS for example, root permission is required):
```
yum install wkhtmltopdf
yum install xorg-x11-server-Xvfb
echo -e '#!/bin/bash\nxvfb-run -a --server-args="-screen 0, 1024x768x24" /usr/bin/wkhtmltopdf -q $*' > /usr/bin/wkhtmltopdf.sh
chmod a+x /usr/bin/wkhtmltopdf.sh
ln -s /usr/bin/wkhtmltopdf.sh /usr/local/bin/wkhtmltopdf
```
For Debian/Ubuntu, replace 'yum' by 'apt-get'.

Configure of web server software and UWSGI
Add a .ini file for UWSGI at the directory you extract all the program's files with configuration below:
```
[uwsgi]
    socket = 127.0.0.1:[Your port]
    processes = 2
    threads = 2
    master = true
    plugins = python
    pythonpath = [The directory you extract all files]
    module = run
    callable = app
    memory-report = true
    logto = /var/log/uwsgi/CRAFT.log
```
Add a new configuration file for web server software. For example, add a .conf file at Nginx's configuration directory (`/etc/nginx/conf.d/`) with a new virtual server:
```
server {
        listen 80;
        server_name     [Your IP address or domain];
        location / {
                include uwsgi_params;
                uwsgi_pass      127.0.0.1:[Your UWSGI's port];
        }
}
```
#Start the service

Run the command to start CRAFT web service:
```
uwsgi -d /var/log/uwsgi/CRAFT.log --ini ./uwsgi_config.ini
```
Visit your [Your IP address or domain]
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