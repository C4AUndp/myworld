#!/usr/bin/python
import sys
import json
import copy
from datetime import datetime, timedelta
from functools import update_wrapper
from flask import Flask, make_response, request, current_app
from werkzeug.contrib.cache import MemcachedCache
from pymongo import MongoClient, Connection
import time
from pprint import pprint

# run mode
if __name__ == "__main__":
  run_mode = "dev"
else:
  run_mode = "production"

# stats db
sys.path.append("/home/ubuntu/statsdb")
if run_mode == "dev":
  import statsdb_dev as statsdb
else:
  import statsdb

# connect to Redis
success = statsdb.connect(run_mode)
if success == 0:
  print "Error connecting to Redis"

# config files
myworld_config = json.load(open("/home/ubuntu/myworld_config/config.json", "r"))

# cache
cache = MemcachedCache(['127.0.0.1:11211'])

# ************************************************************************************************ setup

# vars
objId = "vote"

# Flask configuration
app = Flask(__name__)
app.debug = True

# CORS decorator from http://flask.pocoo.org/snippets/56/
def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

# ****************************************************************** routing

# IMPORTANT: specified params determine caching key, so include all parameters that make a call unique
routes = {
  "/": { "func": "ping" },
  "/segment": { "func": "getSegment", "cache": 60*3, "params": [ "sourceMethod", "partner", "age", "gender", "education", "country", "hdi", "continent", "region" ] },
  "/demographics": { "func": "getDemographics", "cache": 60*3, "params": [ "sourceMethod", "partner", "age", "gender", "education", "country", "hdi", "continent", "region" ] },
  "/countries": { "func": "getAllCountries", "cache": 60*3, "params": [ "sourceMethod", "partner", "hdi", "continent", "region" ] },
  "/value_list": { "func": "getValueList", "cache": 60*3, "params": [ "dim" ] },
  "/segment_comparison": { "func": "getSegmentComparison", "cache": 60*15 },
  "/map_stats": { "func": "getMapStats", "cache": 60*15 },
}

@app.route("/")
@app.route("/segment")
@app.route("/demographics")
@app.route("/countries")
@app.route("/value_list")
@app.route("/segment_comparison")
@app.route("/map_stats")
@crossdomain(origin="*")
def route():

  if request.path in routes:

    # timing
    if run_mode == "dev":
      timestart = time.time()
    
    # vars
    r = routes[request.path] # route object
    args = processArgs(request.args) # arguments
    format = args["format"] if "format" in args else "json" # format
    skip_cache = True if "nocache" in args and args["nocache"] == "1" else False # skip cache?

    # if cacheable
    if "cache" in r and run_mode != "dev" and format == "json":

      # make cache key
      if "params" in r:
        cache_key = makeCacheKey(r["func"], request.args, r["params"])
      else:
        cache_key = r["func"]

      # get cache
      if not skip_cache:
        cached_ret = cache.get(cache_key)
        if cached_ret is not None:
          return cached_ret

    # call route function
    ret = globals()[r["func"]](args)

    # run mode flag
    if run_mode != "production":
      ret["_mode"] = run_mode

    # csv output
    if format == "csv":
      ret_csv = formatSegmentCSV(ret)
      print ret_csv

    # formatting
    ret = outputJSON(ret)

    # set cache
    if "cache" in r and run_mode != "dev":
      cache.set(cache_key, ret, timeout=r["cache"])

    # timing output
    if run_mode == "dev":
      print "%s computation took: %d seconds." % (request.path, (time.time() - timestart))

    # return csv    
    if format == "csv":
      # response = make_response(ret_csv)
      # response.headers['content_type'] = 'text/csv'
      # response.headers['Content-Disposition'] = 'attachment; filename="myworld_analytics_data.csv"'
      return "csv"

    # return json
    else:
      return ret


  else:
    return outputJSON({ "error": "unrecognized API call: %s" % request.path })



# ****************************************************************** response functions

def ping(args):
  return { "hello": "MyWorld API2!" }

def getSegment(args):
  ret = statsdb.getData(objId, args)
  ret = formatSegment(ret)
  return ret

def getDemographics(args):
  ret = statsdb.aggregateTotals(objId, args, [ "age", "gender", "education", "country" ]);
  if "country" in ret["dimensions"]:
    ret["dimensions"]["hdi"] = aggregateDimension("hdi", ret["dimensions"]["country"])
  # ret = formatStats(ret)
  return ret

