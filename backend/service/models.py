from django.forms import ValidationError
from django.utils import timezone
from django.db import models
import json
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MaxValueValidator, MinValueValidator

# Este campo es un campo custom que lleva los works de un user
# para rellenarlo sería como lo vemos abajo
# Ej: Service = Service.objects.create(...., works=[['a', 1], []'b', 2]])

class StringIntegerField(models.Model):
    """
    Custom field to store tuples of (String, Integer)
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        return json.loads(value)

    def to_python(self, value):
        if isinstance(value, list):
            return value
        if value is None:
            return value
        return json.loads(value)

    def get_prep_value(self, value):
        if value is None:
            return value
        return json.dumps(value)

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
    
class Job(models.Model):

    class Meta:
        verbose_name = "Job"
        verbose_name_plural = "Jobs"

    name = models.CharField(max_length=100, blank = False)
    estimated_price = models.PositiveIntegerField(blank = False)

    def __str__(self) -> str:
        return self.name


class Service(models.Model):

    class Meta:
        verbose_name = "service"
        verbose_name_plural = "services"

    
    PROFESSIONS = [
        (1, 'Lavandero'),
        (2, 'Celador'),
        (3, 'Albañil'),
        
    ]
    profession = EnumField(choices = PROFESSIONS)
    city = models.TextField()
    jobs = models.ManyToManyField(Job)
    experience = models.PositiveIntegerField(validators=[MinValueValidator(0), MaxValueValidator(80)])
    is_active = models.BooleanField(default=True)
    is_promoted = models.BooleanField(default= False)

    def __str__(self):
        return self.get_profession_display()