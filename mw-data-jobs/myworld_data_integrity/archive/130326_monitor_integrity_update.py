#!/usr/bin/python

import ipdb
import ballot_tests
import sys

from bson.son import SON
from bson.code import Code
from datetime import datetime, date, time, timedelta
from pandas import Series, DataFrame, Index
from pymongo import MongoClient, Connection

def runTests(doc):
  """Run quality tests as defined in ballot_tests.py on doc"""
  data_quality_id = 1
  failedTests = [ test for test in testMethods if not test(doc) ]
  failed_test_names = [('Failed: ' + method.__doc__) for method in failedTests ]
  if failedTests:
    data_quality_id = -2
    if 'Failed: test choices field exists' in failed_test_names or \
       'Failed: test ballot has one valid choice' in failed_test_names:
      data_quality_id = -4
    elif len(failed_test_names)==1 and 'Failed: test partner field is valid' in failed_test_names:
      data_quality_id = -1
  
  collection.update({'_id': doc['_id']}, 
  {'$set': {'data_quality_notes': failed_test_names}})
  collection.update({'_id': doc['_id']}, 
  {'$set': {'data_quality': data_quality_id}})

if __name__ == "__main__":
  DEBUG = True
  if DEBUG:
    ballot_tests = reload(ballot_tests)
  
  testMethods = [getattr(ballot_tests, method_name) for method_name in dir(ballot_tests) 
                  if callable(getattr(ballot_tests, method_name))] 
  
  """
  print 'Tests to run: '
  for method in testMethods:
    print method.__doc__
  print 
  """
  
  ### CONNECT TO DB ###
  db_url = 'mongodb://analytics:plantyours1234@ds049937.mongolab.com:49937/myworld_master2'
  connection = connection = Connection(db_url, 49937)
  db = connection.myworld_master2
  collection_name = 'votes'
  collection = db[collection_name]
  print 'Monitoring collection: ' + collection_name
  
  #initialize df for duplicate detection
  dict_df = {}
  columns = ['_id', 'age','country','gender','choices','voterIP',
             'timestamp', 'sourceMethod', 'suggested_priority' ]
  columns_to_check = ['age','country','gender','choices','voterIP','sourceMethod',
                      'suggested_priority']
  for c in columns:
    dict_df[c] = []
  
  #table scan to check ballots and to build dict_df
  cursor = collection.find({'data_quality': {'$exists': False}}, snapshot = True)
  progress_bar = 0
  progress_extent = cursor.count()
  for doc in cursor:
    
    if progress_bar % 20 == 0:
      print '%d percent complete' % round(100*progress_bar/float(progress_extent))
    progress_bar += 1
    runTests(doc)
    #build df for duplication tests
    for c in columns:
      if c in doc:
        if doc[c] is None:
          doc[c] = 'NA'
        elif c == 'choices':
          doc[c] = '-'.join( [str(int(choice)) for choice in sorted(doc[c])])
        elif c == 'timestamp':
          doc[c] = round(float(doc[c].strftime('%s.%f')))
        elif c == 'suggested_priority':
          doc[c] = doc[c].encode('ascii', 'ignore')[:100]
        dict_df[c] += [ doc[c] ]
      else:
        dict_df[c] += [ 'NA' ]
  print 'Scan complete'
  
  dict_df['is_duplicated'] = [0]*len(dict_df[dict_df.keys()[0]])
  dict_df['is_duplicate'] = [0]*len(dict_df[dict_df.keys()[0]])
  
  df = DataFrame(dict_df)
  df_website = df[df['sourceMethod'] == 'website']
  df_website.sort(columns='timestamp', ascending=True, inplace = True)
  df_website = df_website.reset_index(drop = True)
  
  s_diffs = df_website['timestamp'].diff()
  t_thresh = 15
  duplicate_index = 0
  
  for diff in s_diffs:
    if diff < t_thresh:
      df_check = df_website.ix[duplicate_index-1:duplicate_index]
      if sum(df_check.duplicated(cols = columns_to_check)) > 0:
        #mark the ballot in the second row as duplicated
        df_website.set_value( duplicate_index-1, 'is_duplicated', 1)
        df_website.set_value( duplicate_index, 'is_duplicate', 1)
        collection.update({'_id': df_website.ix[duplicate_index]['_id']}, 
                          {'$set': {'data_quality': -3, 
                                    'data_quality_notes': 'Duplication of: ' + 
                                     str(df_website.ix[duplicate_index-1]['_id']) }})
    duplicate_index += 1
  
  """
  #CSV EXPORT
  
  df_out = df_website[(df_website['is_duplicated'] == 1) | 
                      (df_website['is_duplicate'] == 1) ]
                      
  df_out.to_csv('duplicates.csv', index = False)
  """
  
  sys.exit(0)
  
  
