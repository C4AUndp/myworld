import ipdb
import json
import urllib2
#A test return True or False
#True => The ballot/doc passed the test
#False => The ballot/doc failed the test

config_dir = '/home/ubuntu/myworld_config/'
#load the valid values
dict_valid_values = json.load(open(config_dir + 'valid_values.json'))

API_URL = 'http://ec2-23-22-13-62.compute-1.amazonaws.com/stats/'

VALUES = {}

VALUES['age'] = [ obj['valid_values'] for obj in dict_valid_values['valid_field_values'] 
                    if obj['field_name'] == 'age' ][0]

VALUES['country'] = [ obj['valid_values'] for obj in dict_valid_values['valid_field_values'] 
                    if obj['field_name'] == 'country' ][0]

VALUES['education'] = [ obj['valid_values'] for obj in dict_valid_values['valid_field_values'] 
                    if obj['field_name'] == 'education' ][0]
                    
VALUES['gender'] = [ obj['valid_values'] for obj in dict_valid_values['valid_field_values'] 
                    if obj['field_name'] == 'gender' ][0]

#updated dynamically so query the api for this one
partner_response = urllib2.urlopen(urllib2.Request(API_URL + 'partners'))
partner_json = json.loads(partner_response.read())
VALUES['partner'] = [partner_obj['volunteer_id'].lower() for partner_obj in partner_json['partners']]
                    
VALUES['sourceMethod'] = [ obj['valid_values'] for obj in dict_valid_values['valid_field_values'] 
                    if obj['field_name'] == 'sourceMethod' ][0]

def test_age_valid(doc):
  """test age field is valid"""
  field_name = 'age'
  if field_name in doc:
    return doc[field_name] in VALUES[field_name]
  return True

def test_country_valid(doc):
  """test country field is valid"""
  field_name = 'country'
  if field_name in doc:
    return doc[field_name] in VALUES[field_name]
  return True

def test_education_valid(doc):
  """test education field is valid"""
  field_name = 'education'
  if field_name in doc:
    return doc[field_name] in VALUES[field_name]
  return True
  
def test_gender_valid(doc):
  """test gender field is valid"""
  field_name = 'gender'
  if field_name in doc:
    return doc[field_name] in VALUES[field_name]
  return True

def test_partner_valid(doc):
  """test partner field is valid"""
  field_name = 'partner'
  if field_name in doc and not doc[field_name] == '':
    return doc[field_name].lower() in VALUES[field_name]
  return True
  
def test_source_valid(doc):
  """test sourceMethod field is valid"""
  field_name = 'sourceMethod'
  if field_name in doc:
    return doc[field_name] in VALUES[field_name]
  return True

def test_choices_exists(doc):
  """test choices field exists"""
  return 'choices' in doc

def test_country_exists(doc):
  """test country field exists"""
  return 'country' in doc

def test_one_valid_choice(doc):
  """test ballot has one valid choice"""
  if 'choices' in doc:
    choice_set = set(doc['choices'])
    valid_choices = set(range(17))
    if valid_choices.isdisjoint(choice_set):
      return False
  return True

def test_valid_choices(doc):
  """test validity of priority ids"""
  if 'choices' in doc:
    choice_set = set(doc['choices'])
    valid_choices = set(range(17))
    return choice_set.issubset( valid_choices )
  return True
  
def test_n_choices(doc):
  """test number of choices"""
  if 'choices' in doc:
    choice_set = set(doc['choices'])
    if 0 in choice_set:
      return len(choice_set) == 7
    return len(choice_set) == 6
  return True
  
if __name__ == "__main__":                
  print """This is a module containng the different tests \
a ballot must pass to be considered valid."""