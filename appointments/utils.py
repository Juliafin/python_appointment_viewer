import json
from django.core.serializers.json import DjangoJSONEncoder

def convert_json(rawData):

  appointmentsArr = []
  
  for appts in rawData:
    apptsObj = {
      "description": appts.description,
      "user": appts.user,
      "datetime": appts.datetime,
      "id": appts.id
    }
    appointmentsArr.append(apptsObj)
    
  jsonData = json.dumps(appointmentsArr, cls=DjangoJSONEncoder)
  return jsonData


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip