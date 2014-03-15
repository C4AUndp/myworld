# back up production statsdb script and deploy dev
cp /home/ubuntu/statsdb/statsdb.py /home/ubuntu/statsdb/statsdb.backup
cp /home/ubuntu/statsdb/statsdb_dev.py /home/ubuntu/statsdb/statsdb.py

# back up production api script and deploy dev
cp /home/ubuntu/myworld_api/myworld_wsgi_2.py /home/ubuntu/myworld_api/myworld_wsgi_2.backup
cp /home/ubuntu/myworld_api/myworld_wsgi_dev.py /home/ubuntu/myworld_api/myworld_wsgi_2.py
