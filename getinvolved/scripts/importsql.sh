#!/bin/sh

PUBLIC_HOSTNAME=$(curl http://169.254.169.254/latest/meta-data/public-hostname 2>/dev/null)
echo $PUBLIC_HOSTNAME

SED_REPLACE="s|http://dev.coders4africa.org/un/partnersportal|http://$PUBLIC_HOSTNAME|g"
echo $SED_REPLACE
sed "$SED_REPLACE" hakilien_wor1.sql  > hakilien_wor1_hostupdated.sql
mysqldump -u root -pbitnami hakilien_wor1 > hakilien_wor1_rollback.sql
mysql -u root -pbitnami hakilien_wor1 < hakilien_wor1_hostupdated.sql

