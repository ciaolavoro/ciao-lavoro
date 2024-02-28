from django.contrib import admin
from .models import Service

# Register your models here.

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('profession', 'city', 'experience')
    search_fields = ('profession', 'city', 'experience', 'is_active', 'is_promoted')