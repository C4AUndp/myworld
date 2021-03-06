#!/usr/bin/python
import ballot_tests
import dateutil.parser
import ipdb
import json
import numpy
import pandas as pd
import re
import sys

from pandas import Series, DataFrame, Index
from datetime import datetime, date, time, timedelta

###############################################
################### GLOBALS ###################
###############################################
DEBUG = False
COLUMNS_TO_ACCEPT = json.load(open('data/csv_columns.json'))['columns']

COLUMN_TO_FIELD_MAPPINGS = json.load(open('data/csv_column_field_mapping.json'))
PRIORITY_MAPPINGS = json.load(open('data/csv_db_value_mapping.json'))['choices']
TEST_METHODS = [getattr(ballot_tests, method_name) for method_name in dir(ballot_tests) 
                  if callable(getattr(ballot_tests, method_name))] 

def warning( field, value = '', note = '', index = '' ):
  obj = {}
  obj['field'] = field
  if value:
    obj['value'] = value
  obj['note'] = note
  obj['row'] = int(index)
  return obj

def translate( field_name, raw_value, row_index ):
  """given db field_name and spreadsheet value
  attempts to translate spreadsheet value into
  a valid DB value.
  if translation failed, a warning is added to
  the response obj and an empty string is returned"""
  
  to_return = {'value': '', 'warnings': []}
  
  #handle NA
  if pd.isnull(raw_value):
    return to_return
  
  #casting
  if field_name in ['age', 'choices', 'country', 'education', 'gender']:
    try:
      to_return['value'] = int(raw_value)
    except:
      to_return['warnings'] += [ warning(field_name,raw_value,'could not convert to int',row_index) ]
      return to_return
  
  #translating
  if field_name == 'choices':
    matched =  [obj for obj in PRIORITY_MAPPINGS if obj['csv'] == to_return['value']]
    if matched:
      to_return['value'] = matched[0]['db']
      return to_return
    else:
      to_return['value'] = ''
      to_return['warnings'] += [ warning(field_name,raw_value,'could not map priority',row_index) ]
  elif field_name == 'age':
    to_return['value'] = 2013-to_return['value']
    return to_return
  elif field_name in ['region','partner','suggested_piority','gender','country','education']:
    #no transform
    if not to_return['value']:
      #not casted
      to_return['value'] = raw_value
    return to_return
  else:
    #no implementation
    to_return['warnings'] += [ warning(field_name,raw_value,'no implementation',row_index) ]
  
  #failed to translate
  return to_return
  
  """
    elif field_name == 'education':
    dict_education = {
    1: 1,
    2: 1,
    3: 2,
    4: 2,
    5: 3,
    6: 4
    }
    if value in dict_education:
      return dict_education[value]
    RESPONSE_OBJ['warnings'] += [ warning(field_name,value,'could not map education',row_index) ]
  """

def parse_file(filename, notes = '', s_method = ''):
  """Parses csv file and return an objec with errors, warnings 
  a document for each row that can be uploaded"""
  return_obj = {'docs': [], 'messages': {}, 'df': DataFrame()}
  
  return_obj['messages']['warnings'] = []
  return_obj['messages']['errors'] = []
  return_obj['messages']['info'] = []
  
  try:
    df = pd.read_table(filename, sep=',')
  except:
    print 'Could not read file: ' + filename
    return_obj['messages']['errors'] += ["""Could the file. Make sure it exists and that it's a .csv."""]
    return return_obj
  
  return_obj['df'] = df
  #check columns
  columns_to_process = [ c for c in df.columns if c in COLUMN_TO_FIELD_MAPPINGS ]
  columns_not_processed = [ c for c in df.columns if not c in COLUMN_TO_FIELD_MAPPINGS ]
  columns_not_accepted = [ c for c in df.columns if not c in COLUMNS_TO_ACCEPT ] 
  
  if columns_not_accepted:
    return_obj['messages']['info'] += ['Columns we accept (case sensitive): ' + ', '.join(COLUMNS_TO_ACCEPT)]
    return_obj['messages']['errors'] += ['Do not recognize column name: ' + c for c in columns_not_accepted]
    return return_obj
  return_obj['messages']['info'] += ['This column does not translate to a db field: ' + c for c in columns_not_processed]
  
  #build docs
  docs = []
  print 'Parsing file...'
  count = 0
  #all columns have been recognized
  for (index, row_series) in df.iterrows():
    if count % 1000 == 0:
      print '%d percent complete' % (int(100 * count / df.shape[0]))
    count += 1
    doc = {}
    for column in columns_to_process:
      field = COLUMN_TO_FIELD_MAPPINGS[column]
      value = row_series[column]
      trans_obj = translate(field, value, index)
      translated_value = trans_obj['value']
      return_obj['messages']['warnings'] += trans_obj['warnings']
      if translated_value:
        if field == 'choices':
          if not 'choices' in doc:
            doc['choices'] = []
          doc['choices'] += [ translated_value ]
        else:
          doc[field] = translated_value
    #if row contains no valid choices, discard it
    if not 'choices' in doc:
      return_obj['messages']['warnings'] += [  warning( 'choices' , '', 'No valid choices', index ) ]
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
    if notes:
      doc['sourceNotes'] = notes
    #check data quality of doc
    failedTests = [ test for test in TEST_METHODS if not test(doc) ]
    failed_test_names = [('Failed: ' + method.__doc__) for method in failedTests ]
    for test_name in failed_test_names:
      return_obj['messages']['warnings'] += [ warning( '' , '', test_name, index ) ]
    #add doc to docs array
    docs += [ doc ]
  
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
  print '\n'.join([ wobj['note'] for wobj in parse_obj['messages']['warnings']])
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
  
  ipdb.set_trace()
  sys.exit(0)
  
  
  