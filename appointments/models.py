from django.db import models

class Appointment(models.Model):
  datetime = models.DateTimeField(blank=True, null=True)
  description = models.CharField(max_length=300)
  user = models.CharField(max_length=75)

  def __str__(self):
    return self.user + ' - ' + self.description

  