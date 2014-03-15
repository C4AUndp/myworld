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
statField = "stat" if run_mode == "dev" else "statB"
markVal = 1
partnerVal = "BiNu"
partnerKey = "8reJtS3ZXqRAdbye0hxnxuBS"
newqualityThreshold = -6
qualityField = "data_quality"
batchsize = 100

# db
connection = Connection('mongodb://analytics:plantyours1234@ds049937.mongolab.com:49937/myworld_master2', 49937)
db = connection.myworld_master2
collection = db['votes']

# query
search = {"partner" : partnerVal, "key" : partnerKey, "data_quality": { "$gt": qualityThreshold } }

fields = {
	"sourceMethod" : 1,
	"partner" : 1,
}

# runtime
count = 0
countProcessed = 0
timestart = time.time()
print "%s **************** mode: %s, Partner: %s,amount: %d" % (datetime.now(), run_mode, partnerVal, amt)
while numVotes > 0:
	count += 1
	howmany = batchsize if batchsize < numVotes else numVotes
	numVotes -= howmany

	inserted = 0
	for vote in collection.find(search, fields, limit=howmany):
		print "ObjectId %s *********** Partner %s ********** SourceMethod %s" % (vote["_id"],vote["partner"],vote["sourceMethod"]) 
		#collection.update({ "_id": ObjectId(vote["_id"]) }, { "$set": { qualityField: newqualityThreshold } })
		inserted += 1
	countProcessed += inserted

print "Finished! Took: %d seconds. Processed %d votes." % ((time.time() - timestart), countProcessed)


