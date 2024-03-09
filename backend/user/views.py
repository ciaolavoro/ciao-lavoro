import re
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
from rest_framework import generics
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer

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
        token = request.headers.get('Authorization', '')
        isAuthenticated = False
        pattern = re.compile(r'^Token [0-9a-f]{40}$')
        isAuthenticated = bool(pattern.match(token))
        return JsonResponse({'isAuthenticated': isAuthenticated})

class register(APIView):
    
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def post(self, request, format_arg=None):
        username = request.data.get('username')
        first_name = request.data.get('firstName')
        last_name  = request.data.get('lastName')
        email = request.data.get('email')
        password = request.data.get('password')
        language = request.data.get('language')
        birth_date = request.data.get('birthDate')
        image = request.FILES.get('image')
             
        user = User.objects.create(username= username, first_name= first_name, last_name= last_name, email= email, password = password
        ,language = language, birth_date = birth_date, image=image)

        user.save()

        return JsonResponse({'status': '1', 'message': ' The user has been successfully registered'})
    

class UserUpdate(APIView):
    def get(self, request, format_arg=None):
        token_id = request.headers["Authorization"].split()[-1]
        token = get_object_or_404(Token,key=token_id)
        user = token.user
        serializer = UserSerializer(user, many=False)
        return JsonResponse(serializer.data)
    
    @authentication_classes([TokenAuthentication])
    def put(self, request, format_arg=None):
        username = request.data.get('username')
        first_name = request.data.get('first_name')
        last_name  = request.data.get('last_name')
        email = request.data.get('email')
        password = request.data.get('password')
        language = request.data.get('language')
        birth_date = request.data.get('birth_date')
        image = request.FILES.get('image')
        token_id = request.headers["Authorization"].split()[-1]
        token = get_object_or_404(Token,key=token_id)
        user = token.user
        if username != '' and username != None:
            user.username = username
        if first_name != '' and first_name != None:
            print(first_name)
            user.first_name = first_name
        if last_name != '' and last_name != None:
            user.last_name = last_name
        if email != '' and email != None:
            user.email = email
        if password != '' and password != None:
            user.password = password
        if language != '' and language != None:
            user.language = language
        if birth_date != '' and birth_date != None:
            print(birth_date)
            user.birth_date = birth_date
        if image != '' and image != None:
            user.image = image
        user.save()
        serializer = UserSerializer(user, many=False)
        return JsonResponse(serializer.data)