from django.conf.urls import url
from . import views

urlpatterns = [
  # /appts
  url(r'^$', views.index, name='index')
]
