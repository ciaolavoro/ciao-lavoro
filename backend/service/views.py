from django.shortcuts import render
from user.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Service, Job
from .serializers import ServiceSerializer, JobSerializer

# Create your views here.

def list_services(request):
    services = Service.objects.all()
    return render(request, 'services_list.html', {'services': services})

class ServiceList(APIView):
    def get(self, request):
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

class JobList(APIView):
    def get(self, request):
        print("Esto es una locura")
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

@permission_classes([permissions.AllowAny])
class ServiceCreation(APIView):
    def post(self, request):
        service_data = request.data
        user = User.objects.get(email=service_data['email'])
        profession = service_data['profession']
        city = service_data['city']
        experience = service_data['experience']
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
