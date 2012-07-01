#!/bin/bash
#http://tjholowaychuk.com/post/543349452/apachebench-gnuplot-graphing-benchmarks

inputFileName=$1
outputFileName=$2
graphTitle=$3
lineTitle=$4


draw_plot()
{
  echo "draw_plot"
 
gnuplot << EOF
  # output as png image
  set terminal png
  
  # save file to $outputFileName
  set output "$outputFileName"
  
  # graph title
  set title "$graphTitle"
  
  # nicer aspect ratio for image size
  set size 1,0.7
  
  # y-axis grid
  set grid y
  
  # x-axis label
  set xlabel "request"
  
  # y-axis label
  set ylabel "response time (ms)"
  
  # plot data from "$inputFileName" using column 9 with smooth sbezier lines
  # and title of "$lineTitle" for the given data
  plot "$inputFileName" using 9 smooth sbezier with lines title "$lineTitle"
EOF
}

draw_plot