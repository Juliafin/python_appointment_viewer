import json
from django.core.serializers.json import DjangoJSONEncoder

def convert_json(rawData):

  appointmentsArr = []
  
  for appts in rawData:
    apptsObj = {
      "description": appts.description,
      "user": appts.user,
      "datetime": appts.datetime
    }
    appointmentsArr.append(apptsObj)
    
  jsonData = json.dumps(appointmentsArr, cls=DjangoJSONEncoder)
  return jsonData