def getAllCountries(args):
  countries = myworld_config["country_metadata"]
  ret = { "countries": [] }
  ret["overall"] = statsdb.aggregateTotals(objId, args, [ "age", "gender", "education", "country" ])
  
  for country_id in ret["overall"]["dimensions"]["country"]:
    
    argsClone = copy.deepcopy(args)
    if country_id in myworld_config["country_metadata"]:
      c = myworld_config["country_metadata"][country_id]
      argsClone["country"] = country_id
      c["id"] = country_id
    else:
      c = None

    if c is not None:
      c["stats"] = statsdb.aggregateTotals(objId, argsClone, [ "age", "gender", "education" ])
      c["segment"] = formatSegment(statsdb.getData(objId, argsClone))
      ret["countries"].append(c)

  return ret

def getValueList(args):
  if "dim" not in args:
    return { "error": "missing 'dim' parameter" }  
  dimKey = args["dim"]
  values = statsdb.getTrackedValues("vote", dimKey)
  if dimKey == "partner":
    values = formatPartnerValueList(values)
  else:
    values = formatValueList(values)
  return values

def getSegmentComparison(args):
  ret = {}
  ret["total"] = formatSegment( statsdb.getData(objId, {}) )
  ret["gender1"] = formatSegment( statsdb.getData(objId, processArgs({ "gender": 1 }) ) )
  ret["gender2"] = formatSegment( statsdb.getData(objId, processArgs({ "gender": 2 }) ) )
  ret["ageGroup1"] = formatSegment( statsdb.getData(objId, processArgs({ "age": "1,20" }) ) )
  ret["ageGroup2"] = formatSegment( statsdb.getData(objId, processArgs({ "age": "35,50" }) ) )
  ret["ageGroup3"] = formatSegment( statsdb.getData(objId, processArgs({ "age": "65" }) ) )
  ret["hdi1"] = formatSegment( statsdb.getData(objId, processArgs({ "hdi": 1 }) ) )
  ret["hdi2"] = formatSegment( statsdb.getData(objId, processArgs({ "hdi": 2 }) ) )
  ret["hdi3"] = formatSegment( statsdb.getData(objId, processArgs({ "hdi": 3 }) ) )
  ret["hdi4"] = formatSegment( statsdb.getData(objId, processArgs({ "hdi": 4 }) ) )
  for k in ret:
    ret[k]["tVotes"] = ret[k]["_total"]
    for r in ret[k]["rankings"]:
      r["id"] = r["pri_id"]
      del r["pri_id"]
    ret[k]["rankings"] = sorted(ret[k]["rankings"], key=lambda x: x["count"], reverse=True)
  ret["computed_at"] = int(time.time())
  return ret

def getMapStats(args):
  countries = myworld_config["country_metadata"]
  ret = { "countries": [], "computed_at": int(time.time()) }
  # total
  total = statsdb.getData(objId, {})
  ret["tVotes"] = total["values"]["_total"]
  # countries
  for country_id in countries:
    c = myworld_config["country_metadata"][country_id]
    c["id"] = country_id
    stats = statsdb.aggregateTotals(objId, { "country": country_id }, [ "age", "gender" ])
    c["demo"] = stats["dimensions"]
    c["tVotes"] = stats["_total"]
    c["country"] = c["id"]
    del c["id"]
    # c["segment"] = formatSegment(statsdb.getData(objId, { "country": country_id }))
    ret["countries"].append(c)    
  return ret

# ****************************************************************** response formatting

# segment format
def formatSegment(data):
  if "values" not in data or "_total" not in data["values"]:
    # return { "error": "no values returned by stats db" }
    data = { "values": { "_total": 0 }, "_timestamp": str(datetime.now()) }
    for k in range(1, 17):
      data["values"][k] = 0
  data["rankings"] = []    
  data["_total"] = data["values"]["_total"]
  if "values" in data:
    for k in data["values"]:
      try:
        kInt = int(k)
        if kInt > 0 and kInt < 17:
          data["rankings"].append({ "pri_id": str(k), "count": data["values"][k] })
      except ValueError:
        pass
  del data["values"]
  return data

def formatSegmentCSV(data):
  ret = []
  for r in data["rankings"]:
    row = {
      "priority": myworld_config["priorities"][r["pri_id"]]["item-title"],
      "total_voters": data["_total"],
      "votes": r["count"]
    }
    ret.append(row)
  return ret

def formatValueList(values):
  ret = { "_total": values["_total"], "values": [] }
  for k in values:
    if k[0:1] != "_":
      ret["values"].append({
        "key": k,
        "count": values[k]
      })
  return ret

