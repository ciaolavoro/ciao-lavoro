import re
from django.shortcuts import render
from .models import User
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import logout as auth_logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import check_password
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.decorators import authentication_classes
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer

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
        birth_date = request.data.get('birthdate')
        image = request.FILES.get('image')
             
        user = User.objects.create(username= username, first_name= first_name, last_name= last_name, email= email, password = password
        ,language = language, birth_date = birth_date, image=image)

        user.save()

        return JsonResponse({'status': '1', 'message': ' The user has been successfully registered'})
    
class UserList(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
class UserUpdate(APIView):
   
    def get(self, request, format_arg=None):
        authentication_classes = [SessionAuthentication]
        permission_classes = [IsAuthenticated]
        session_id = request.session.session_key
        print(session_id)
        user = request.user
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data)
    
    def put(self, request, format_arg=None):
        authentication_classes = [SessionAuthentication]
        permission_classes = [IsAuthenticated]
        user = request.user
        first_name = request.data.get('first_name')
        last_name  = request.data.get('last_name')
        email = request.data.get('email')
        language = request.data.get('language')
        birth_date = request.data.get('birth_date')
        image = request.FILES.get('image')
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        if email:
            user.email = email
        if language:
            user.language = language
        if birth_date:
            user.birth_date = birth_date
        if image:
            user.image = image
        user.update()
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data)