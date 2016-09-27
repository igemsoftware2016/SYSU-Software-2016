CC=g++
CFLAG=-O3 -Wall -std=c++11

OPTK=`PKG_CONFIG_PATH=/home/ngzm/2016_SYSU_iGEM/algorithm/lib64/pkgconfig:/home/ngzm/2016_SYSU_iGEM/algorithm/lib/pkgconfig:/home/ngzm/2016_SYSU_iGEM/algorithm/share/pkgconfig: pkg-config --libs ipopt`

OPTL=-Wl,--rpath -Wl,/home/ngzm/2016_SYSU_iGEM/algorithm/lib

INCLUDES=-I./include -I./include/coin

all: get-common data-fake opt-test OptCom-test

data-fake: data-fake.cpp
	$(CC) $(CFLAG) $(INCLUDES) -o $@ $^

get-common: get-common.cpp
	$(CC) $(CFLAG) $(INCLUDES) -o $@ $^

opt-test: MyNLP.o opt-test.o
	g++ $(CFLAG) $(OPTL) -o $@ $^ $(OPTK)

OptCom-test: OptCom.o OptCom-test.o
	g++ $(CFLAG) $(OPTL) -o $@ $^ $(OPTK)

%.o: %.cpp
	g++ $(CFLAG) $(INCLUDES) -c -o $@ $^

clean:
	-rm get-common
	-rm data-fake
	-rm opt-test
	-rm OptCom-test
	-rm *.o
