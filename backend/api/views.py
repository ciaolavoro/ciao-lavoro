from user.models import User
from service.models import Service, Job
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from api.serializers import UserSerializer, ServiceSerializer, JobSerializer, ContractSerializer
from contract.models import Contract


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated]

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        """
        Sobrescribe el método `get_queryset` para filtrar los trabajos
        basados en el servicio proporcionado en la URL.
        """
        service_id = self.kwargs['service_id']  # Obtén el ID del servicio de la URL
        return Job.objects.filter(service_id=service_id)
    

class UserServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        user_id = self.kwargs['user_id']  # Obtén el ID del servicio de la URL
        return Service.objects.filter(user_id=user_id)

class ContractViewSetnt(viewsets.ModelViewSet):
    queryset=Contract.objects.all()
    serializer_class=ContractSerializer   
    # permission_classes = [permissions.IsAuthenticated]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
class ContractViewSet(viewsets.ModelViewSet):
    serializer_class=ContractSerializer   
    queryset=Contract.objects.all()