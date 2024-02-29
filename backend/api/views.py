from django.contrib.auth.models import Group
from .models import Contract
from user.models import User
from rest_framework import permissions, viewsets, generics
from api.serializers import ContractSerializer, GroupSerializer, UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    #permission_classes = [permissions.IsAuthenticated]
class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer   
class ContractClientList(generics.ListAPIView):
    serializer_class = ContractSerializer
    def get_queryset(self):
        user = self.request.user.id
        queryset= Contract.objects.filter(client=user)
        return queryset   
class ContractWorkerList(generics.ListAPIView):
    serializer_class = ContractSerializer
    def get_queryset(self):
        user = self.request.user.id
        queryset = Contract.objects.filter(worker=user)
        return queryset