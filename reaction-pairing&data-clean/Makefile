CC=g++
CFLAG=-O3 -Wall -std=c++11

all: reaction_pairing flush CDS trans

reaction_pairing: reaction_pairing.o input_utils.o
	$(CC) $(CFLAG) -o $@ $^

flush: flush.o input_utils.o
	$(CC) $(CFLAG) -o $@ $^

CDS: CDS.o input_utils.o
	$(CC) $(CFLAG) -o $@ $^

trans: trans.o input_utils.o
	$(CC) $(CFLAG) -o $@ $^

%.o:%.cpp
	$(CC) $(CFLAG) -c -o $@ $^

clean:
	-rm *.o
	-rm reaction_pairing flush CDS trans
