from .models import Service, Job, Review
from rest_framework import serializers
from user.models import User



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'image']


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ServiceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'user', 'profession', 'city', 'experience', 'is_active', 'is_promoted' , 'jobs'] 
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        jobs_data = data['jobs']
        for job_data in jobs_data:
            del job_data['service']
        return data