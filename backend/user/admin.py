from django.contrib import admin
from django.contrib.auth.hashers import make_password
from .models import User

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'first_name', 'email', 'is_staff')
    search_fields = ('username', 'first_name', 'email')
    readonly_fields = ('date_joined', 'last_login')

    def save_model(self, request, obj, form, change):
        if obj.password and not obj.password.startswith('pbkdf2_sha256$'):
            obj.password = make_password(obj.password)
        super().save_model(request, obj, form, change)