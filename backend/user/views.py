import re

from django.forms import ValidationError
from .models import User
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import check_password
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.decorators import authentication_classes
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer
from django.contrib.auth.password_validation import validate_password
import os
from django.conf import settings
from django.core.files.base import ContentFile
import requests
from django.core.validators import validate_email

class login_view(APIView):

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
            return JsonResponse({'status': '1', 'user': UserSerializer(user).data, 'token': token.key, 'message': 'User logged in successfully'})
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
    
    permission_classes = [AllowAny]

    def post(self, request, format_arg=None):
        try:
            username = request.data.get('username')
            first_name = request.data.get('firstName')
            last_name  = request.data.get('lastName')
            email = request.data.get('email')
            password = request.data.get('password')
            language = request.data.get('language')
            birth_date = request.data.get('birthdate')
            image = request.FILES.get('image')
            if User.objects.filter(username=username).exists():
                return JsonResponse({'status': '0', 'message': 'El nombre de usuario ya está en uso'},status=status.HTTP_400_BAD_REQUEST)
            if not image:
                default_image_path = os.path.join(settings.BASE_DIR, 'users', 'default.png').replace('\\','/')
                with open(default_image_path, 'rb') as default_image_file:
                    image = ContentFile(default_image_file.read(), 'default.png')
            if email:
                validate_email(email)
                response = requests.get("https://emailvalidation.abstractapi.com/v1/?api_key=3e43ea5a71fc406ba3702133e44aa6d5&email="+email)
                json_data = response.json()
                if 'error' not in json_data.keys():
                    deliverability = json_data['deliverability']
                    if not deliverability == 'DELIVERABLE':
                        raise ValidationError("El email no es valido")
            user = User.objects.create(username=username, first_name=first_name, last_name=last_name, email=email
            ,language=language, birth_date=birth_date, image=image)
            validate_password(password)
            user.set_password(password)
            user.save()
            return JsonResponse({'status': '1', 'message': ' The user has been successfully registered'})
        except ValidationError as e:
            return JsonResponse({'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ValueError as e:
            return JsonResponse({'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserList(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
class UserDetails(APIView):
    def get(self, request, format_arg=None, *args, **kwargs):
        authentication_classes = [SessionAuthentication]
        permission_classes = [IsAuthenticated]
        user_id = self.kwargs['user_id']
        user = get_object_or_404(User, id=user_id)
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data)

class Profile(APIView):
    @authentication_classes([TokenAuthentication])
    def get(self, request, format_arg=None):
        token_id = request.headers['Authorization']
        token = get_object_or_404(Token, key=token_id.split()[-1])
        user = token.user
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data)

    @authentication_classes([TokenAuthentication])
    def put(self, request, format_arg=None):
        try:
            token_id = request.headers['Authorization']
            token = get_object_or_404(Token, key=token_id.split()[-1])
            user = token.user
            user_data = request.data
            username = user_data['username']
            first_name = user_data['first_name']
            last_name  = user_data['last_name']
            email = user_data['email']
            language = user_data['language']
            birth_date = user_data['birth_date']
            image = request.FILES.get('image')
            if username:
                user.username = username
            if first_name:
                user.first_name = first_name
            if last_name:
                user.last_name = last_name
            if email:
                user.email = email
                validate_email(email)
                response = requests.get("https://emailvalidation.abstractapi.com/v1/?api_key=3e43ea5a71fc406ba3702133e44aa6d5&email="+email)
                json_data = response.json()
                if 'error' not in json_data.keys():
                    deliverability = json_data['deliverability']
                    if not deliverability == 'DELIVERABLE':
                        raise ValidationError("El email no es valido")
            if language and language.strip() != '':
                user.language = language
            if birth_date:
                user.birth_date = birth_date
            if image:
                user.image = image
            user.save()
            serializer = UserSerializer(user)
            return JsonResponse(serializer.data)
        except ValidationError as e:
            return JsonResponse({'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ValueError as e:
            return JsonResponse({'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

