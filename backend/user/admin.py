from django.contrib import admin
from .models import User

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name')
    search_fields = ('email', 'name', 'lastname')
    readonly_fields = ('date_joined',)
