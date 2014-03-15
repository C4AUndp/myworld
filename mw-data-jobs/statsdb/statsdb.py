import json
from datetime import datetime
import redis
import copy
from pprint import pprint

# main configuration
config = json.load(open("/home/ubuntu/statsdb/config.json", "r"))

# Redis configuration
db = None

# connect to db based on run mode
def connect(mode):
	global db
	if mode not in config["dbs"]:
		return 0
	db_info = config["dbs"][mode]
	passwd = db_info["pass"] if "pass" in db_info else None
	db = redis.Redis(host=db_info["host"], port=db_info["port"], password=passwd)
	return 1

# ************************************************************************************************ get data

# get the number of keys in the db
def getInfo():
	return db.info()


# get the value for a given object and key dict
def getData(objId, keyData):

	ret = {}

	# check object id in config
	if objId not in config["objects"]:
		return { "success": 0, "error": "unable to find object of type '%s' in configuration" % objId }

	obj = config["objects"][objId]
	keys = createKeys(obj, keyData, op="group") # could be multiple because of grouping

	if len(keys) > 0:

		vals = []
		for k in keys:
			# try to get value
			val = getValue(obj["id"], k)
			if val is not None:
				vals.append(val)

		ret["values"] = sumValues(vals)

		# additional metadata
		ret["_keys"] = keys
		# val["_search"] = parseKey(key)
		ret["_timestamp"] = str(datetime.now())
		return ret
	
	# no keys
	else:
		return { "success": 0, "error": "unable to create key for object of type '%s' with these parameters" % obj }


# get value from db
def getValue(objId, key):
	obj = getConfigObj(objId) # lookup config object if necessary
	if obj is None:
		return None

	# get value
	if obj["storageType"] == "hash":
		val = db.hgetall(key)
		if "_total" in val:
			val["_total"] = int(val["_total"])
	else:
		val = db.get(key)

	# convert value(s) to proper format
	if val is not None and "outputFormat" in obj:	
		convertValue(val, obj["outputFormat"])

	return val


# get tracked values for obj/dimension and optional value key
def getTrackedValues(objId, dimKey, valKey=None):
	key = createValueTrackingKey(objId, dimKey)
	if valKey is not None:
		return int(db.hget(key, valKey))
	else:
		vals = db.hgetall(key)
		total = 0
		for k in vals:
			vals[k] = int(vals[k])
			total += vals[k]
		vals["_total"] = total
		return vals


# ************************************************************************************************ aggregate data


# get dimensional breakdown for a given set of dimension values (probably including some *'s)
# dims = array of dimensions to get breakdown for
def aggregateTotals(objId, keyData, dims):

	# object
	if objId not in config["objects"]:
		return { "success": 0, "error": "unable to find object of type '%s' in configuration" % objId }
	obj = config["objects"][objId]

	# search key
	keys = createKeys(obj, keyData, op="group")

	# object to return
	ret = { "_keys": keys, "dimensions": {}, "_keySearchUsed": 0 }

	# create list of all keys to get values for
	keysearch = []
	for key in keys:
		keyparts = key.replace("*", "\*")
		keyparts = keyparts.split("|")
		for i, dimension in enumerate(obj["dimensions"]):
			if dimension["key"] in dims:
				keyi = i+1 # offset by one, since object is first in the key
				newkeysearch = { "dim": dimension["key"], "keyIndex": keyi } # keysearch object
				if keyparts[keyi] == "\*":

					# create list of keys based on valid values
					if "valid" in dimension or "bins" in dimension:
						keyDataClone = copy.deepcopy(keyData)
						# based on bins
						if "bins" in dimension:
							keyDataClone[dimension["key"]] = ["*"] + dimension["bins"]
						# based on valid values
						else:
							if dimension["valid"]["type"] == "range":
								keyDataClone[dimension["key"]] = ["*"] + range(dimension["valid"]["min"], dimension["valid"]["max"]+1)
						# create keys
						newkeysearch["keys"] = createKeys(obj, keyDataClone, op="group")

					# if no list of valid values, search all keys for values (much more expensive)
					else:
						newkey = keyparts[:] # clone key parts array
						newkey[keyi] = "*" # replace this dimension with unescaped *
						newkey = "|".join(newkey) # collapse the new search key
						newkeysearch["dev"] = newkey
						newkeysearch["keys"] = db.keys(newkey)
						ret["_keySearchUsed"] += 1

				# if dimension has values specified
				else:
					newkeysearch["keys"] = createKeys(obj, keyData, op="group")

				keysearch.append(newkeysearch)

	# searches count
	count = 0

	# get the totals
	for s in keysearch:

		# get totals via pipeline
		pipeline = db.pipeline()
		for k in s["keys"]:
			count += 1
			if obj["storageType"] == "hash":
				pipeline.hget(k, "_total")
			else:
				pipeline.get(k)

		# assemble totals from response
		dimTotals = {}
		for i, r in enumerate(pipeline.execute()):
			k = s["keys"][i]

			dim = k.split("|")[s["keyIndex"]]
			if dim == "*":
				dim = "_total"

			try:
				# integer handling
				if obj["outputFormat"] in ["int", "float"]:

					# result formatting
					r = int(r)

					# add dim to totals if not created yet
					if dim not in dimTotals:
						dimTotals[dim] = 0

					# add to total for this dimension
					dimTotals[dim] += r

			# could not parse format
			except TypeError:
				pass

		# add to return object
		if s["dim"] not in ret["dimensions"]:
			ret["dimensions"][s["dim"]] = []
		ret["dimensions"][s["dim"]].append(dimTotals)

	for dim in ret["dimensions"]:

		dimension = ret["dimensions"][dim]
		if isinstance(dimension, list):
			dimension = dimension[0]

		# add "other" option
		if "_total" in dimension:
			valTotal = 0
			for k in dimension:
				if k != "_total":
					valTotal += dimension[k]
			dimension["_other"] = dimension["_total"] - valTotal
		
		ret["dimensions"][dim] = dimension


	# timestamp
	ret["_timestamp"] = str(datetime.now())

	# get total
	if len(ret["dimensions"]) > 0 and "_total" in ret["dimensions"][dims[0]]:
		ret["_total"] = ret["dimensions"][dims[0]]["_total"]
	else:
		ret["_total"] = 0

	# add total search count
	ret["_searchesPerformed"] = count

	return ret


