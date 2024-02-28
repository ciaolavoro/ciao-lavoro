from django import forms
from django.contrib import admin
from django.core.validators import MaxValueValidator, MinValueValidator
from .models import Service, Job
import json

# Register your models here.

admin.site.register(Service)
admin.site.register(Job)