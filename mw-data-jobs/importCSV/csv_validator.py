#!/usr/bin/python
import dateutil.parser
import ipdb
import json
import numpy
import pandas as pd
import re
import sys
import csv

from pandas import Series, DataFrame, Index
from datetime import datetime, date, time, timedelta

###############################################
################### GLOBALS ###################
###############################################

RUN_MODE = 'server'

if RUN_MODE == 'server':
  sys.path += ['/home/ubuntu/myworld_modules']
  config_dir = '/home/ubuntu/myworld_config/'
if RUN_MODE == 'local':
  sys.path += ['/Users/niko/Documents/Stahl/Repos/myworld-analytics/production_data/myworld_modules']
  config_dir = '/Users/niko/Documents/Stahl/Repos/myworld-analytics/production_data/myworld_config/'

import ballot_tests

DEBUG = False
COLUMNS_TO_ACCEPT = json.load(open(config_dir + 'csv_columns.json'))['columns']
COLUMN_TO_FIELD_MAPPINGS = json.load(open(config_dir + 'csv_column_field_mapping.json'))
VALUE_MAPPINGS = json.load(open(config_dir + 'csv_db_value_mapping.json'))
PRIORITY_MAPPINGS = VALUE_MAPPINGS['choices']
TEST_METHODS = [getattr(ballot_tests, method_name) for method_name in dir(ballot_tests) 
                  if callable(getattr(ballot_tests, method_name))] 

def warning( field, value, note, index, columns):
  obj = {}
  obj['columns'] = columns
  obj['field'] = field
  if value:
    obj['value'] = value
  obj['note'] = note
  obj['row'] = int(index)
  obj['acceptable'] = 1
  if note == 'No valid choices':
    obj['acceptable'] = 0
  return obj

def translate( field_name, raw_value, row_index, column):
  """given db field_name and spreadsheet value
  attempts to translate spreadsheet value into
  a valid DB value.
  if translation failed, a warning is added to
  the response obj and an empty string is returned"""
  
  na_warning_columns = ['partnerID', 'country', 'voter_gender', \
  'voter_year_of_birth', 'education_level',\
  'priority1', 'priority2', 'priority3', \
  'priority4', 'priority5', 'priority6']

  # integer fields
  int_fields = ['age', 'choices', 'country', 'education', 'gender']

  to_return = {'value': '', 'warnings': []}

  # utf decoding
  if field_name not in int_fields:
    try:
      raw_value = unicode(raw_value).decode("utf8")
    except UnicodeDecodeError:
      raw_value = None

  # empty values  
  if pd.isnull(raw_value):
    if column in na_warning_columns:  
      to_return['warnings'] += [ warning(field_name,'','Warning: blank field', \
                               row_index, [column]) ]
    return to_return
  
  #casting
  if field_name in int_fields:
    try:
      to_return['value'] = int(raw_value)
    except:
      to_return['warnings'] += [ warning(field_name,raw_value,'Warning: could not convert value to number', \
                                 row_index, [column]) ]
      return to_return
  
  #translating
  if field_name == 'choices':
    matched =  [obj for obj in PRIORITY_MAPPINGS if obj['csv'] == to_return['value']]
    if matched:
      to_return['value'] = matched[0]['db']
      return to_return
    else:
      to_return['value'] = ''
      to_return['warnings'] += [ warning(field_name,raw_value,'Warning: could not map priority', \
                                row_index, [column]) ]
  elif field_name == 'age':
    to_return['value'] = 2013-to_return['value']
    return to_return
  elif field_name in ['partner','suggested_priority', 'region']:
    #return the string
    to_return['value'] = raw_value
    return to_return
  elif field_name in ['country','education','gender']:
    #return int
    return to_return
  else:
    #no implementation
    to_return['warnings'] += [ warning(field_name,raw_value,'no implementation',row_index,\
                                    [column])]
  
  return to_return