# ************************************************************************************************ push data

# push array of new data objects
# expects array of data objects with all the arguments needed for pushData
def pushMany(data):
	results = []
	# assemble pipeline
	pipeline = db.pipeline()
	for d in data:
		if "objId" and "keyData" and "incrData" in d:
			amt = d["amt"] if "amt" in d else 1
			r = pushData(d["objId"], d["keyData"], d["incrData"], amt, pipeline)
			results.append(r)
	# execute
	pipeline.execute()
	return results

# object id, key data (dict), incr data (any), amt to increment
def pushData(objId, keyData, incrData, amt=1, pipeline=None):

	# check object id in config
	obj = getConfigObj(objId)
	if obj is None:
		return { "success": 0, "error": "unable to find object of type '%s' in configuration" % objId }

	# format key data
	keyData = formatKey(keyData, obj)

	# amount to increment/decrement
	try:
		amt = int(amt)
	except ValueError:
		amt = 1

	keys = createKeys(obj, keyData, op="all")
	if keys is None:
		return { "error": "unable to create keys for these values" }

	ret = {}

	# increment rows
	ret["incremented"] = incrementRows(obj["incrementType"], keys, incrData, amt=amt, pipeline=pipeline)

	# track values
	ret["tracked"] = trackValues(obj, keyData, amt=amt, pipeline=pipeline)

	return ret
	

# increment each key's value
# amt can be negative; pass a pipeline object to add increments to it and skip execution
def incrementRows(op, keys, data, amt=1, pipeline=None):
	result = 0

	# parse data string
	data = data.split(",")

	# new pipeline?
	if pipeline is None:
		pipeline = db.pipeline()
		executeAfter = True
	else:
		executeAfter = False

	# add to pipeline
	for k in keys:

		# increment hash
		if op == "hash":
			# result += increment_hash(k, data, amt)
			# increment each element in data
			for d in data:
				pipeline.hincrby(k, d, amt)
			# increment total
			if amt == 0:
				totalby = 0
			elif amt < 0:
				totalby = -1
			else:
				totalby = 1
			pipeline.hincrby(k, "_total", totalby)

		# increment string
		else:
			pipeline.incr(k, amt)

		# counter
		result += 1

	# execute pipeline
	if executeAfter == True:
		pipeline.execute()

	return result

# track the values and total for any dimensions that call for values to be tracked
# will be stored in the db under _track|objId|dimension = { value: count, value: count }
def trackValues(obj, keyData, amt=1, pipeline=None):

	# new pipeline?
	if pipeline is None:
		pipeline = db.pipeline()
		executeAfter = True
	else:
		executeAfter = False

	result = 0
	for dim in obj["dimensions"]:
		if "track-values" in dim and dim["track-values"] == 1:
			if dim["key"] in keyData and keyData[dim["key"]] != "*":
				dimVal = keyData[dim["key"]]
				trackKey = createValueTrackingKey(obj["id"], dim["key"])
				pipeline.hincrby(trackKey, dimVal, amt)
				result += 1

	# execute pipeline
	if executeAfter == True:
		pipeline.execute()

	return result


