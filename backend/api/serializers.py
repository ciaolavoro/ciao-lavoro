from django.contrib.auth.models import Group
from rest_framework import serializers
from .models import Contrato
from user.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']
        
class ContratoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Contrato
        fields = ['worker', 'client','description','initial_date','fin_date','cost','state']