def parse_file(filename, notes = '', s_method = ''):
  """Parses csv file and returns a response obj with the following attributes:
  docs      -> list of acceptable rows (i.e.: has at least one valid choice) as a dict that can be stored in the DB
  messages  -> message object with the following attributes:
                -> warnings: each warning message is an object with the required fields:
                -> acceptable: 1 => row accepted. 0 => row rejected.
                -> field: the field that caused the warning
                -> columns: original csv column name(s) causing the error
                -> note: the reason for the warning
                -> index: the row in which the warning occured (zero-based numbering)
                -> value: the value that caused the warning ('' == NA)
            -> errors: A list of error messages. These are caused by structural problems.
            -> info: Informational messages intended for the developer
            -> stats: Data for row acceptance rate
  NOTE: Row indices start at 0. When viewed in an editor the header is line 1. To map row indices
  to lines use row_index+2
  """
  return_obj = {'docs': [], 'messages': {}, 'df': DataFrame()}
  
  return_obj['messages']['warnings'] = []
  return_obj['messages']['errors'] = []
  return_obj['messages']['info'] = []
  return_obj['messages']['stats'] = []
  
  try:
    df = pd.read_table(filename, sep=',')
  except:
    print 'Could not read file: ' + filename
    return_obj['messages']['errors'] += ["""Could not read the file. Make sure it exists and that it's a .csv."""]
    return return_obj
  
  return_obj['messages']['stats'] += [ {'stat': 'Rows considered', 'value': int(df.shape[0]) }  ]
  return_obj['df'] = df
  #check columns
  columns_to_process = [ c for c in df.columns if c in COLUMN_TO_FIELD_MAPPINGS ]
  columns_not_processed = [ c for c in df.columns if not c in COLUMN_TO_FIELD_MAPPINGS ]
  columns_not_accepted = [ c for c in df.columns if not c in COLUMNS_TO_ACCEPT ] 
  
  if columns_not_accepted:
    return_obj['messages']['info'] += ['Columns we accept (case sensitive): ' + ', '.join(COLUMNS_TO_ACCEPT)]
    return_obj['messages']['errors'] += ['Do not recognize column name: ' + c for c in columns_not_accepted]
    return return_obj
    
  #all columns have been recognized. proceed to parse each row.
  return_obj['messages']['info'] += ['This column does not translate to a db field: ' + c for c in columns_not_processed]
  docs = []
  print 'Parsing file...'
  for (index, row_series) in df.iterrows():
    if DEBUG:
      print row_series
    if index % 1000 == 0:
      print '%d percent complete' % (int(100 * index / df.shape[0]))
    doc = {}
    doc['choices'] = []
    for column in columns_to_process:
      field = COLUMN_TO_FIELD_MAPPINGS[column]
      value = row_series[column]
      if isinstance(value, basestring):
        value = value.replace("\n", "")

      # try to convert if found in mappings
      if field != "choices" and field in VALUE_MAPPINGS:
        valtest = str(value).lower()
        if valtest in VALUE_MAPPINGS[field]:
          value = VALUE_MAPPINGS[field][valtest]

      trans_obj = translate(field, value, index, column)
      translated_value = trans_obj['value']
      return_obj['messages']['warnings'] += trans_obj['warnings']
      if not translated_value == '':
        if field == 'choices':
          doc['choices'] += [ translated_value ]
        else:
          doc[field] = translated_value
    if not doc['choices']:
      return_obj['messages']['warnings'] += [  \
                warning( 'choices' , '', 'No valid choices. This row will be ignored', index, \
                        [ 'priority' + str(i) for i in range(1,7) ] ) ]
      continue
    #otherwise, ensure unique choices
    unique_choices = []
    for choice in doc['choices']:
      if not choice in unique_choices:
        unique_choices += [ choice ]
    doc['choices'] = unique_choices
    #add raw string
    raw_pairs = []
    for i in row_series.index:
      raw_pairs += [': '.join([i, str(row_series[i])])]
    doc['csv_row'] = ' | '.join(raw_pairs)
    #add timestamp and csv upload constants
    doc['timestamp'] = datetime.now()
    doc['sourceMethod'] = s_method
    doc['sourceDetail'] = 'csvimport'
    doc['csv_row_index'] = int(index)
    if notes:
      doc['sourceNotes'] = notes
    #check data quality of doc
    failedTests = [ test for test in TEST_METHODS if not test(doc) ]
    failed_test_names = [('Warning: ' + method.__doc__) for method in failedTests ]
    re_test_to_flag = re.compile(r'Warning: (\w+) field is invalid')
    if DEBUG:
      print '\n'.join(failed_test_names)
      print doc
    
    for test_name in failed_test_names:
      matched = re_test_to_flag.search(test_name)
      if matched:
        original_column = [ c for (c, f) in COLUMN_TO_FIELD_MAPPINGS.items() if f == matched.group(1)]
        if original_column:
          return_obj['messages']['warnings'] += [ warning( matched.group(1) , '', test_name, index, original_column) ]
      elif test_name in ['test choices field exists', 'test ballot has one valid choice', 'Failed: test number of choices']:
        return_obj['messages']['warnings'] += [ warning( 'choices' , '', test_name, index, \
                                                    [ 'priority' + str(i) for i in range(1,7) ] ) ]
    #add doc to docs array
    docs += [ doc ]
  return_obj['messages']['stats'] += [ {'stat': 'Rows accepted', 'value': len(docs) }  ]
  return_obj['docs'] = docs
  if DEBUG:
    return return_obj
  del return_obj['df']
  return return_obj

if __name__ == "__main__":
  DEBUG = True
  if len(sys.argv) != 4:
    print 'Usage: python csv_validator.py myfile.csv upload_keyword offline_vs_sms'
    sys.exit(0)
  
  print 'Checking file:', sys.argv[1]
  parse_obj = parse_file(sys.argv[1], sys.argv[2], sys.argv[3])
  
  print 'ERRORS'
  print '\n'.join(parse_obj['messages']['errors'])
  print 'WARNINGS'
  print '\n'.join(sorted([ wobj['note'] for wobj in parse_obj['messages']['warnings']]))
  print 'INFO'
  print '\n'.join(parse_obj['messages']['info'])
  
  rows_with_warnings = []
  for w_obj in parse_obj['messages']['warnings']:
    if not w_obj['row'] in rows_with_warnings:
      rows_with_warnings += [ w_obj['row'] ]
  
  warnings_table = {}
  for w_obj in parse_obj['messages']['warnings']:
    if not w_obj['note'] in warnings_table:
      warnings_table[w_obj['note']] = 0
    warnings_table[w_obj['note']] += 1
  
  print '\n'.join([json.dumps(obj) for obj in parse_obj['messages']['warnings']])
  
  ipdb.set_trace()
  sys.exit(0)
  
  
  
