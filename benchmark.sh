#!/bin/bash
echo -e "usage: $0 express | restify"

start()
{
  echo -e "starting server-api-$1.js"
  TESTER=1 node server-api-$1.js &
  sleep 3
  echo -e "starting benchmark"
  cd benchmark
  ./benchmark.sh $1
  cd ..
  pkill node
  echo -e "stoping server-api-$1.js"
}

start express
start restify

exit 0