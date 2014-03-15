
cd /home/ubuntu/d3render

sudo ./node_modules/forever/bin/forever stop myworld.js
sudo killall -9 phantomjs
sudo ./node_modules/forever/bin/forever start myworld.js
