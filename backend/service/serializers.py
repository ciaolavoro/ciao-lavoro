from .models import Service, Job
from rest_framework import serializers
from user.models import User



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'image']

class ServiceSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Service
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class ServiceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'