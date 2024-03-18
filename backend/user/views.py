import re
from .models import User
from django.http import JsonResponse
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

        user = User.objects.create(username=username, first_name=first_name, last_name=last_name, email=email
        ,language=language, birth_date=birth_date, image=image)
        validate_password(password)
        user.set_password(password)
        user.save()
        return JsonResponse({'status': '1', 'message': ' The user has been successfully registered'})

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

class UserUpdate(APIView):
   
    @authentication_classes([TokenAuthentication])
    def get(self, request, format_arg=None):
        session_id = request.session.session_key
        user = request.user
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data)
    
    @authentication_classes([TokenAuthentication])
    def put(self, request, format_arg=None):
        authentication_classes = [SessionAuthentication]
        permission_classes = [IsAuthenticated]
        token_id = self.request.headers['Authorization']
        token = get_object_or_404(Token, key=token_id.split()[-1])
        user = token.user
        username = request.data.get('username')
        first_name = request.data.get('first_name')
        last_name  = request.data.get('last_name')
        email = request.data.get('email')
        language = request.data.get('language')
        birth_date = request.data.get('birth_date')
        image = request.FILES.get('image')
        if username:
            user.username = username
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
        user.save()
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data)
