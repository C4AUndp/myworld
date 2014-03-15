#!/bin/bash

## Refresh master2 database with partner registration data

#FETCH CURRENT PARTNERS LISTING
wget http://partner.myworld2015.org/partnersjson.php -O partners.json

#IMPORT CURRENT PARTNERS LISTING INTO MASTER2 DATABASE, PARTNERS2 COLLECTION
mongoimport --host ds049937.mongolab.com --port 49937 --username analytics --password plantyours1234 --collection partners2 --db myworld_master2 --file partners.json --drop

## Cleanup

rm partners.json


