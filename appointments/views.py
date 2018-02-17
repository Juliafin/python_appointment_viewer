from django.http import HttpResponse
from .models import Appointment
from .convert_json import convert_json
from django.views.generic import View
import json



def index(request):
  return HttpResponse("<h1>This is the music app homepage</h1>")

class Appointments(View):
  
  # Get all appointments 
  def get(self, request):
    print('this is the request', request)
    appointments = Appointment.objects.all()
    jsonData = convert_json(appointments)
    
    print(jsonData)
    return HttpResponse(jsonData, content_type='application/json')



  # Post appointment
  def post(self, request):

    if (request.method == "POST"):

      # Parse json
      
      appointment = json.loads(request.body)
          
      # Check for missing fields

      missingfields = []
      requiredfields = ['user', 'datetime', 'description']

      for field in requiredfields:
        if (not field in appointment):
          missingfields.append(field)
      
      # Respond with missing fields if empty
      
      if (len(missingfields) > 0):
        missing = json.dumps({'missing_fields': missingfields})
        return HttpResponse(missing, status=400, content_type='application/json')

      else:

        print(appointment, 'request.body')
        testresponse = json.dumps({'bye': 'test'})
        
        return HttpResponse(testresponse, status=202, content_type='application/json')