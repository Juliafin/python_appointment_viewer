from django.conf.urls import url
from .views import index, Appointments, deleteUser

urlpatterns = [
  # /
  url(r'^$', index, name='index'),

  # /appointments
  url(r'^appointments/?$', Appointments.as_view(), name='appointments'),

  # /appointments/user
  # url(r'^appointments/(?P<user>[a-zA-Z]+)/$', appointmentUser, name="appointmentName" )

  # /appointments/delete
  url(r'^appointments/delete', deleteUser, name="deleteUser" )
]
