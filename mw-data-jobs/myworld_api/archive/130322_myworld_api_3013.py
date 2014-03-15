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
import time as ptime

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
                        },
             'rackspace_server' : {'host': '50.57.78.160', 
                        'port': 3013,
                        'dir': '/home/nstahl/myworld_api/monitor_server/'
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
@app.route('/abbr', method='GET')
@app.route('/country', method='GET')
@app.route('/partner', method='GET')
@app.route('/sourceMethod', method='GET')
def depr_totals():
  """calculate totals and distributions
  Example: http://localhost:3001/country?id=1
  """
  query_keys = request.query.keys()
  
  dict_filter = {}
  
  if request.path == '/country':
    dict_filter = {'country' : {}}
    dict_filter['country']['$exists'] = True
    
    if "id" in query_keys:
      if int(request.query.id)>0 and int(request.query.id)<194:
        dict_filter['country']['$in'] = [int(request.query.id)]
      else:
        return 'Not a valid id'
        
  elif request.path == '/partner':
    partner_list = get_partner_ids()
    
    dict_filter = {'partner' : {}}
    
    #make regex
    regex = re.compile('\\b' + request.query.id + '$', re.IGNORECASE)
    dict_filter['partner']['$in'] = [regex]

        
  elif request.path == '/sourceMethod':
    dict_filter = {'sourceMethod' : {}}
    
    if "id" in query_keys:
      if int(request.query.id) in [1,2]:
        dict_filter['sourceMethod']['$in'] = [source_methods[str(request.query.id)]]
      else:
        return 'Not a valid id'
        
  return get_totals( dict_filter , request)

@app.route('/cache')
def cache(mc):
  cache_key = make_cache_key(request)
  obj = mc.get(cache_key)
  if not obj:
    obj = sum([ random.randint(0,1) for i in range(100000) ])
    mc.set(cache_key, obj, 10)
  
  return {'out': obj}
  
@app.route('/count_suggested')
def count_suggested():
  dict_find = build_query(request)
  #suggested priority has index 0
  dict_find.update( {'choices': 0} )
  cursor = collection.find(dict_find)
  return {'count': cursor.count()}

@app.route('/public/segment')
@app.route('/csv/segment')
@app.route('/segment')
def calc_segment(mc):
  "handle segment api call"
  cache_key = make_cache_key(request)
  
  #PUBLIC REQUEST
  if request.path == '/public/segment':
    obj = mc.get(cache_key)
    if not obj:
      obj = aggregate_ranking(build_query(request))
      obj['computed_at'] = int(ptime.time())
      mc.set(cache_key, obj, CACHE_LONG)
      print 'Caching key: ' + cache_key
    return obj
  
  #PRIVATE REQUEST
  dict_find = build_query(request)
  toreturn = aggregate_ranking(dict_find)
  
  if request.path == '/segment':
    return toreturn
  
  ###format output for csv
  dict_norm = normalize_segment_view( dict_find, toreturn, request )
  str_csv = generate_csv( dict_norm )
  
  response['content_type'] = 'text/csv'
  response['Content-Disposition'] = 'attachment; filename="segment_view.csv"'
  response.body = str_csv
  
  return response
    
@app.route('/overview', method='GET')
def get_overview():
  dict_find = build_query(request)
  to_return = {}
  
  #get priority rankings
  to_return.update(aggregate_ranking(dict_find))
  
  #get distribution and country tables
  to_return.update(get_totals(dict_find, request))
  
  return to_return

@app.route('/partner_rankings', method='GET')
def get_partner_rankings():
  partners = get_partners()['partners']
                         
  #aggregate
  result_obj = collection.aggregate([{"$group": {"_id": "$partner", "count": {"$sum": 1}}}])
  
  for partner in partners:
    regex = re.compile('\\b' + partner['volunteer_id'] + '$', re.IGNORECASE)
    matching_objs = [ obj for obj in result_obj['result'] if obj['_id'] and regex.search(obj['_id']) ]
    partner['tVoters'] = sum( [ obj['count'] for obj in matching_objs ] )
  
  results = sorted(partners, key=lambda x: x['tVoters'], reverse = True)
  
  return {'partner_rankings': results}

@app.route('/ping')
def ping():
  return 'Up and running'

@app.route('/priority_profile/<choice:int>')
def priority_profile(choice):
  to_return = get_totals({'choices': choice}, request)
  return to_return

@app.route('/priority_similarity')
def priority_similarity(mc):
  cache_key = make_cache_key(request)
  obj = mc.get(cache_key)
  if obj:
    return obj
  
  dict_find = build_query(request)
  cursor = collection.find(dict_find, {'choices': 1, '_id': 0})
  sample_size = cursor.count()
  print '\n' + str(sample_size) + '\n'
  m_simil = get_priority_similarity(cursor)
  dict_return = get_similarity_graph(m_simil)
  dict_return['sample_size'] = sample_size
  
  mc.set(cache_key, dict_return, CACHE_LONG)
  return dict_return

@app.route('/public/map', method='GET')
def public_country_table(mc):
  cache_key = make_cache_key(request)
  obj = mc.get(cache_key)
  if obj:
    return obj
  
  to_return = get_country_stats({}, False)
  to_return['tVotes'] = collection.find().count()
  to_return['computed_at'] = int(ptime.time())
  mc.set(cache_key, to_return, CACHE_SHORT)
  return to_return

@app.route('/public/sampleSimilar', method='GET')
#http://localhost:3000/public/sampleSimilar?choices=1,2,3,4,5,12
def sample_similar(mc):
  cache_key = make_cache_key(request)
  obj = mc.get(cache_key)
  if obj:
    return obj
  
  
  o_sample = build_query(request)
  o_choice_set = set(o_sample['choices']['$in']).difference(set([0]))
  
  region_samples = {}
  
  for (region, countries) in region_to_country_map.items():
    dict_fields = { '_id': 0,
                    'age': 1,
                    'choices': 1,
                    'country': 1,
                    'education': 1,
                    'gender': 1,
                    'timestamp' : 1
                    }
    
    docs = collection.find({'country': {'$in': countries}}, dict_fields) \
                      .limit(75).sort('timestamp', pymongo.DESCENDING)
    
    results = []
    #measure similarities for sample
    for doc in docs:
      doc['overlap'] = overlap(o_choice_set, 
                            set(doc['choices']).difference(set([0])) )
      
      if doc['overlap']> 3:
        doc['timestamp'] = doc['timestamp'].date().isoformat()
        results += [ doc ]
        break
    
    region_samples[region] = sorted(results, key=lambda x: x['overlap'], reverse = True)
    
  samples = [ docs[0] for (region_id, docs) in region_samples.items() if docs ]
  to_return = {'samples': samples}
  to_return['computed_at'] = int(ptime.time())
  mc.set(cache_key, to_return, CACHE_LONG)
  return to_return
  
@app.route('/tseries/<d0:re:\d+\-\d+-\d+>/<d1:re:\d+\-\d+-\d+>')
def tseries_int_request(mc, d0, d1):
  """handle time series request
  Example url: http://localhost:3000/tseries_int/2011-02-30/2013-02-14
  """
  dict_filter = build_query(request)
  #parse date
  date0 = dateutil.parser.parse(d0)
  date1 = dateutil.parser.parse(d1)
  n_days = abs(date0-date1).days
  end_date = max( date0, date1 )
  #make time series
  dates = [end_date - timedelta(days=i) for i in range(n_days+1) ]
  
  if dict_filter:
    #compute
    return {'dates': get_tseries(mc, dates, dict_filter)}
  else:
    date_strs = [ obj.date().isoformat() for obj in dates ]
    stored_results = db['myworld_tseries'].find({'date': {'$in': date_strs }}, \
                                         {'_id': 0})
    
    to_return = [ result for result in stored_results ]
    found_date_strs = [ result['date'] for result in to_return ]
    
    dates_not_found = []
    for obj in dates:
      if not obj.date().isoformat() in found_date_strs:
        dates_not_found += [ obj ]
    
    to_return += get_tseries(mc, dates_not_found, {})
    to_return = sorted( to_return, key=lambda x: x['date'], reverse = True )
    
    return {'dates': to_return}

@app.route('/www')
def www_counts():
  toreturn = {}
  countries = collection.distinct('country')
  print sorted(countries)
  toreturn['people'] = collection.find().count()
  toreturn['countries'] = len(countries)
  return toreturn

# UTILITY FUNCTIONS ##########

def aggregate_ranking(dict_find = {}):
  "rank priorities for the query defined in dict_find"
  result_obj = collection.aggregate([
       {"$match" : dict_find },
       {"$unwind": "$choices"},
       {"$group": {"_id": "$choices", "count": {"$sum": 1}}},
       {"$sort": SON([("count", -1)])}
   ])
   
  #initialize
  rankings = [{'id': str(i), 'count': 0} for i in range(0,17)]
   
  for result in result_obj['result']:
    rankings[int(result['_id'])]['count'] = int(result['count'])
  
  #slice off suggested priority
  rankings = rankings[1:]
  
  to_return = {}
  to_return['tVotes'] = collection.find(dict_find).count()
  to_return['rankings'] = sorted(rankings, key=lambda x: x['count'], reverse = True)
  return to_return
  
def bin_ages(dict_ages, dict_binnings):
  """function to bin ages
      e.g.: dict_ages = { '5': 2, '27': 1 } and 
      dict_binnings = {'group1': {'high': 34, 'low': 0}, 
                       'group2': {'high': 54, 'low': 35} }
  """
  groups = dict_binnings.keys()
  #ensure the right types
  dict_agecount = [ 
                          ( int(key), int(val) ) 
                          for (key, val) in dict_ages.items()
                          if key 
                  ]
  
  dict_bin = {}
  for group in groups:
    dict_bin[group] = sum( [ 
                            count 
                            for (age, count) in dict_agecount 
                            if (age<=dict_binnings[group]['high'] and
                                age>=dict_binnings[group]['low'] )
                            ] )
                            
  return dict_bin

def bin_hdi(countries, hdi_to_country_map):
  #hdi binning
  hdis = [{'_id': '1', 'count': 0},{'_id':'2', 'count': 0}, 
  {'_id': '3', 'count': 0}, {'_id': '4', 'count': 0}]
  
  for obj_hdi in hdis:
    obj_hdi['count'] = sum( [ int(obj['tVotes'])
                            for obj in countries
                            if int(obj['country']) in 
                                hdi_to_country_map[obj_hdi['_id']]
                             ] )
  
  to_return = {}
  for hdi in hdis:
    to_return['tHdi'+ hdi['_id']] = hdi['count']
  
  return to_return

def binary_similarity( va, vb ):
  """Calculates 1-Hamming Distance(va, vb), where va, vb are vectors"""
  v_sum = va+vb
  n_both_on = sum( v_sum == 2 )
  n_one_on = sum( v_sum > 0 )
  if n_one_on < 1:
    return 0
  return float(n_both_on) / n_one_on

def build_query(request):
  "parse user's segment query"
  
  client_keys = request.query.keys()
  query_keys = []
  
  
  
  #get query keys that have non trivial values
  for key in client_keys:
    if request.query[key] != '0':
      query_keys += [key]
  
  dict_query_template = {}
  #update dict_query_template with valid client requests
  
  for client_key in query_keys:
    if not client_key in segment_keys:
      return 'You specified an undefined key. Request aborted!'
    elif client_key == 'partner':
      dict_query_template[client_key] = request.query['partner'].split(',')
    else:
      client_vals = [ int(val) for val in request.query[client_key].split(',') ]
      dict_query_template[client_key] = []
      for val in client_vals:
        if (val > segment_keys[client_key]['options']) or (val < 0):
          return 'Keys out of range!'
        else:
          dict_query_template[client_key] += [ val ]
  
  #use dict_query_template to form dict_find
  dict_find = {}
  
  interval_set = False
  
  for client_key in query_keys:
    
    if client_key == 'partner':
      
      dict_find.update({'partner' : {'$in': [ re.compile('\\b' + pid + '$', re.IGNORECASE) 
                                              for pid in dict_query_template['partner'] ]} })
    
    elif client_key == 'hdi':
      countries = [ ]
      for id in dict_query_template['hdi']:
        countries += hdi_to_country_map[str(id)]
      dict_find.update({'country' : {"$in" : countries} })
    
    elif client_key == 'region':
      countries = [ ]
      for id in dict_query_template['region']:
        countries += region_to_country_map[str(id)]
      dict_find.update({"country" : {"$in" : countries} })
    
    elif client_key == 'continent':
      countries = [ ]
      for id in dict_query_template['continent']:
        countries += continent_to_country_map[str(id)]
      dict_find.update({"country" : {"$in" : countries} })
    
    elif client_key == 'sourceMethod':
      dict_find.update({segment_keys['sourceMethod']['field_name']: 
                          {'$in': [ source_methods[str(id)] for id in dict_query_template['sourceMethod'] ] } })
      
    elif (client_key == "age_ub" or client_key == "age_lb"):
      if not interval_set:
        if 'age_lb' in query_keys:
          lb = dict_query_template['age_lb'][0]
        else:
          lb = segment_keys['age_lb']['default']
        
        if 'age_ub' in query_keys:
          ub = dict_query_template['age_ub'][0]
        else:
          ub = segment_keys['age_ub']['default']  
        
        dict_find.update({"age" : {
        "$gte": lb,
        "$lte": ub
        }
        })
        interval_set = True
    
    #all other cases
    else:
      dict_find.update({segment_keys[client_key]['field_name']: 
                          {'$in': [ id for id in dict_query_template[client_key] ] }
                          })
                          
  return dict_find

def generate_csv( dict_table, columns = [] ):
  if not columns:
    columns = sorted(dict_table.keys())
  
  for column in columns:
    if type(dict_table[column][0]) != int:
      #convert
      dict_table[column] = [ '"' + entry + '"' \
                          for entry in dict_table[column] ]
                        
  str_csv = ''
  str_rows = []
  nrows = len(dict_table[columns[0]])
  
  #add header row
  str_rows += [ ','.join(columns) ]
  
  for i in range(nrows):
    row = [ dict_table[column][i] for column in columns ]
    str_row = ','.join([str(entry) for entry in row])
    str_rows += [ str_row ]
  
  return '\n'.join(str_rows)

def get_country_rankings(dict_filter = {}):
  
  dict_condition = {"country" : {"$exists" : True}}
  dict_condition.update(dict_filter)
  
  result_obj = collection.aggregate([
    {"$match" : dict_condition },
    {"$group": {"_id": "$country", "count": {"$sum": 1}}}])
  
  results = []
  
  #assign hdi index of each country
  for obj in result_obj['result']:
    result = {}
    result['country'] = obj['_id']
    result['tVotes'] = obj['count']
    country_id = str(result['country'])
    if country_id in country_metadata:
      result['hdi_index'] = country_metadata[country_id]['hdi_index']
    results += [ result ]
  
  #hdi binning
  to_return = {'countries': sorted(results, key=lambda x: x['tVotes'], reverse = True) }
  to_return.update(bin_hdi(results, hdi_to_country_map))
  
  return to_return

def get_country_stats(dict_filter = {}, calcHDI = True):
  reducer = Code("""
                  function(obj, prev){
                    prev.tVotes++;
                    var dims = ["gender", "education", "age"];
                    dims.forEach( function(dim) {
                      if(obj[dim] !== undefined) {
                         if (obj[dim] in prev.demo[dim]) { 
                           prev.demo[dim][obj[dim]]++; 
                        } else { 
                           prev.demo[dim][obj[dim]] = 1; 
                        }
                      }
                    });
                  }
                  """)
  
  dict_condition = {"country" : {"$exists" : True}}
  dict_condition.update(dict_filter)
  #use database aggregation
  results = collection.group(key={"country":1},
                            condition=dict_condition, 
                            initial={"tVotes": 0, "demo": {"gender": {"1": 0, "2": 0},
                                                            "education": {"1": 0, "2": 0, "3": 0, "4": 0},
                                                            "age": {}
                                                            }}, 
                            reduce=reducer)
  
  #age binning
  for result in results:
    result['demo']['ageGroup'] = bin_ages(result['demo']['age'], ageGroups)
    del result['demo']['age']
  
  results = sorted(results, key=lambda x: x['tVotes'], reverse = True)
  
  to_return = {'countries': results }
  
  if calcHDI:
    #assign hdi index of each country
    for result in results:
      country_id = str(int(result['country']))
      if country_id in country_metadata:
        result['hdi_index'] = country_metadata[country_id]['hdi_index']
    
    #hdi binning
    to_return.update(bin_hdi(results, hdi_to_country_map))
  
  return to_return

def get_priority_similarity(cursor):
  """Makes data structure to calculate weighted adjacency matrix"""
  nrec = 17
  nballots = cursor.count()
  m_binary = numpy.zeros( (nrec, nballots) , dtype = numpy.int16)
  
  ballot_count = 0
  for doc in cursor:
    for choice in doc['choices']:
      m_binary[choice][ballot_count] = 1
    ballot_count += 1
    
  return get_similarity_matrix( m_binary )

def get_similarity_matrix( _m ):
  """Calculates adjacency matrix"""
  nrec = _m.shape[0]
  m_similar = numpy.zeros( (nrec, nrec) , dtype = float)
  
  for i in range(nrec):
    for j in range(i, nrec):
      m_similar[i][j] = binary_similarity( _m[i], _m[j] )
  
  return m_similar
  
def get_similarity_graph( _m ):
  nrec = _m.shape[0]
  
  dict = {}
  dict['nodes'] = [ {'name': str(i), 'group': 1}
                            for i in range(nrec) ]
  dict['links'] = []
  
  for i in range(nrec):
    for j in range(i+1, nrec):
        link_obj = {}
        link_obj['source'] = i
        link_obj['target'] = j
        link_obj['value'] = _m[i][j]
        dict['links'] += [ link_obj ]
  
  return dict

def get_totals(dict_filter = {}, request = None):
  "calculate totals and distributions"
  totals = {}
  totals['tVotes'] = collection.find(dict_filter).count()
  dict_results = {}
  
  #aggregate for all dimensions
  for var_name in ['gender','education','age']:
    dict_filter_custom = copy.copy(dict_filter)
    if not var_name in dict_filter_custom:
      dict_filter_custom[ var_name ] = {'$ne': '' }
    dict_results[var_name] = collection.aggregate([
     {"$match" : dict_filter_custom },
     {"$group": {"_id": "$" + var_name, "count": {"$sum": 1}}}
     ])
  
  #gender
  for i in range(1,3):
    result = [ obj for obj in dict_results['gender']['result'] if obj['_id'] == i ]
    if result:
      totals['tGender'+ str(i)] = result[0]['count']
    else:
      totals['tGender'+ str(i)] = 0
      
  #education
  for i in range(1,5):
    result = [ obj for obj in dict_results['education']['result'] if obj['_id'] == i ]
    if result:
      totals['tEdu'+ str(i)] = result[0]['count']
    else:
      totals['tEdu'+ str(i)] = 0
      
  #ageGroups
  dict_ages = dict([ (obj['_id'], obj['count']) for obj in dict_results['age']['result'] if obj['_id'] ] )
  dict_age_groups = bin_ages(dict_ages, ageGroups)
  for i in range(1,4):
    totals['tAge' + str(i)] = dict_age_groups['group' + str(i)]
  
  if request and (request.path == '/abbr' or 
                  re.search(r'priority_profile', request.path) ):
    totals.update(get_country_rankings(dict_filter))
  else:
    totals.update(get_country_stats(dict_filter))
    
  return totals
  
def get_tseries(mc, dates, dict_filter = {}):
  "Function to get stream chart data"
  date_stats = []
  one_day = timedelta(days=1)
  var_names = ['gender', 'education', 'country']
  
  for bin_date in dates:
    #check if date is chached
    
    dict_query = {'timestamp': {'$gte': bin_date,
                                '$lt': bin_date+one_day }}
    dict_query.update(dict_filter)
    
    cache_key = bin_date.date().isoformat() + '_'
    cache_key += json.dumps(dict_filter, sort_keys = True)
    #white spaces are control characters in memcached
    cache_key = re.sub('\s', '', cache_key)
    print '\n' + cache_key + '\n'
    cache_obj = mc.get(cache_key)
    if cache_obj:
      date_stats += [cache_obj]
      print 'Found in cache'
      continue
    
    date_stat = {}
    date_stat['date'] = bin_date.date().isoformat()
    date_stat['tVotes'] = collection.find(dict_query).count()
    
    for var_name in var_names:
      result_obj = collection.aggregate([
         {"$match" : dict_query },
         {"$group": {"_id": "$" + var_name, "count": {"$sum": 1}}}])
      #add NAs
      non_nas = sum( [ obj['count'] for obj in result_obj['result'] if obj['_id'] ] )
      result_obj['result'].append( {'_id': 'NA', 'count': date_stat['tVotes']-non_nas })
      #filter out _id == none
      date_stat[var_name] = [ result for result in result_obj['result'] if result['_id'] ]
    
    #HDI GROUPINGS
    hdi_counts = {1: 0, 2: 0, 3: 0, 4: 0, 'NA': 0}
    
    for obj in date_stat['country']:
      if obj['_id'] and obj['_id'] != 'NA' and obj['_id']<194 and obj['_id']>0:
        #print obj
        meta = country_metadata[ str(obj['_id']) ]
        hdi_counts[ meta['hdi_index'] ] += obj['count']
      else:
        hdi_counts['NA'] += obj['count']
    
    date_stat['hdi'] = [ {'_id': id, 'count': count} for (id, count) in hdi_counts.items() ]
    
    
    
    #aggregate choices ---
    rec_result = collection.aggregate([
                      {"$match" : dict_query },
                      {"$unwind": "$choices"},
                      {"$group": {"_id": "$choices", "count": {"$sum": 1}}}])
    date_stat['recs'] = rec_result['result']
    #filter out suggest priority 0
    date_stat['recs'] = [ obj for obj in date_stat['recs'] if obj['_id'] != 0 ]
    date_stat['recs'] = sorted( date_stat['recs'], key=lambda x: x['count'], reverse = True)
    
    #add explicit zero
    if len(date_stat['recs']) != 16:
      for i in range(1,17):
        contains = [ obj for obj in date_stat['recs'] if obj['_id'] == i ]
        if not contains:
          date_stat['recs'] += [ {'_id': i, 'count': 0} ]
    
    #fill holes in date_stat
    for var_name in var_names:
      for i in range(1,  segment_keys[var_name]['options']+1):
        #check if obj exists
        found = [obj for obj in date_stat[var_name] if obj['_id'] == i]
        if not found:
          #add explicit zero
          date_stat[var_name].append( {'_id': i, 'count': 0} )
    
    yesterday = datetime.now().date()-timedelta(days=1)
    if (bin_date.date() < yesterday):
      #cache forever
      print 'Storing to cache'
      mc.set(cache_key, date_stat, CACHE_INF)
    else:
      print 'Too recent to store'
    
    date_stats += [date_stat]
  
  return date_stats

def get_partner_ids():
  partners = get_partners()['partners']
  partner_ids = []
  for partner in partners:
    partner_ids += [partner['volunteer_id']]
    
  return partner_ids

def get_partners():
  partner_doc = db['partners2'].find_one()
  #partners = partner_doc['partners']
  partners = [ partner_obj for partner_obj in partner_doc['partners'] if partner_obj['volunteer_id'] ]
  return {'partners' : partners}
  
def jaccard_coeff(s_1, s_2):
  "calculate the jaccard coefficient of two sets"
  return len(s_1.intersection(s_2)) / float(len(s_1.union(s_2)))

def make_cache_key(request):
  return request.urlparts[2] + '/' + request.urlparts[3]

def normalize_segment_view( dict_segment, dict_stats , request):
  "normalize the json return for csv formatting"
  nrows = len(dict_stats['rankings'])
  
  dict_table = {}
  
  if 'age' in dict_segment:
    dict_table['age_lb'] = [ dict_segment['age']['$gte'] ] * nrows
    dict_table['age_ub'] = [ dict_segment['age']['$lte'] ] * nrows
  else:
    dict_table['age_lb'] = [ 'ALL' ] * nrows
    dict_table['age_ub'] = [ 'ALL' ] * nrows
    
  if 'sourceMethod' in dict_segment:
    vals = [ val for val in dict_segment['sourceMethod']['$in'] ]
    entry = ','.join(vals)
    dict_table['sourceMethod'] = [ entry ] * nrows
  else:
    dict_table['sourceMethod'] = [ 'ALL' ] * nrows
    
  #demographic user selection
  demo_keys = ['education','gender']
  for key in demo_keys:
    if key in dict_segment:
      vals = [str(val) for val in dict_segment[key]['$in']]
      if key in dict_id_name:
        #map
        vals = [ dict_id_name[key][str(val)] for val in dict_segment[key]['$in'] ]
      entry = ','.join(vals)
    else:
      entry = 'ALL'
    dict_table[key] = [ entry ] * nrows
    
  #geographic user selection
  dict_table['geo'] = [ 'ALL' ] * nrows
  
  if 'country' in dict_segment:
    vals = [ dict_id_name['country'][str(val)] for val in dict_segment['country']['$in'] ]
    entry = ','.join(vals)
    dict_table['geo'] = [ entry ] * nrows
  
  country_group_keys = ['continent', 'hdi', 'region']
  
  for key in country_group_keys:
    #check if country group was specified
    if key in request.query.keys():
      vals = [ dict_id_name[key][str(val)] for val in request.query[key].split(',') ]
      entry = ','.join(vals)
      dict_table['geo'] = [ entry ] * nrows
  
  #total votes
  dict_table['total_voters'] = [ dict_stats['tVotes'] ] * nrows
  
  #support for recommendations
  dict_table['priority'] = []
  dict_table['votes'] = []
  
  for rec in dict_stats['rankings']:
    dict_table['priority'] += [ dict_id_name['priorities'][rec['id']] ]
    dict_table['votes'] += [ rec['count'] ]
  
  return dict_table

def overlap(s_1, s_2):
  "calculate the overlap of two sets"
  return len(s_1.intersection(s_2))

# LAUNCH BOTTLE APP ##########
run(app, host=settings['host'], port=settings['port'])
