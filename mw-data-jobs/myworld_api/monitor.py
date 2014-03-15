#!/usr/bin/python3
# Import the email modules we'll need
from email.mime.text import MIMEText
# Import smtplib for the actual sending function
import smtplib
import datetime
import sys
from urllib.request import urlopen

""""
  Function to test the connection is alive and well
"""
def test_connection():  
  #ping
  try:
    result = urlopen(url='http://54.227.246.164/stats/ping', timeout=30)
    result = result.code
  except:
    result = -1
  print(result)
  return result
  
""""
  Function to send alert email
  based off http://segfault.in/2010/12/sending-gmail-from-python/
"""
def send_alert_gmail():
  SMTP_SERVER = 'smtp.gmail.com'
  SMTP_PORT = 587
   
  sender = 'myworldmonitor@gmail.com'
  recipients = ['gayan.peiris@undp.org','jeff.huber@sysflow.com','ali.kone@coders4africa.org','amadou.daffe@coders4africa.org','yazid.wabi@gmail.com']
  subject = 'MyWorld API not responding'
  body = """
  This message is coming from the MyWorld Amazon server. The API is not responding. Please contact Jeff or Gayan +1 646 479 8843
  """
  
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
  #run test
  result = test_connection()
  if result != 200:
    print('Failed test')
    send_alert_gmail()  
  print('')
  sys.exit(0)
