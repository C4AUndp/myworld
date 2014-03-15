#!/bin/bash

SCRIPT="/home/ubuntu/export/export.py"
WORKIN="/home/ubuntu/export" # work in this dir
DEST="/var/www/dataset/data" # move file to this dir
FILENAME="MYWorld_votes_all.csv" # file name (without bz2)
DESTFILE="$DEST/$FILENAME.tar.bz2"

# export file to new csv
cd $WORKIN # move to working dir
python $SCRIPT $FILENAME # run the output script
rm $DESTFILE # remove old file
tar -cjf $DEST/$FILENAME.tar.bz2 $FILENAME # compress new file
rm $FILENAME # remove uncompressed version