def formatPartnerValueList(values):
  # get valid partners from db
  db = getMongo()
  partner_doc = db['partners2'].find_one()
  ret = { "partner_rankings": [] }
  for p in partner_doc["partners"]:
    pid = p["volunteer_id"].lower()
    val = values[pid] if pid in values else 0
    ret["partner_rankings"].append({
      "volunteer_id": p["volunteer_id"],
      "organization": p["organization"],
      "tVoters": val
    })
  return ret

# stats format
# def formatStats(data):
#   if "_timestamp" not in data or "_total" not in data:
#     return { "error": "no values returned by stats db" }
#   ret = { "computed_at": data["_timestamp"], "tVotes": data["_total"], "_original": data }
#   dims = [
#     { "in": "age", "out": "tAge", "vals": { "34": "1", "54": "2", "140": "3" } },
#     { "in": "gender", "out": "tGender", "vals": { "1": "1", "2": "2" } },
#     { "in": "education", "out": "tEdu", "vals": { "1": "1", "2": "2", "3": "3", "4": "4" } },
#     { "in": "hdi", "out": "tHDI", "vals": { "1": "1", "2": "2", "3": "3", "4": "4" } }
#   ]
#   for d in dims:
#     for v in d["vals"]:
#       key = d["out"]+d["vals"][v]
#       if d["in"] in data["dimensions"] and v in data["dimensions"][d["in"]]:
#         value = data["dimensions"][d["in"]][v]
#       else:
#         value = 0
#       ret[key] = value
#   return ret

# ****************************************************************** helpers

# connect to mongo db
def getMongo():
  connection = Connection('mongodb://analytics:plantyours1234@ds049937.mongolab.com:49937/myworld_master2', 49937)
  return connection.myworld_master2

# process request arguments
def processArgs(args):
  ret = {}
  for a in args:

    # split into list
    ret[a] = str(args[a]).split(",")

    # value processing
    for i,v in enumerate(ret[a]):

      # replace 0 with *
      if v == "0":
        v = "*"

      elif v == "pro-post":
        v = "Pro-post"
      elif v == "geodrc":
        v = "GEODRC"
      elif v == "UNAIDS":
        v = "unaids"
      elif v == "seedff":
        v = "SEEDFF"
      
      ret[a][i] = v
    
    # remove list if one result
    if len(ret[a]) == 1:
      ret[a] = ret[a][0]

  # special argument processing  
  # replace country list with set based on hdi/region/continent
  for dim in [ "hdi", "region", "continent" ]:
    mapping = myworld_config[ dim + "_country" ]
    if dim in ret and ret[dim] != "*":
      if not isinstance(ret[dim], list):
        ret[dim] = [ ret[dim] ]
      ret["country"] = []
      for d in ret[dim]:
        d = str(d)
        if d in mapping:
          ret["country"] += mapping[d]
      break # only do one of these, since they would override each other

  return ret


# make cache key based on valid arguments
def makeCacheKey(prefix, args, params):
  key = [ prefix ]
  for k in sorted(params):
    if k in args:
      v = args[k]
      if isinstance(v, list):
        v = ",".join(sorted([ str(vv) for vv in v ]))
    else:
      v = "*"
    key.append(v)
  return "|".join(key)


# aggregate data on a given dimension (e.g. hdi)
def aggregateDimension(dim, data):
  ret = {}
  
  if dim in [ "hdi", "region", "continent" ]:
    output_vals = myworld_config["country_metadata"]
    output_key = dim
    if dim == "hdi":
      output_key = "hdi_index"
  
  if output_key and output_vals:
    for d in data:
      input_key = str(d)
      if input_key in output_vals:
        v = str(output_vals[input_key][output_key])
        if v not in ret:
          ret[v] = 0
        ret[v] += data[d]

  return ret


# output JSON
def outputJSON(data):
  return json.dumps(data)


#output CSV string
def outputCSV(dict_table, columns = []):
  return "test"
  # if not columns:
  #   columns = sorted(dict_table.keys())
  
  # for column in columns:
  #   if not isinstance(dict_table[column][0], int):
  #     #convert
  #     dict_table[column] = [ '"' + entry + '"' \
  #                         for entry in dict_table[column] ]
                        
  # str_csv = ''
  # str_rows = []
  # nrows = len(dict_table[columns[0]])
  
  # #add header row
  # str_rows += [ ','.join(columns) ]
  
  # for i in range(nrows):
  #   row = [ dict_table[column][i] for column in columns ]
  #   str_row = ','.join([str(entry) for entry in row])
  #   str_rows += [ str_row ]
  
  # return '\n'.join(str_rows)


# ****************************************************************** runtime

if __name__ == "__main__":
  app.run(host="localhost")

application = app