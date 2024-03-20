from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime
from django.utils import timezone
from django.forms import ValidationError
from django.core.validators import validate_email

class User(AbstractUser):
    birth_date = models.DateField()
    language = models.CharField(max_length=50, blank=True, null=True)
    image = models.ImageField(upload_to='users/', null=True, blank=False)

    REQUIRED_FIELDS = ['first_name', 'last_name', 'birth_date']

    def clean(self):
        super().clean()
        if self.email:
            validate_email(self.email)
        if self.email.trim() == '':
            raise ValidationError("El email no puede estar vacio")
        if self.username.trim() == '':
            raise ValidationError("El usuario no puede estar vacio")
        if self.first_name.trim() == '':
            raise ValidationError("El nombre no puede estar vacio")
        if self.last_name.trim() == '':
            raise ValidationError("Los apellidos no pueden estar vacios")
        if self.password.trim() == '':
            raise ValidationError("La contraseña no puede estar vacia")
        if self.language.trim() == '':
            raise ValidationError("El idioma no puede estar vacio")
        if self.birth_date.trim() == '':
            raise ValidationError("La fecha de nacimiento no puede estar vacia")

        if not isinstance(self.birth_date, datetime.date):
            birth_date = datetime.datetime.strptime(self.birth_date, "%Y-%m-%d").date()
        else:
            birth_date = self.birth_date
        if birth_date and birth_date > timezone.now().date():
            raise ValidationError("La fecha de nacimiento debe ser en el pasado.")
        sixteen_years_ago = timezone.now().date() - timezone.timedelta(days=16*365)
        if birth_date and birth_date > sixteen_years_ago:
            raise ValidationError("Debes tener al menos 16 años de edad.")
        eighty_years_ago = timezone.now().date() - timezone.timedelta(days=80*365)
        if birth_date and birth_date < eighty_years_ago:
            raise ValidationError("Debes tener menos de 80 años de edad.")

    def save(self, *args, **kwargs):
        self.clean()
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.username