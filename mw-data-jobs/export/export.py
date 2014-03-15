import sys, csv, json
from datetime import datetime
from pymongo import MongoClient, Connection
import re

startTime = datetime.now()

qualityThreshold = -4 		# only select votes with quality greater than this
limit = 0					# 0 for none

config_dir = "/home/ubuntu/myworld_config/"
db_values_config = json.load(open(config_dir + "csv_db_value_mapping.json"))

connection = Connection('mongodb://analytics:plantyours1234@ds049937.mongolab.com:49937/myworld_master2', 49937)
db = connection.myworld_master2
votes = db['votes']

# get filepath dest from args
filepath = sys.argv[1]
print "Saving to: "+filepath

# get optional sourceMethod filter
if len(sys.argv) > 2:
	sourceMethod = sys.argv[2]
else:
	sourceMethod = None

# query search
search = { 
	"data_quality" : { "$gt" : qualityThreshold },
}
if sourceMethod is not None:
	search["sourceMethod"] = sourceMethod

# return fields
ret = {
	"data_quality" : 1,
	"timestamp" : 1,
	"sourceMethod" : 1,
	"choices" : 1,
	"partner" : 1,
	"age" : 1,
	"gender" : 1,
	"country" : 1,
	"education" : 1,
	"suggested_priority" : 1,
	"vote_reason" : 1
}

# csv output fields
outputFields = [
	{ "header" : "date", "field" : "timestamp" },
	{ "header" : "source", "field" : "sourceMethod" },
	{ "header" : "partner_code", "field" : "partner" },

	{ "header" : "country", "field" : "country" },
	{ "header" : "age", "field" : "age" },
	{ "header" : "gender", "field" : "gender" },
	{ "header" : "education", "field" : "education" },

	{ "header" : "priority1", "field" : "choices", "op" : "getChoice", "opVal" : 0 },
	{ "header" : "priority2", "field" : "choices", "op" : "getChoice", "opVal" : 1 },
	{ "header" : "priority3", "field" : "choices", "op" : "getChoice", "opVal" : 2 },
	{ "header" : "priority4", "field" : "choices", "op" : "getChoice", "opVal" : 3 },
	{ "header" : "priority5", "field" : "choices", "op" : "getChoice", "opVal" : 4 },
	{ "header" : "priority6", "field" : "choices", "op" : "getChoice", "opVal" : 5 },

	{ "header" : "suggested_priority", "field" : "suggested_priority", "op" : "clean" },
	{ "header" : "vote_reason", "field" : "vote_reason", "op" : "clean" },

	{ "header" : "data_note", "field" : "data_quality", "op" : "interpretQuality" },

]

dataNotes = {
	# -1 : "Unknown partner id",
	# -3 : "One or more fields may be missing",
}

# find emails regex
r_emails = re.compile(ur'[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}', re.IGNORECASE|re.UNICODE)

# arrange dict of choice values
validChoiceValues = {}
for c in db_values_config["choices"]:
	validChoiceValues[c["db"]] = c["csv"]

csvfile = open(filepath, "w")
csvwriter = csv.writer(csvfile, delimiter=",")

headers = []
for f in outputFields:
	headers.append(f["header"])
csvwriter.writerow(headers)

# do the query
for vote in votes.find(search, ret).sort("timestamp", 1).limit(limit):
	
	# row will hold our row data
	row = []

	# pull out special values
	if "choices" in vote:
		choiceVals = []
		for v in vote["choices"]:
			if v in validChoiceValues:
				choiceVals.append(validChoiceValues[v])
		choiceVals = sorted(choiceVals)
	else:
		choiceVals = []

	# loop through output fields
	for f in outputFields:

		# check if in the doc
		if f["field"] in vote:
			val = vote[f["field"]]

			# special operations on some fields
			if "op" in f:

				# clean string
				if f["op"] == "clean":
					if val is not None and len(val) > 0:
						val = r_emails.sub(u"*****", val)

				# get choice from choices array
				if f["op"] == "getChoice":
					if f["opVal"] < len(choiceVals):
						val = choiceVals[f["opVal"]]
					else:
						val = ""
				
				# interpret data quality as note
				elif f["op"] == "interpretQuality":
					if val in dataNotes.keys():
						val = dataNotes[val]
					else:
						val = ""


			# string processing
			# TODO: is this working??
			if type(val) == str or type(val) == unicode:
				try:
					val = val.encode("utf8")
				except UnicodeDecodeError:
					val = ""

			row.append(val)

		else:
			# null value
			row.append("")

	csvwriter.writerow(row)

print "Script took: " + str(datetime.now() - startTime)










