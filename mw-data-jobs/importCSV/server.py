import imp
import sys
from bottle import Bottle, hook, route, request, response, run
import io
import csv
from StringIO import StringIO
from pymongo import MongoClient, Connection
from pprint import pprint

# mode
if len(sys.argv) > 1:
	mode = sys.argv[1]
else:
	mode = "wsgi"

sys.path.append("/home/ubuntu/importCSV")

# import csv_validator
csv_validator = imp.load_source("csv_validator", "/home/ubuntu/importCSV/csv_validator.py")

# setup db
connection = Connection('mongodb://analytics:plantyours1234@ds057197.mongolab.com:57197/myworld_manual2', 57197)
db = connection.myworld_manual2
collections = {
	"production": db["csv_votes"],
	"test": db["test"]
}

# setup Bottle
app = Bottle()

@hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = '*'

# ***********************************************************************************************************************

@route("/ping")
@route("/", method="GET")
def ping():
	return "Up and running"

@route("/", method="POST")
def processUpload():
	"""Process the uploaded form and file and respond with the results."""

	# get file object
	f = request.files.get("csv", "rU")
	if f is None:
		return { "error": "Unable to find uploaded file" }

	# get upload metadata
	metadata = {
		"sourcemethod" : { "req": True, "val": None, "parse": "string" },
		"sourcenote" : { "req": True, "val": None, "parse": "string" },
		"import" : { "req": False, "val": None, "parse": "int" },
		"test" : { "req": False, "val": None, "parse": "int" }
	}
	passed = True
	for k in metadata:
		if k in request.POST and len(request.POST[k]) > 0:			
			if metadata[k]["parse"] == "string":
				metadata[k]["val"] = str(request.POST[k])
			elif metadata[k]["parse"] == "int":
				metadata[k]["val"] = int(request.POST[k])
			else:
				metadata[k]["val"] = request.POST[k]
		elif metadata[k]["req"] == True:
			passed = False
	if passed == False:
		return { "error": "Missing upload metadata" }

	# send csv file to validator
	results = csv_validator.parse_file(f.file, metadata["sourcenote"]["val"], metadata["sourcemethod"]["val"])

	# response object
	response = results["messages"]

	# if warnings, collect rows with warnings on them
	if "warnings" in results["messages"]:

		print "Processing " + str(len(results["messages"])) + " warnings..."

		# warning rows will contain a dictionary of id > row data
		response["warningRows"] = {}

		# reset pointer on file and read into array of lines
		f.file.seek(0)
		fstr = f.file.read()
		fstr = '\n'.join(fstr.splitlines())
		csv_io = StringIO(fstr)
		dialect = csv.Sniffer().sniff(csv_io.readline(), delimiters=",")
		csv_io.seek(0)
		lines = []
		for row in csv.reader(csv_io, dialect=dialect):
			lines.append(",".join(row))

		# headers
		response["originalHeaders"] = lines[0] # send headers for display with rows

		# collect lines with warnings on them
		for warning in results["messages"]["warnings"]:
			if "row" in warning:
				rowIndex = int(warning["row"]) + 1 # add 1 because headers not included in csv_validator data frame				
				if rowIndex < len(lines)-1:
					line = lines[rowIndex]
					try:
						line = unicode(line).decode("utf8")
					except UnicodeDecodeError:
						line = "*** error decoding value ***"
					response["warningRows"][str(warning["row"])] = line

	# do import?
	if metadata["import"]["val"] == 1:
		response["import"] = importVotes(results["docs"], metadata["test"]["val"])

	# response
	if response is not None:
		print "Sending response..."
		return response

	else:
		return { "error": "File error" }


# ***********************************************************************************************************************

def importVotes(docs, test):
	"""Import the validated votes into the database and return the results."""

	print "Performing import..."

	if test == 1:
		dest = collections["test"]
		destNote = "test"
	else:
		dest = collections["production"]
		destNote = "production"

	numImported = 0
	for doc in docs:

		# clean up fields before inserting
		for f in ["suggested_priority", "vote_reason", "csv_row"]:
			if f in doc:
				try:
					doc[f] = unicode(doc[f]).decode("utf8")
				except AttributeError:
					doc[f] = ""				
				except UnicodeDecodeError:
					doc[f] = ""

		# insert the doc
		try:
			newId = dest.insert(doc)
			if newId is not None:
				numImported += 1
		except:
			pprint(doc)


	return { "success": 1, "imported": numImported, "destination": destNote }



# ***********************************************************************************************************************

application = app

if mode == "local":
	run(host='localhost', port=1339)
