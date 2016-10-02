CC=g++
CFLAG=-O3 -Wall -std=c++11

all: reaction_pairing flush

reaction_pairing: reaction_pairing.o input_utils.o
	$(CC) $(CFLAG) -o $@ $^

flush: flush.o input_utils.o
	$(CC) $(CFLAG) -o $@ $^

%.o:%.cpp
	$(CC) $(CFLAG) -c -o $@ $^

clean:
	rm *.o
	rm reaction_pairing
	rm flush

