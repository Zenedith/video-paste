#!/bin/bash
#http://tjholowaychuk.com/post/543349452/apachebench-gnuplot-graphing-benchmarks

inputFileName1=$1
inputFileName2=$2
outputFileName=$3
graphTitle=$4
lineTitle1=$5
lineTitle2=$6


draw_plot()
{
  echo "start drawing.."
 
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
  
  # plot data from "$inputFileName1 and $inputFileName2" using column 9 with smooth sbezier lines
  # and title of "$lineTitle" for the given data
  plot "$inputFileName1" using 9 smooth sbezier with lines title "$lineTitle1", \
       "$inputFileName2" using 9 smooth sbezier with lines title "$lineTitle2"
EOF
  echo "end drawing.."
}

draw_plot
exit 0
