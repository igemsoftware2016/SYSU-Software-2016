#!/bin/bash

make 
./data-fake > data-fake.txt
./get-common > res.txt

cat res.txt | grep sec
cat res.txt | grep debug

