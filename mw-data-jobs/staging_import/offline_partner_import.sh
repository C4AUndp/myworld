#!/bin/bash

## Export Data from myworld_manual2 (votes collection) and import into Production
## Logging handled during cron run by standard out

## Create flat file export

mongoexport --verbose --host ds057197.mongolab.com:57197 -d myworld_manual2 -c votes -u analytics -p plantyours1234 -o votes_offline.json

## Import data  file into production DB

mongoimport --host ds049937.mongolab.com --port 49937 --username analytics --password plantyours1234 --collection votes --db myworld_master2 --file votes_offline.json

## Cleanup

rm votes_offline.json

echo "Partner import complete" >> home/ubuntu/staging_import/logs/offline_partner_import.log
