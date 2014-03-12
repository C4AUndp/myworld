#!/bin/sh

PUBLIC_HOSTNAME=getinvolved.myworld2015.org
echo $PUBLIC_HOSTNAME

SED_REPLACE="s|http://dev.coders4africa.org/un/partnersportal|http://$PUBLIC_HOSTNAME|g"
echo $SED_REPLACE
sed "$SED_REPLACE" hakilien_wor1.sql  > hakilien_wor1_hostupdated.sql
mysqldump -u root -pbitnami hakilien_wor1 > hakilien_wor1_rollback.sql
mysql -u root -pbitnami hakilien_wor1 < hakilien_wor1_hostupdated.sql

