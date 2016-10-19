Ladies and gentlemen, welcome to **CRAFT**!

For normal usage, which means you just want to experience how you can create a design in several minutes and hanging in our "CRAFT Square", click here(http://craft.sysusoftware.info) and enjoy yourselves.

If you want to deploy CRAFT on your machine, please follow these  guides below.😆

NOTE: For all platforms, the server will listen on port 5000 when it is running.

## CRAFT Website Deployment

### Windows
To deploy the server on your Windows machine, just make sure [Python 2.7](https://www.python.org/downloads/) and [wkhtmltopdf](http://wkhtmltopdf.org/downloads.html) are installed, and then download CRAFT-win-x86_64.zip, unzip it and double click setup.bat.

If it prompts a error that "Can't find Python27.dll in system", type this following commands in cmd(make sure that python is available in cmd):

```
cd <your local path>\CRAFT-win_x86_64\app
python -m pip install -r requirements.txt
python run.py
```

### Linux
We provided 64 bit version, and test on two different linux system.

#### CentOS 7 - x86_64

To deploy the server, do the following steps:
0. Install some package dependencies.(unzip wkhtmltopdf urw-fonts libXext openssl-devel)
1. Download CRAFT-linux-x86_64.zip.
2. Unzip it to anywhere you like to hold the server files.
3. Get into the CRAFT-linux-x86_64 folder.
4. Execute `setup.sh` to build environment.
5. Run `run_server.sh`.

You can execute this following commands in bash to finish the job:
```bash
sudo yum install unzip wkhtmltopdf urw-fonts libXext openssl-devel
wget https://github.com/igemsoftware2016/SYSU-Software-2016/releases/download/1.0.0/CRAFT-linux-x86_64.zip
unzip CRAFT-linux-x86_64.zip
cd CRAFT-linux-x86_64
sudo bash setup.sh
bash run_server.sh
```


#### Ubuntu - x86_64

To deploy the server on ubuntu, there are also a few steps:
0. Install some package dependencies.(unzip wkhtmltopdf)
1. Download CRAFT-linux-x86_64.zip.
2. Unzip it to anywhere you like to hold the server files.
3. Get into the CRAFT-linux-x86_64 folder.
4. Execute `setup.sh` to build environment.
5. Run `run_server.sh`.

You can execute this following commands in bash to finish the job:
```bash
sudo apt-get install unzip wkhtmltopdf
wget https://github.com/igemsoftware2016/SYSU-Software-2016/releases/download/1.0.0/CRAFT-linux-x86_64.zip
unzip CRAFT-linux-x86_64.zip
cd CRAFT-linux-x86_64
sudo bash setup.sh
bash run_server.sh
```


### Mac
For Mac users, execute these commands and follow the hints to finish the installation.

```bash
wget https://github.com/igemsoftware2016/SYSU-Software-2016/releases/download/1.0.0/CRAFT-mac-x86_64.zip
unzip CRAFT-mac-x86_64.zip
cd CRAFT-mac-x86_64
sudo bash setup.sh
bash run_server.sh
```

Now please open your browser window and visit http://127.0.0.1:5000. And you will see the index page of CRAFT.

You can log in with username: `test@test.com` and password: `test` or click `Guest Mode` to travel the whole CRAFT world!😆


## Satellite Plugin Installation (optional)
**Satellite** is a distributed plugin for CRAFT. It will pull calculation tasks from CRAFT -- our [online website](http://craft.sysusoftware.info).
It won't interact with local server.
These instructions are for Linux systems only. Windows and MacOS are not supported yet.

 **HARDWARE REQUIRED:**
```
Hardisk:	20G
Memory:		4G
CPU:		Intel I5-2500k / AMD Phenom II 

** Highly recommended **
Memory:		6G memory or better
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

***
We will continue working hard on it to improve the user experience.
Thank you!