CC=g++
CFLAG=-O3 -Wall -std=c++11
INCLUDES=-I./include

all: get-common data-fake

data-fake: data-fake.cpp
	$(CC) $(CFLAG) $(INCLUDES) -o $@ $^

get-common: get-common.cpp
	$(CC) $(CFLAG) $(INCLUDES) -o $@ $^

clean:
	-rm get-common
	-rm data-fake
