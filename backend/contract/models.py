from django.db import models
from user.models import User
from service.models import Service

class Contract(models.Model):
    worker = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'worker')
    client = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'client')
    accept_worker = models.BooleanField(default = False)
    accept_client = models.BooleanField(default = False)
    description = models.TextField(blank=False, max_length=500)
    initial_date = models.DateField()
    end_date = models.DateField()
    cost = models.IntegerField()
    status = models.IntegerField(choices=[
        (1, "Negociacion"),
        (2, "Aceptado"),
        (3, "En proceso"),
        (4, "Finalizado"),
        (5, "Cancelado"),
        (6, "Pagado")    ], default=1)
    service = models.ForeignKey(Service, on_delete = models.CASCADE)
    def __str__(self):
        return self.description