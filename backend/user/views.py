from django.shortcuts import render
from .models import User
from django.contrib.auth import login
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import logout as auth_logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

def list_users(request):
    users = User.objects.all()
    return render(request, 'user_list.html', {'users': users})

class login_view(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request, format_arg=None):
        username = request.data.get('username')
        password = request.data.get('password')
        user = User.objects.filter(username=username, password=password).first()
        if user is not None:
            login(request,user)
            return JsonResponse({'status': 'success', 'message': 'User logged in successfully'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid login credentials'})
 
class logout_view(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        auth_logout(request)
        return JsonResponse({'message': 'Logout successful'})

class authenticated(APIView):
    def get(self, request):
        user = request.user
        isAuthenticated = user.is_authenticated
        return JsonResponse({'isAuthenticated': isAuthenticated})
