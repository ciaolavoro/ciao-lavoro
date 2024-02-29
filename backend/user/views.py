from django.shortcuts import render
from .models import User
from django.contrib.auth import login
from django.http import JsonResponse
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# Create your views here.

def list_users(request):
    users = User.objects.all()
    return render(request, 'user_list.html', {'users': users})

class login_view(APIView):

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request, format=None):

        email = request.data.get('email')
        password = request.data.get('password')
        user = User.objects.filter(email=email, password=password).first()
        if user is not None:
            login(request,user)
            return JsonResponse({'status': 'success', 'message': 'User logged in successfully'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid login credentials'})