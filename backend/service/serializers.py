from .models import Service, Job
from rest_framework import serializers


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model= Job
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'