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
    fin_date = models.DateField()
    cost = models.IntegerField()
    state = models.CharField(max_length=2, choices=[
        ("Ne", "Negociacion"),
        ("Ac", "Aceptado"),
        ("En", "En proceso"),
        ("Fi", "Finalizado"),
        ("Ca", "Cancelado"),
        ("Pa", "Pagado")    ], default='Ne')
    service = models.ForeignKey(Service, on_delete = models.CASCADE)
    def __str__(self):
        return self.description