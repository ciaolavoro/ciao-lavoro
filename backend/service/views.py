from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from user.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework import viewsets, permissions, generics, status
from rest_framework.exceptions import PermissionDenied
from .models import Service, Job, Review
from .serializers import ServiceSerializer, JobSerializer, ReviewSerializer
from rest_framework.authtoken.models import Token
from datetime import date, datetime
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes
from django.forms import ValidationError

class ServiceList(generics.ListAPIView):
    serializer_class = ServiceSerializer
    def get_queryset(self):
        services = Service.objects.all()
        search_profession = self.request.query_params.get('search_profession')
        search_city = self.request.query_params.get('search_city')

        if search_profession:
            services = services.filter(profession=search_profession)
        if search_city:
            services = services.filter(city__icontains=search_city)
    
        return services

class ProfessionList(APIView):
    def get(self, request):
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        all_professions = Service.PROFESSIONS
        professions = []
        for p in all_professions:
            service = Service.objects.filter(user=user, profession=p[0])
            if not service:
                professions.append(p[1])
        return Response({"professions": professions})

class UserServiceList(APIView):
    def get(self, request, user_id):
        services = Service.objects.filter(user_id=user_id)
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

class ProfessionsList(APIView):
    def get(self, request):
        professions = Service.PROFESSIONS
        return Response(professions)
    
class JobView(APIView):
    @authentication_classes([TokenAuthentication])
    def post(self, request, service_id):
        job_data = request.data
        service = Service.objects.get(pk=service_id)
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if user != service.user:
            raise PermissionDenied('No eres el propietario de este servicio')
        if job_data['name'] and job_data['name'].strip() != '':
            name = job_data['name'].strip()
        else:
            raise ValidationError('El nombre no puede estar vacío')
        
        if len(name) > 100:
            raise ValidationError('La cantidad de caracteres del nombre no puede ser superior a 100')
        estimated_price = job_data['estimated_price']
        if estimated_price == '':
            estimated_price = 10
        if not isinstance(estimated_price, int):
            raise ValidationError('El precio estimado debe ser un número')
        job = Job.objects.create(service=service, name=name, estimated_price=estimated_price)
        serializer = JobSerializer(job, many=False)
        return Response(serializer.data)

    @authentication_classes([TokenAuthentication])
    def put(self, request, job_id):
        job_data = request.data
        job = Job.objects.get(pk=job_id)
        service = job.service
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if user != service.user:
            raise PermissionDenied('No puedes editar un trabajo de un servicio que no te pertenece')
        if job_data['name'] and job_data['name'].strip() != '':
            new_name = job_data['name'].strip()
        else:
            raise ValidationError('El nombre no puede estar vacío')
        
        if len(new_name) > 100:
            raise ValidationError('La cantidad de caracteres del nombre no puede ser superior a 100')
        new_estimated_price = job_data['estimated_price']
        if new_estimated_price == '':
            new_estimated_price = 10
        if not isinstance(new_estimated_price, int):
            raise ValidationError('El precio estimado debe ser un número')
        job.name = new_name
        job.estimated_price = new_estimated_price
        job.save()
        serializer = JobSerializer(job, many=False)
        return Response(serializer.data)
    
    @authentication_classes([TokenAuthentication])
    def delete(self, request, job_id):
        job = Job.objects.get(pk=job_id)
        service = job.service
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if user != service.user:
            raise PermissionDenied('No puedes eliminar un trabajo de un servicio que no te pertenece')
        Job.delete(job)
        serializer = JobSerializer(job, many=False)
        return Response(serializer.data)

