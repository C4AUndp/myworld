#!/bin/bash

## Export Data from myworld_apps (cvs_votes table) and import into master2

## Create flat file export

mongoexport --verbose --host ds057207.mongolab.com:57207 -d myworld_apps2 -c votes -u dynamix  -p 84ndzah  -o api.json

## Import data  file into production DB

mongoimport  --host ds049937.mongolab.com --port 49937 --username analytics --password plantyours1234 --collection votes --db myworld_master2 --file api.json

## Cleanup

rm api.json

echo "App import complete" >> home/ubuntu/staging_import/logs/app_import.log
