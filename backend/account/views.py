from django.shortcuts import render
from .models import Account

# Create your views here.

def list_users(request):
    users = Account.objects.all()
    return render(request, 'user_list.html', {'users': users})