class ReviewView(APIView):
    def get(self, request, service_id):
        service = get_object_or_404(Service, pk=service_id)
        reviews = Review.objects.filter(service=service)
        serializer = ReviewSerializer(reviews, many=True)
        response_data = {
            "rating": service.rating(),
            "total_reviews": len(reviews),
            "reviews": serializer.data
        }
        return Response(response_data)
    
    @authentication_classes([TokenAuthentication])
    def post(self, request, service_id):
        review_data = request.data
        service = Service.objects.get(pk=service_id)
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if review_data['description'] and review_data['description'].strip() != '':
            description = review_data['description'].strip()
        else:
            raise ValidationError("Una valoración debe contener una descripción")
        if review_data['rating'] and review_data['rating'] != '':
            rating = review_data['rating']
        else:
            raise ValidationError("Una valoración esta incompleta sin la puntuación")
        
        date = datetime.now()
        if int(rating) > 5 or int(rating) < 0 :
            raise ValidationError('La valoración debe de estar entre 0 y 5')
        if len(description) > 500:
            raise ValidationError('La descripción no puede contener más de 500 caracteres')
        review = Review.objects.create(user=user, service=service, description=description, rating=rating, date=date)
        serializer = ReviewSerializer(review, many=False)
        return Response(serializer.data)

class ServiceView(APIView):
    @authentication_classes([TokenAuthentication])
    def post(self, request):
        service_data = request.data
        token_id = request.headers['Authorization']
        token = get_object_or_404(Token, key=token_id.split()[-1])
        user = token.user
        if service_data['city'] and service_data['city'].strip() != '':
            city = service_data['city'].strip()
        else:
            raise ValidationError("Debe indicar la ciudad")
        if service_data['profession'] and service_data['profession'] != '':
            profession = service_data['profession']
        else: 
            raise ValidationError("Se debe introducir una profesión")
        
        profesions = Service.PROFESSIONS
        profession_exists = False
        for profession_id, _ in profesions:
            if profession_id == int(profession):
                profession_exists = True
        if not profession_exists:
            raise ValidationError('La profesión no es valida')
        user_services = list(Service.objects.filter(user=user))
        for s in user_services:
            if s.profession == int(profession):
                raise ValidationError('No se pueden crear dos servicios de la misma profesión')
        experience = service_data['experience']
        if experience == '':
            experience = 0
        if (len(city) > 200):
            raise ValidationError("La ciudad no puede contener más de 200 caracteres")
        if not isinstance(experience, int):
            raise ValidationError('La experiencia debe ser un número entero')
        birth_date = user.birth_date
        today = date.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        if int(experience)+16 > age:
            raise ValidationError('La experiencia es demasiado alta')
        service = Service.objects.create(user=user, profession=profession, city=city, experience=experience)
        serializer = ServiceSerializer(service, many=False)
        return Response(serializer.data)
    
    @authentication_classes([TokenAuthentication])
    def put(self, request, service_id):
        service_data = request.data
        service = Service.objects.get(pk=service_id)
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if user != service.user:
            raise PermissionDenied('No eres el propietario de este servicio')
        if  service_data['city'] and service_data['city'].strip() != '':
            city = service_data['city'].strip()
            service.city = city
        else:
            raise ValidationError("Debe indicar la ciudad")
        if service_data['profession'] and service_data['profession'] != '':
            profession = service_data['profession']
        else: 
            raise ValidationError("Se debe introducir una profesión")
        profesions = Service.PROFESSIONS
        profession_exists = False
        for profession_id, _ in profesions:
            if profession_id == int(profession):
                profession_exists = True
        if not profession_exists:
            raise ValidationError('La profesión no es valida')
        user_services = list(Service.objects.filter(user=user))
        for s in user_services:  
            if s.profession == int(profession) and service.id != s.id:
                raise ValidationError('No se pueden crear dos servicios de la misma profesión')
        service.profession = profession
        experience = service_data['experience']
        if  experience == '':
            experience = 0  
        if not isinstance(experience, int):
            raise ValidationError('La experiencia debe ser un número entero')
        is_active = service_data['is_active']
        if not is_active == '':
            service.is_active = is_active

        if (len(city)>200):
            raise ValidationError("La ciudad no puede contener más de 200 caracteres")
        birth_date = user.birth_date
        today = date.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        if int(experience)+16 > age:
            raise ValidationError('La experiencia es demasiado alta')
        service.experience = experience
        service.save()
        serializer = ServiceSerializer(service, many=False)
        return Response(serializer.data)
    
class UserHasService(APIView):
    @authentication_classes([TokenAuthentication])
    def get(self, request, service_id):
        service = Service.objects.get(pk=service_id)
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if user != service.user:
            state = True
        else :
            state = False
        data = {'user_state': state}
        return JsonResponse(data)
    