from django.shortcuts import render
from .models import User
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import logout as auth_logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import check_password
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes
from django.shortcuts import get_object_or_404

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
        user = get_object_or_404(User, username=username)
        if check_password(password,user.password):
            token,_ = Token.objects.get_or_create(user=user)
            return JsonResponse({'status': '1', 'token': token.key, 'message': 'User logged in successfully'})
        else:
            return JsonResponse({'status': '0', 'message': 'Invalid login credentials'})
 
class authenticated(APIView):
    @authentication_classes([TokenAuthentication])
    def get(self, request):
        token = request.headers['Authorization'].split()[-1]
        isAuthenticated = token != 'null'
        return JsonResponse({'isAuthenticated': isAuthenticated})
