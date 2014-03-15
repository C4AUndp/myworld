#!/usr/bin/python3.2

# Import the email modules we'll need
#*/15 * * * * /home/nstahl/myworld_api/monitor_server/update_cache.py >> /home/nstahl/myworld_api/monitor_server/cronlogs_cache.log 2>&1
from email.mime.text import MIMEText
# Import smtplib for the actual sending function
import smtplib
import time
import datetime
import sys
import subprocess
from urllib.request import urlopen
import re
import signal
import os
import json
import pdb

def update_cache(urls):
  results = []
  for call_url in urls:
    print('Making call: ' + call_url)
    code = -1
    try:
      result = urlopen(url=call_url, timeout=60*15)
      code =  result.code
    except:
      print('Failed!')
    
    results += [ code ]
  return min(results)
  
""""
  Function to send alert email
  based off http://segfault.in/2010/12/sending-gmail-from-python/
"""
def send_alert_gmail():
  SMTP_SERVER = 'smtp.gmail.com'
  SMTP_PORT = 587
   
  sender = 'myworldmonitor@gmail.com'
  recipients = ['gayan.peiris@undp.org', 'jeff.huber@sysflow.com']
  subject = 'Updating Cache failed'
  body = """Could not update cache"""
  
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
  print('')
  print(datetime.datetime.now().isoformat())
  
  urls = ["http://54.227.246.164/stats/segment?&hdi=4",
  "http://54.227.246.164/stats/partner_rankings",
  "http://54.227.246.164/stats/segment",
  "http://54.227.246.164/stats/segment?&country=0&gender=0&education=0",
  "http://54.227.246.164/stats/segment?&education=1",
  "http://54.227.246.164/stats/segment?&gender=1",
  "http://54.227.246.164/stats/segment?&education=2",
  "http://54.227.246.164/stats/segment?&gender=2",
  "http://54.227.246.164/stats/segment?&education=3",
  "http://54.227.246.164/stats/segment?&age_ub=34",
  "http://54.227.246.164/stats/segment?&education=4",
  "http://54.227.246.164/stats/segment?&age_lb=35&age_ub=54",
  "http://54.227.246.164/stats/segment?&age_lb=55",
  "http://54.227.246.164/stats/segment?&hdi=1",
  "http://54.227.246.164/stats/segment?&hdi=2",
  "http://54.227.246.164/stats/segment?&hdi=3",
  "http://54.227.246.164/stats/",
  "http://54.227.246.164/stats/tseries/2013-03-22/2013-03-08"]
  #update cache
  result = update_cache(urls)
  if result != 200:
    print('Could not update cache')
    send_alert_gmail()
    
  print('')
  sys.exit(0)
