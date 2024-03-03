from django.db import models
from user.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

# Este campo es un campo custom para llevar el enumerado de profession
# Abajo en el modelo se rellena y se le da una relación a cada integer con una profesión

class EnumField(models.IntegerField):

    def __init__(self, choices, *args, **kwargs):
        self.enum_choices = choices
        kwargs['choices'] = choices
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        kwargs['choices'] = self.enum_choices
        return name, path, args, kwargs

# Create your models here.

class Service(models.Model):

    class Meta:
        verbose_name = "service"
        verbose_name_plural = "services"

    # Aquí se guarda la clave del usuario del servicio
    # se ha puesto nullable para evitar problemas con Django
    user = models.ForeignKey(User,default=None, null=True, on_delete=models.CASCADE)
    #Aquí se enumeran las profesiones posibles
    PROFESSIONS = [
        (1, 'Lavandero'),
        (2, 'Celador'),
        (3, 'Albañil'),
    ]
    profession = models.IntegerField(choices = PROFESSIONS, blank = False)
    city = models.TextField(blank = False)
    experience = models.PositiveIntegerField(blank = False,validators=[MinValueValidator(0), MaxValueValidator(80)])
    #Aquí se estipulan si está ofertando trabajo con este servicio
    is_active = models.BooleanField(blank = False,default=True)
    #Aquí se estipula si está promocionado este servicio
    is_promoted = models.BooleanField(blank = False,default= False)

    def __str__(self):
        return self.get_profession_display()

class Job(models.Model):

    class Meta:
        verbose_name = "Job"
        verbose_name_plural = "Jobs"
    #Aqui se registra el servicio al que pertenece,
    # se ha puesto nullable para evitar problemas con Django
    service = models.ForeignKey(Service, default=None, null=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank = False)
    estimated_price = models.PositiveIntegerField(blank = False)

    def __str__(self) -> str:
        return self.name