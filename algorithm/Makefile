CC=g++
CFLAG=-O3 -Wall -std=c++11

OPTK=`PKG_CONFIG_PATH=/home/ngzm/2016_SYSU_iGEM/algorithm/lib64/pkgconfig:/home/ngzm/2016_SYSU_iGEM/algorithm/lib/pkgconfig:/home/ngzm/2016_SYSU_iGEM/algorithm/share/pkgconfig: pkg-config --libs ipopt`

OPTL=-Wl,--rpath -Wl,/home/ngzm/2016_SYSU_iGEM/algorithm/lib

INCLUDES=-I./include -I./include/coin

all: get-common data-fake opt-test

data-fake: data-fake.cpp
	$(CC) $(CFLAG) $(INCLUDES) -o $@ $^

get-common: get-common.cpp
	$(CC) $(CFLAG) $(INCLUDES) -o $@ $^

opt-test: MyNLP.o opt-test.o
	g++ $(CFLAG) $(OPTL) -o opt-test opt-test.o MyNLP.o $(OPTK)

MyNLP.o: MyNLP.cpp
	g++ $(CFLAG) $(INCLUDES) -c -o $@ $^

opt-test.o: opt-test.cpp
	g++ $(CFLAG) $(INCLUDES) -c -o $@ $^

clean:
	-rm get-common
	-rm data-fake
	-rm opt-test
	-rm *.o
