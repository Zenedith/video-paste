#!/bin/bash

index=0

DIRS=`find data -type d -maxdepth 1`

for dir in $DIRS
do
  if [ "$dir" != "." ] && [ "$dir" != "data" ]; then
    methodName=`echo $dir | sed 's/data\///'`
  
    echo -e "Processing $methodName method"
    
    FILES=`find $dir -type f -maxdepth 1 -name "*.dat"`
    for file in $FILES
    do
      serverName=`echo $file | sed 's/data\/'$methodName'\///'`
      serverName=`echo $serverName | sed 's/.dat//'`
      echo -e "Processing $serverName server"
      paramsDat[index]=$file
      params[index]=$serverName
      index+=1  
    done
  fi

  echo -e "generate plot for ${paramsDat[0]} and ${paramsDat[1]} files"
  ./plot2.sh ${paramsDat[0]} ${paramsDat[1]} "images/$methodName/compare.png" "Compare $methodName besides ${params[0]} and ${params[1]}" ${params[0]} ${params[1]}
  
done

exit 0
