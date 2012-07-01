#!/bin/bash

url="http://api.localhost:3001/api"
n=1000
c=100

#getSession

test()
{
  ab -n $n -c $c -g $testName".dat" $url"/"$testUrl
  ./plot.sh $testName".dat" $testName".png" $testName" benchmark" "expresso"
}


#######
#benchmark for getSession
testName="getSession"
testUrl="getSession/3c32dae5f2bf63c5"
test
#######


exit 0