# ************************************************************************************************ remove data

# wipe entire db
def wipeData():
	db.flushdb()
	return { "success": 1 }



# ************************************************************************************************ key parsing

# parse key into components dict
def parseKey(key):
	key = key.split("|")
	objId = key.pop(0)
	ret = None
	if objId in config["objects"]:
		ret = {}
		obj = getConfigObj(objId) # lookup config object if necessary
		for i, dim in enumerate(obj["dimensions"]):
			ret[dim["key"]] = key[i]
	return ret


# create key for obj type, based on passed params
def createKeys(obj, params, op="single"):

	obj = getConfigObj(obj) # lookup config object if necessary

	# 	values.append(val)
	key = formatKey(params, obj, emptyValue="*")
	values = makeKeyArray(key, obj, emptyValue="*")

	# create all permutations of keys based on values
	if op == "all" or op == "group":
		ret = []
		getKeys(ret, obj["id"], 0, values, obj["dimensions"], op)
		ret = list(set(ret)) # remove duplicates
	else:
		vals = []
		for v in values:
			if isinstance(v, list):
				vals.append(",".join(v))
			else:
				vals.append(v)
		ret = obj["id"] + "|" + "|".join(vals)

	return ret

# format all key values appropriately, based on object config
def formatKey(key, obj, emptyValue="none"):
	obj = getConfigObj(obj) # lookup config object if necessary

	for dim in obj["dimensions"]:
		# in key?
		if dim["key"] in key:
			param = key[dim["key"]]
			# handle lists of parameters
			if isinstance(param, list) == True:
				val = sorted([ str(formatKeyValue(p, dim)) for p in param ])
			# single value
			else:
				val = str(formatKeyValue(param, dim))	
		# not in key
		else:
			# if not specified, show all for this dimension
			val = emptyValue

		key[dim["key"]] = val

	return key


# format individual key value (will bin if necessary)
def formatKeyValue(val, dim):

	# empty
	if val is None:
		return "none"
	
	# String case handling: default is forced lower case
	if dim["type"] == "str":
		if "case-sensitive" not in dim or dim["case-sensitive"] != 1:
			val = val.lower()

	# None value
	if val == "" or val == "none":
		return "none"
	
	# transform to bins if necessary
	if "bins" in dim and val != "*" and val != "none":
		# sequential bins
		if dim["op"] == "sequential":
			valNum = float(val) if dim["type"] == "float" else int(val)
			found = 0
			for bin in dim["bins"]:
				if valNum <= bin:
					val = bin
					found = 1
					break
			if found == 0:
				return "none"

	return val


# turn key object into ordered array of values
def makeKeyArray(key, obj, emptyValue="none"):
	obj = getConfigObj(obj) # lookup config object if necessary
	ret = []
	for dim in obj["dimensions"]:
		if dim["key"] in key:
			ret.append(key[dim["key"]])
		else:
			ret.append(emptyValue)
	return ret


# recursive function to get all permutations of keys
def getKeys(keys, branch, i, vals, dims, op="all"):
	if i <= len(dims) - 1:
		if op == "group":
			if isinstance(vals[i], list):
				for v in vals[i]:
					getKeys(keys, branch+"|"+v, i+1, vals, dims, op)
			else:
				getKeys(keys, branch+"|"+vals[i], i+1, vals, dims, op)
		else:
			# "all"
			getKeys(keys, branch+"|*", i+1, vals, dims, op)
			# if specific val
			if vals[i] != "*":
				getKeys(keys, branch+"|"+vals[i], i+1, vals, dims, op)

	else:
		keys.append(branch)
	return keys


# create value tracking key
def createValueTrackingKey(objId, dimKey):
	return "|".join([ "_track", objId, dimKey ])


# ************************************************************************************************ helpers

# get object configuration if string (id)
def getConfigObj(obj):
	if isinstance(obj, str) or isinstance(obj, unicode):
		if obj in config["objects"]:
			return config["objects"][obj]
		else:
			return None
	else:
		return obj

# type conversion, including hashes of values
def convertValue(val, type):
	if isinstance(val, dict):
		for k in val:
			# skip underscores (metadata)
			if k[0:1] != "_":
				val[k] = convertValue(val[k], type)
		return val
	else:
		if type == "int":
			return int(val)
		elif type == "str":
			return str(val)

# sum values within a list of hashes, to produce one hash of totals
def sumValues(vals):
	ret = {}
	for v in vals:
		for k in v:
			if k not in ret:
				ret[k] = 0
			ret[k] += v[k]
	return ret
