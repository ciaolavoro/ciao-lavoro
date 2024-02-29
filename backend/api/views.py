from django.contrib.auth.models import Group
from .models import Contrato
from user.models import User
from rest_framework import permissions, viewsets

from api.serializers import ContratoSerializer, GroupSerializer, UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class ContratoViewSet(viewsets.ModelViewSet):
    serializer_class = ContratoSerializer
    queryset = Contrato.objects.all()