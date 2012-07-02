#!/bin/bash

frontedType=$1
url="api.localhost:3001/api"
n=10
c=1

test()
{
  params="-n $n -c $c -g data/$frontedType_$testName.dat $url/$testUrl"
  echo -e "benchmark: ab $params"
  ab -n $n -c $c -g "data/$frontedType"_"$testName.dat" "$url/$testUrl"
  
  plotParams="\"data/"$frontedType"_"$testName".dat\" \"images/"$frontedType"_"$testName".png\" \""$frontedType"\" \""$testName" benchmark "$frontedType\"
  echo -e "plot: ./plot.sh $plotParams"
  ./plot.sh "data/"$frontedType"_"$testName".dat" "images/"$frontedType"_"$testName".png" $frontedType "$testName benchmark $frontedType"
}


#######
#benchmark for getSession
testName="getSession"
testUrl="getSession/3c32dae5f2bf63c5"
test
#######


exit 0