#!/bin/bash

## Export Data from myworld_production2 (cvs_votes table) and import into myworld_master2
## Logging handled during cron run by standard out

## Create flat file export

mongoexport --verbose --host ds033588.mongolab.com --port 33588 -d myworld_production -c votes -u dynamix -p 84ndzah -o myworld.json

## Import data  file into production DB

mongoimport --host ds049937.mongolab.com --port 49937 --username analytics --password plantyours1234 --collection votes --db myworld_master2 --file myworld.json

## Cleanup

rm myworld.json

echo "Website votes import complete" >> /home/ubuntu/staging_import/logs/websites_import.log
