from django.forms import ValidationError
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractBaseUser

  

# Create your models here.

class Account(AbstractBaseUser):
    last_login = None
    name = models.CharField(max_length=30)
    lastname = models.CharField(max_length=100)
    email = models.EmailField(("email address"), unique=True)
    desc = models.TextField(blank=True, null=True)
    birth_date = models.DateField()
    date_joined = models.DateTimeField(default=timezone.now)

    lenguage = models.CharField(max_length=50, blank=True, null=True)

    is_worker = models.BooleanField(default=False)
    profession = models.CharField(max_length=100, blank=True, null=True)
    years_experience = models.PositiveIntegerField(blank=True, null=True)
    task = models.CharField(max_length=200, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'lastname', 'birth_date']

    def clean(self):
        super().clean()
        if not self.is_worker:
            self.profession = None
            self.years_experience = None
            self.task = None

        if self.is_worker:
            if not self.profession:
                raise ValidationError("Profession is required for workers.")
            if not self.years_experience:
                raise ValidationError("Years of experience is required for workers.")
            if not self.lenguage:
                raise ValidationError("Lenguage of experience is required for workers.")
            if not self.task:
                raise ValidationError("Task is required for workers.")
        
    def get_username(self):
        return self.email

    def __str__(self):
        return self.email