#!/bin/bash

frontedType=$1
url="http://api.localhost:3001/api"
n=100
c=10

test()
{
  testName=$1
  testUrl=$2
  
  mkdir -p data/$testName
  mkdir -p images/$testName
  
  params="-n $n -c $c -g data/$testName/$frontedType.dat $url/$testUrl"
  echo -e "benchmark: ab $params"
  ab -n $n -c $c -g "data/$testName"/"$frontedType.dat" "$url/$testUrl"
  
  plotParams="\"data/"$testName"/"$frontedType".dat\" \"images/"$testName"_"$frontedType".png\" \""$frontedType"\" \""$testName" benchmark "$frontedType\"
  echo -e "plot: ./plot.sh $plotParams"
  ./plot.sh "data/"$testName"/"$frontedType".dat" "images/"$testName"/"$frontedType".png" $frontedType "$testName benchmark $frontedType"
}


#######
#benchmark for getSession
test getSession getSession/3c32dae5f2bf63c5
#######
#benchmark for getTopLinks
test getTopLinksLimit10 getTopLinks/07e83177c225d734924d153e27ce7889d334d9b2/0/10
test getTopLinksLimit100 getTopLinks/07e83177c225d734924d153e27ce7889d334d9b2/0/100
#######


exit 0