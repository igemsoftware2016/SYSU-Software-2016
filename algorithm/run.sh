#!/bin/bash

make 
./data-fake
./get-common > res.txt

cat res.txt | grep sec
cat res.txt | grep debug

