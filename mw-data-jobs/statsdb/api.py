import json
from flask import Flask, request

# ************************************************************************************************ setup

# Flask configuration
app = Flask(__name__)
app.debug = True

# run mode
run_mode = "dev"

# statsdb
if run_mode == "dev":
  import statsdb_dev as statsdb
else:
  import statsdb

# connect to Redis
success = statsdb.connect(run_mode)
if success == 0:
  print "Error connecting to Redis"

# ************************************************************************************************ get data

@app.route("/")
def ping():
	return "StatsDB!"

@app.route("/get")
def getData():
	objId = request.args.get("obj")
	args = processArgs(request.args)
	return returnJSON(statsdb.getData(objId, args))

@app.route("/getinfo")
def getInfo():
	return returnJSON(statsdb.getInfo())

@app.route("/getbreakdown")
def getBreakdown():
	objId = request.args.get("obj")
	args = processArgs(request.args)
	dims = request.args.get("dims")
	if dims is None:
		return returnJSON({ "success": 0, "error": "missing 'dims' agrument; please supply a comma-separated list of dimensions to aggregate" })
	dims = dims.split(",")
	return returnJSON(statsdb.aggregateTotals(objId, args, dims))

@app.route("/getvalues")
def getValues():
	objId = request.args.get("obj")
	dimKey = request.args.get("dim")
	return returnJSON(statsdb.getTrackedValues(objId, dimKey))

# ************************************************************************************************ push data

@app.route("/push")
def pushData():

	# find object from configuration
	objId = request.args.get("obj")

	# key data
	keyData = processArgs(request.args)

	# data specifying how to increment
	incrData = request.args.get("d")
	
	# amount to increment/decrement
	amt = request.args.get("amt") or 1
	try:
		amt = int(amt)
	except ValueError:
		amt = 1

	return returnJSON(statsdb.pushData(objId, keyData, incrData, amt))

# ************************************************************************************************ remove data

# @app.route("/wipe")
# def wipeData():
# 	return returnJSON(statsdb.wipeData())

# ************************************************************************************************ helpers

def processArgs(args):
	ret = {}
	for a in args:
		ret[a] = args[a].split(",")
		if len(ret[a]) == 1:
			ret[a] = ret[a][0]
	return ret

def returnJSON(data):
	return json.dumps(data)

# ************************************************************************************************ runtime

if __name__ == "__main__":
	app.run(host="localhost")