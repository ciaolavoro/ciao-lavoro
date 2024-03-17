from django.db import models
from user.models import User
from service.models import Service
from django.core.validators import MaxValueValidator, MinValueValidator

class Contract(models.Model):
    worker = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'worker')
    client = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'client')
    accept_worker = models.BooleanField(default = False)
    accept_client = models.BooleanField(default = False)
    description = models.TextField(blank=False, max_length=500)
    initial_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.IntegerField(choices=[
        (1, "Negociacion"),
        (2, "Aceptado"),
        (3, "En proceso"),
        (4, "Finalizado"),
        (5, "Cancelado"),
        (6, "Pagado")    ], default=1)
    service = models.ForeignKey(Service, on_delete = models.CASCADE)

    @property
    def total_cost(self):
        tasks = self.task_set.all()
        total = sum(task.cost for task in tasks)
        return total
    
    def __str__(self):
        return self.description
    

class Task(models.Model):

    class Meta:
        verbose_name = "task"
        verbose_name_plural = "tasks"

    title = models.CharField(blank=False, max_length=200)
    amount = models.PositiveIntegerField(null=False)
    cost = models.DecimalField(null=False, max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)],
                    help_text=('Introduzca el coste en euros'))
    complete = models.BooleanField(default = False)
    contract = models.ForeignKey(Contract, default=None, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.title