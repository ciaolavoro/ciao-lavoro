from django.contrib import admin
from .models import Contract

# Register your models here.
@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ['client','worker','cost','service','status','initial_date','end_date']
    search_fields = ['client','worker','cost','initial_date','end_date','status']
