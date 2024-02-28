from django.db import models

from user.models import User

class Contrato(models.Model):
    worker = models.OneToOneField(User, on_delete = models.CASCADE, related_name = 'worker')
    client = models.OneToOneField(User, on_delete = models.CASCADE, related_name = 'client')
    acceptWorker = models.OneToOneField(User,on_delete = models.CASCADE, related_name = 'acceptWorker')
    acceptClient = models.BooleanField(default = False)
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
        ("Pa", "Pagado")
    ], default='Ne')