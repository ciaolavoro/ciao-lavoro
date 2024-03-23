from user.models import User
from service.models import Service
from contract.models import Contract
from rest_framework import viewsets
from api.serializers import UserSerializer, ServiceSerializer, ContractSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class ContractViewSet(viewsets.ModelViewSet):
    serializer_class=ContractSerializer   
    queryset=Contract.objects.all()