#!/usr/bin/python3.2

# Import the email modules we'll need
#*/15 * * * * /home/nstahl/myworld_api/monitor_server/update_cache.py >> /home/nstahl/myworld_api/monitor_server/cronlogs_cache.log 2>&1
from email.mime.text import MIMEText
# Import smtplib for the actual sending function
import json
import datetime
import os
import pdb
import re
import signal
import smtplib
import subprocess
import sys
import time
from urllib.request import urlopen

def download(call_url, dest):
  print("Downloading: " + call_url)
  str_towrite = ''
  try:
    result = urlopen(url=call_url, timeout=60*10)
    str_towrite = result.read().decode('utf-8')
    try: 
      print("Writing to: " + dest)
      f = open(dest, 'w')
      f.write(str_towrite)
      f.close()
      return result.code
    except IOError as e:
      print("I/O error({0}): {1}".format(e.errno, e.strerror))
    except:
      print("Could not write to: " + dest)
      print("Unexpected error:", sys.exc_info()[0])
  except:
    print("Could not connect to " + call_url)
  return -1

""""
  Function to send alert email
  based off http://segfault.in/2010/12/sending-gmail-from-python/
"""
def send_alert_gmail():
  SMTP_SERVER = 'smtp.gmail.com'
  SMTP_PORT = 587
   
  sender = 'myworldmonitor@gmail.com'
  recipients = ['gayan.peiris@undp.org', 'jeff.huber@sysflow.com']
  subject = 'Writing static files failed'
  body = """Could not write static file"""
  
  body = "" + body + ""
   
  headers = ["From: " + sender,
             "Subject: " + subject,
             "To: " + ", ".join(recipients),
             "MIME-Version: 1.0",
             "Content-Type: text/html"]
  headers = "\r\n".join(headers)
   
  session = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
   
  session.ehlo()
  session.starttls()
  session.ehlo
  session.login(sender, 'poverty2015')
   
  session.sendmail(sender, recipients, headers + "\r\n\r\n" + body)
  session.quit()
  print('Sent email')
  return


if __name__ == '__main__':
  print(datetime.datetime.now().isoformat())
  dir = '/var/www/static/'
  
  downloads = [
    # {'url': "http://ec2-23-22-13-62.compute-1.amazonaws.com/stats/public/segment_comparison", 'destination': 'segment_comparison.json'},
    {'url': "http://54.227.246.164/stats2/segment_comparison", 'destination': 'segment_comparison.json'},
    # {'url': "http://ec2-23-22-13-62.compute-1.amazonaws.com/stats/public/map", 'destination': 'map_stats.json'},
    {'url': "http://54.227.246.164/stats2/map_stats", 'destination': 'map_stats.json'},
    {'url': "http://54.227.246.164/stats/public/recent_votes",'destination': 'recent_votes.json'}
  ]
  
  results = []
  for obj in downloads:
    results += [download(obj['url'], dir + obj['destination'])]
    
  if min(results) != 200:
    send_alert_gmail()
  else:
    print('All files downloaded successfully')
  sys.exit(0)
