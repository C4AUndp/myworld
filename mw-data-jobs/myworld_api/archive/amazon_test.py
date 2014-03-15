#!/usr/bin/python
import bottle
import bottle.ext.memcache
import copy
import csv
import dateutil.parser
import ipdb
import json
import memcache
import numpy
import pdb
import pymongo
import random
import re
import sys

from bottle import route, run, request, response, abort, hook, Bottle
from bson.son import SON
from bson.code import Code
from datetime import datetime, date, time, timedelta
from pymongo import MongoClient, Connection


###############################################################################
# Constants and Globals #######################################################
###############################################################################

mode = 'server'
run_modes = {'local' : {'host': 'localhost', 
                        'port': 3000,
                        'dir': '/Users/niko/Documents/Stahl/Repos/myworld-analytics/api/monitor_server/'
                        },
             
             'server' : {'host': 'localhost', 
                        'port': 3013,
                        'dir': '/home/ubuntu/myworld_api/'
                        }
            }

settings = run_modes[mode]

dir = settings['dir']

connection = Connection('mongodb://analytics:plantyours1234@ds049937.mongolab.com:49937/myworld_master2', 49937)
db = connection.myworld_master2
collection = db['votes']
config_file = json.load(open(dir + 'data/config.json'))

ageGroups = config_file['age_indices']
country_metadata = config_file['country_metadata']
hdi_to_country_map = config_file['hdi_country']
region_to_country_map = config_file['region_country']
continent_to_country_map = config_file['continent_country']
source_methods = config_file['source_method']
segment_keys = config_file['segment_keys']

dict_id_name = {}
mappings_to_reverse = [ ('continent', 'continent_indices'), 
                        ('region', 'region_indices'), 
                        ('hdi', 'hdi_indices') ]
for keys in mappings_to_reverse:    
  dict_id_name[keys[0]] = dict([ ( str(item[1]), item[0] ) 
                              for item in config_file[keys[1]].items() ])

dict_id_name['country'] = dict([ (key[0], key[1]['name'])  \
                            for key in country_metadata.items() ])
dict_id_name['education'] = config_file['education']
dict_id_name['gender'] = config_file['gender']
dict_id_name['priorities'] = dict([ (items[0], items[1]['item-title']) \
                              for items in config_file['priorities'].items() ])

str_client = settings['host'] + ':' + str(settings['port'])

###setup bottle
app = Bottle()
plugin = bottle.ext.memcache.MemcachePlugin(servers=['127.0.0.1:11211'])
app.install(plugin)

#cache length in seconds
CACHE_SHORT = 10*60
CACHE_LONG = 24*60*60
CACHE_INF = 0

# DECORATED FUNCTIONS ##########

@app.hook('before_request')
def check_cache():
  # mc.flush_all() -> clears the cache
  print request.url

@app.hook('after_request')
def enable_cors():
  response.headers['Access-Control-Allow-Origin'] = '*'
  
@app.route('/', method='GET')
def test():
  return {'hello': 1}
  
@app.route('/cache')
def cache(mc):
  cache_key = make_cache_key(request)
  obj = mc.get(cache_key)
  if not obj:
    obj = sum([ random.randint(0,1) for i in range(100000) ])
    mc.set(cache_key, obj, 10)
  
  return {'out': obj}
  
def make_cache_key(request):
  return request.urlparts[2] + '/' + request.urlparts[3]

# LAUNCH BOTTLE APP ##########
run(app, host=settings['host'], port=settings['port'])
