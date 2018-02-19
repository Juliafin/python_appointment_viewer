# model
from .models import Appointment
# json utils
import json
from .utils import convert_json, get_client_ip
# views and http
from django.http import HttpResponse
from django.views.generic import View
# template
from django.shortcuts import render


def index(request):
  userIP = get_client_ip(request)
  print(userIP)
  return render(request, "appointments/index.html")

    #Delete appointment
def deleteUser(request):
  if (request.method == "POST"):
    
    print(request.POST, "REQUEST DELETE")
    apptToDelete = Appointment.objects.get(pk=request.POST["id"])
    apptToDelete.delete()
    return HttpResponse(json.dumps({"message":"Deletion successful"}))


class Appointments(View):
  
  # Get all appointments 
  def get(self, request):
    if (request.method == "GET"):
      print(request.GET, "REQUEST GET")
      if (request.GET["type"] == "user"):
        appointments = Appointment.objects.filter(user__contains=request.GET["searchTerm"])

      elif (request.GET["type"] == "description"):
        appointments = Appointment.objects.filter(description__contains=request.GET["searchTerm"])

      else:
        appointments = Appointment.objects.all()

      jsonData = convert_json(appointments)
      return HttpResponse(jsonData, content_type="application/json")


  # Post appointment
  def post(self, request):

    if (request.method == "POST"):

      print(request.POST)

      appointment = request.POST

      # Check for missing fields

      missingfields = []
      requiredfields = ["user", "datetime", "description"]

      for field in requiredfields:
        if (not field in appointment):
          missingfields.append(field)
      
      # Respond with missing fields if empty
      
      if (len(missingfields) > 0):
        missing = json.dumps({"missing_fields": missingfields})
        return HttpResponse(missing, status=400, content_type="application/json")

      else:
        
        # Save the appointment

        Appointment.objects.create(user=appointment['user'], description=appointment["description"],datetime=appointment["datetime"])

        # Write the id to the response object to send to the client
        appointmentResponse = {
          "message": "Appointment created!"
        }
        
        jsonResponse = json.dumps(appointmentResponse)
        
        # Return the saved appointment as confirmation
        return HttpResponse(jsonResponse, status=202, content_type='application/json')

