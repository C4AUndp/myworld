#!/bin/bash

## Export Data from myworld_manual2 (cvs_votes collection) and import into Production
## Logging handled during cron run by standard out

## Create flat file export

mongoexport --verbose --host ds057197.mongolab.com:57197 -d myworld_manual2 -c csv_votes -u analytics -p plantyours1234 -o offline.json

## Import data  file into production DB

mongoimport --host ds049937.mongolab.com --port 49937 --username analytics --password plantyours1234 --collection votes --db myworld_master2 --file offline.json

## Cleanup

rm offline.json

echo "CVS_votes import complete" >> home/ubuntu/staging_import/logs/offline_cvs_import.log
