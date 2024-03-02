from django.contrib.auth.models import Group
from rest_framework import serializers
from .models import Contract
from user.models import User
from service.models import Job, Service


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name', 'birth_date']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name'] 


class ServiceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class JobSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class ContractSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'
