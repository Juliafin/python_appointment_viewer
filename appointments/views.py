# model
from .models import Appointment
# json utils
import json
from .convert_json import convert_json
# views and http
from django.http import HttpResponse
from django.views.generic import View
# template
from django.template import loader


def index(request):
  return HttpResponse("<h1>This is the music app homepage</h1>")



def appointmentUser(request, user):
  if (request.method == "GET"):
    # Get users matching the url from the database
    userAppointments = Appointment.objects.filter(user=str(user))
    
    jsonData = convert_json(userAppointments)

    return HttpResponse(jsonData, content_type='application/json')



class Appointments(View):
  
  # Get all appointments 
  def get(self, request):
    if (request.method == "GET"):
      appointments = Appointment.objects.all()
      jsonData = convert_json(appointments)
      
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

        # Save the appointment

        apptToSave = Appointment.objects.create(user=appointment['user'], description=appointment['description'],datetime=appointment['datetime'])
        print(apptToSave.id)
        appointment['id'] = apptToSave.id
        jsonResponse = json.dumps(appointment)
        
        return HttpResponse(jsonResponse, status=202, content_type='application/json')