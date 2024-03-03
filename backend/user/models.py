from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.forms import ValidationError

class User(AbstractUser):
    birth_date = models.DateField()
    language = models.CharField(max_length=50, blank=True, null=True)

    REQUIRED_FIELDS = ['first_name', 'last_name', 'birth_date']

    def clean(self):
        super().clean()
        if self.birth_date and self.birth_date > timezone.now().date():
            raise ValidationError("La fecha de nacimiento debe ser en el pasado.")
        sixteen_years_ago = timezone.now().date() - timezone.timedelta(days=16*365)
        if self.birth_date and self.birth_date > sixteen_years_ago:
            raise ValidationError("Debes tener al menos 16 años de edad.")
        eighty_years_ago = timezone.now().date() - timezone.timedelta(days=80*365)
        if self.birth_date and self.birth_date < eighty_years_ago:
            raise ValidationError("Debes tener menos de 80 años de edad.")

    def save(self, *args, **kwargs):
        # Si la contraseña ha sido modificada, hashearla antes de guardar
        if self.password:
            self.set_password(self.password)
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.username
