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
from datetime import date

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

class JobList(APIView):
    def get(self, request):
        jobs = Job.objects.all()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    def get_queryset(self):
        """
        Sobrescribe el método `get_queryset` para filtrar los trabajos
        basados en el servicio proporcionado en la URL.
        """
        service_id = self.kwargs['service_id']  # Obtén el ID del servicio de la URL
        return Job.objects.filter(service_id=service_id)

class JobDetail(generics.RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

@permission_classes([permissions.AllowAny])
class ServiceCreation(APIView):
    def post(self, request):
        service_data = request.data
        token_id = request.headers['AuthToken']
        token = get_object_or_404(Token, key=token_id.split()[-1])
        user = token.user
        city = service_data['city']
        profession = service_data['profession']
        profesions = Service.PROFESSIONS
        profession_exists = False
        for profession_id, _ in profesions:
            if profession_id == int(profession):
                profession_exists = True
        if not profession_exists:
            raise PermissionDenied('La profesión no es valida')
        user_services = list(Service.objects.filter(user=user))
        for s in user_services:
            if s.profession == int(profession):
                raise PermissionDenied('No se pueden crear dos servicios de la misma profesión')
        experience = service_data['experience']
        if experience == '':
            experience = 0
        elif not isinstance(experience, int):
            raise PermissionDenied('La experiencia debe ser un número')
        birth_date = user.birth_date
        today = date.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        if experience+16 > age:
            raise PermissionDenied('La experiencia es demasiado alta')
        service = Service.objects.create(user=user, profession=profession, city=city, experience=experience)
        serializer = ServiceSerializer(service, many=False)
        return Response(serializer.data)

class JobCreation(APIView):
    def post(self, request, service_id):
        job_data = request.data
        service = Service.objects.get(pk=service_id)
        if service.user != request.user and not request.user.is_staff:
            raise PermissionDenied("No tienes permiso para crear un trabajo para un servicio que no te pertenece")
        name = job_data['name']
        estimated_price = job_data['estimated_price']
        job = Job.objects.create(service=service, name=name, estimated_price=estimated_price)
        serializer = JobSerializer(job, many=False)
        return Response(serializer.data)

class JobEdit(APIView):
    def post(self, request, job_id):
        job_data = request.data
        job = Job.objects.get(pk=job_id)
        if job.service.user != request.user and not request.user.is_staff:
            raise PermissionDenied("No tienes permiso para editar un trabajo para un servicio que no te pertenece")
        new_name = job_data['name']
        new_estimated_price = job_data['estimated_price']
        job.name = new_name
        job.estimated_price = new_estimated_price
        job.save()
        serializer = JobSerializer(job, many=False)
        return Response(serializer.data)
class JobDelete(APIView):
    def post(self, request, job_id):
        job = Job.objects.get(pk=job_id)
        if job.service.user != request.user and not request.user.is_staff:
            raise PermissionDenied("No tienes permiso para eliminar un trabajo para un servicio que no te pertenece")
        Job.delete(job)
        serializer = JobSerializer(job, many=False)
        return Response(serializer.data)

class UserServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    def get_queryset(self):
        """
        Sobrescribe el método `get_queryset` para filtrar los trabajos
        basados en el servicio proporcionado en la URL.
        """
        user_id = self.kwargs['user_id']  # Obtén el ID del servicio de la URL
        return Service.objects.filter(user_id=user_id)

class ReviewList(APIView):
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