from django.forms import ValidationError
from django.utils import timezone
from django.db import models
from django.contrib.postgres.fields import ArrayField

# Este campo es un campo custom que lleva los works de un user
# para rellenarlo sería como lo vemos abajo
# Ej: Service = Service.objects.create(...., works=[('a', 1), ('b', 2)])

class StringIntegerField(models.Model):
    """
    Custom field to store tuples of (String, Integer)
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def db_type(self, connection):
        return 'text[]'

    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        return [tuple(item.split(':')) for item in value]

    def to_python(self, value):
        if isinstance(value, list):
            return value
        if value is None:
            return value
        return [tuple(item.split(':')) for item in value]

    def get_prep_value(self, value):
        if value is None:
            return value
        return [f"{key}:{val}" for key, val in value]

# Este campo es un campo custom para llevar el enumerado de profession
# Abajo en el modelo se rellena y se le da una relación a cada integer con una profesión
# Ej:
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
    PROFESSIONS = [
        (1, 'Lavandero'),
        (2, 'Celador'),
        (3, 'Albañil'),
        
    ]
    profession = EnumField(choices = PROFESSIONS)
    city = models.TextField()
    works = StringIntegerField(default=[])
    isActive = models.BooleanField(default=True)
    isPromoted = models.BooleanField(default=False)
    name = models.CharField(max_length=40)
    experience = models.IntegerField(min_value=0)
    is_active = models.BooleanField(default=True)
    is_promoted = models.BooleanField(default= False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'lastname', 'birth_date']

    def get_username(self):
        return self.email

    def clean(self):
        super().clean()
        if self.birth_date and self.birth_date > timezone.now().date():
            raise ValidationError("La fecha de nacimiento debe ser en el pasado.")
        sixteen_years_ago = timezone.now().date() - timezone.timedelta(days=16*365)
        if self.birth_date and self.birth_date < sixteen_years_ago:
            raise ValidationError("Debes tener al menos 16 años de edad.")
        eighty_years_ago = timezone.now().date() - timezone.timedelta(days=80*365)
        if self.birth_date and self.birth_date < sixteen_years_ago:
            raise ValidationError("Debes tener menos de 80 años de edad.")

    def __str__(self):
        return self.email
