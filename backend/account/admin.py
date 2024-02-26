from django.contrib import admin
from .models import Account

# Register your models here.

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'lastname', 'is_worker', 'profession', 'years_experience')
    search_fields = ('email', 'name', 'lastname')
    readonly_fields = ('date_joined',)
