import sys
import json
from pymongo import MongoClient, Connection
from bson.objectid import ObjectId
from datetime import datetime
import time
from pprint import pprint

# settings
numVotes = int(sys.argv[1]) if len(sys.argv) > 1 else 10
run_mode = sys.argv[2] if len(sys.argv) > 2 else "production"
amt = int(sys.argv[3]) if len(sys.argv) > 3 else 1
qualityThreshold = -3 		# only select votes with quality greater than this
statField = "stat" if run_mode == "dev" else "statC"
markVal = 2
batchsize = 10000

# statsdb
if run_mode == "dev":
  import statsdb_dev as statsdb
else:
  import statsdb

# connect to Redis
success = statsdb.connect(run_mode)
if success == 0:
  print "Error connecting to Redis"

# db
connection = Connection('mongodb://analytics:plantyours1234@ds049937.mongolab.com:49937/myworld_master2', 49937)
db = connection.myworld_master2
collection = db['votes']

# query
search = { statField: { "$ne": markVal }, "data_quality": { "$gt": qualityThreshold } }
# search = { statField: markVal , "data_quality": { "$gt": qualityThreshold } }

fields = {
	"sourceMethod" : 1,
	"choices" : 1,
	"partner" : 1,
	"age" : 1,
	"gender" : 1,
	"country" : 1,
	"education" : 1,
}

# do query
def doQuery(howmany):
	votes = []
	for vote in collection.find(search, fields, limit=howmany):

		# modify vote data
		vote["choices"] = ",".join([ str(v) for v in vote["choices"] ])

		# test text encoding
		for k in vote:
			try:
				vote[k] = unicode(vote[k]).decode("utf8")
			except UnicodeEncodeError:
				# print "Removing: " + vote[k]
				vote[k] = None

		votes.append(vote)
	return votes

# runtime
count = 0
countProcessed = 0
timestart = time.time()
newhowmany = 1000000
print "%s **************** mode: %s, stat field: %s, stat val: %s, amount: %d" % (datetime.now(), run_mode, statField, markVal, amt)
while numVotes > 0:
	count += 1
	howmany = batchsize if batchsize < numVotes else numVotes
	numVotes -= howmany

	votes = doQuery(howmany)
        #votes = doQuery(newhowmany)
	if len(votes) == 0:
		break

	inserted = 0
	for vote in votes:
		result = statsdb.pushData("vote", vote, vote["choices"], amt=amt)
		if "incremented" in result:
			collection.update({ "_id": ObjectId(vote["_id"]) }, { "$set": { statField: markVal } })
			inserted += 1

	countProcessed += inserted

print "Finished! Took: %d seconds. Processed %d votes." % ((time.time() - timestart), countProcessed)


