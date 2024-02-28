from django.shortcuts import render
from .models import User

# Create your views here.

def list_users(request):
    users = User.objects.all()
    return render(request, 'user_list.html', {'users': users})