from django.conf.urls import url
from .views import index, Appointments

urlpatterns = [
  # /appts
  url(r'^$', index, name='index'),

  url(r'^appointments$', Appointments.as_view(), name='appointments')
]
