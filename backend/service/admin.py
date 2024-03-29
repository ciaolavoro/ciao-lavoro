from django.contrib import admin
from .models import Service, Job, Review

# Register your models here.

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['user','profession','city','is_active','is_promoted']
    search_fields = ['user','profession','city','is_active','is_promoted']

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['service', 'name','estimated_price']
    search_fields = ['service', 'name','estimated_price']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['service', 'user','date']
    search_fields = ['service', 'user','date']