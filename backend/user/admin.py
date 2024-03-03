from django.contrib import admin
from .models import User

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'first_name', 'email', 'is_staff')
    search_fields = ('username', 'first_name', 'email')
    readonly_fields = ('date_joined', 'last_login')
