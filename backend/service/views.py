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

# Create your views here

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

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.serializer_class(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserServiceList(APIView):
    def get(self, request, user_id):
        services = Service.objects.filter(user_id=user_id)
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

class JobView(APIView):

    def get(self, request):
        jobs = Job.objects.all()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    

    @authentication_classes([TokenAuthentication])
    def post(self, request, service_id):
        job_data = request.data
        service = Service.objects.get(pk=service_id)
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if user != service.user:
            raise PermissionDenied('No eres el propietario de este servicio')
        name = job_data['name'].strip()
        if name == '':
            raise ValidationError('El nombre no puede estar vacio')
        elif len(name) > 100:
            raise ValidationError('La cantidad de caracteres del nombre no puede ser superio a 100')
        estimated_price = job_data['estimated_price']
        if estimated_price == '':
            estimated_price = 0.1
        elif not estimated_price.isdigit():
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
        new_name = job_data['name'].strip()
        if new_name == '':
            raise ValidationError('El nombre no puede estar vacio')
        elif len(new_name) > 100:
            raise ValidationError('La cantidad de caracteres del nombre no puede ser superio a 100')
        new_estimated_price = job_data['estimated_price']
        if new_estimated_price == '':
            new_estimated_price = 0.1
        elif not new_estimated_price.isdigit():
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

class UserServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    def get_queryset(self):
        user_id = self.kwargs['user_id']  # Obtén el ID del servicio de la URL
        return Service.objects.filter(user_id=user_id)

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
        description = review_data['description']
        rating = review_data['rating']
        date = datetime.now()
        if int(rating) > 5 or int(rating) < 0 :
            raise ValidationError('La valoración debe de estar entre 0 y 5')
        if len(description) > 500:
            raise ValidationError('La descripción no puede contener más de 500 caracteres')
        review = Review.objects.create(user=user, service=service, description=description, rating=rating, date=date)
        serializer = ReviewSerializer(review, many=False)
        return Response(serializer.data)


class ServicesView(APIView):

    @authentication_classes([TokenAuthentication])
    def post(self, request):
        service_data = request.data
        token_id = request.headers['Authorization']
        token = get_object_or_404(Token, key=token_id.split()[-1])
        user = token.user
        city = service_data['city'].strip()
        if city == '':
            raise ValidationError("Debe indicar la ciudad")
        elif (len(city) > 200):
            raise ValidationError("La ciudad no puede contener más de 200 caracteres")
        profession = service_data['profession']
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
        elif not experience.isdigit():
            raise ValidationError('La experiencia debe ser un número')
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
        profession = service_data['profession']
        if not profession == '':
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
        city = service_data['city'].strip()
        if  city != '':
            service.city = city
        elif city == '':
            raise ValidationError("Debe indicar la ciudad")
        elif (len(city)>200):
            raise ValidationError("La ciudad no puede contener más de 200 caracteres")
        experience = service_data['experience']
        if not experience == '':
            birth_date = user.birth_date
            today = date.today()
            age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
            if int(experience)+16 > age:
                raise ValidationError('La experiencia es demasiado alta')
            service.experience = experience
        is_active = service_data['is_active']
        if not is_active == '':
            service.is_active = is_active
        service.save()
        serializer = ServiceSerializer(service, many=False)
        return Response(serializer.data)