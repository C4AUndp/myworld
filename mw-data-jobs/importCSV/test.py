import sys
from bottle import Bottle, hook, route, request, response, run

# mode
if len(sys.argv) > 1:
	mode = sys.argv[1]
else:
	mode = "wsgi"

# sys.path.append("/home/ubuntu/importCSV")

sys.stdout = sys.stderr

# setup Bottle
app = Bottle()

@hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = '*'

# ***********************************************************************************************************************

@route("/")
@route("/ping")
def ping():
	return "Test is working"


application = app

if mode == "local":
	run(host='localhost', port=1339)
