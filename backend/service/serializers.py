from .models import Service, Job, Review
from user.models import User
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

class ServiceSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    jobs = JobSerializer(many=True, read_only=True, source='job_set') 
    profession = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['id', 'user', 'profession', 'city', 'experience', 'is_active', 'is_promoted' , 'jobs'] 
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        jobs_data = data['jobs']
        for job_data in jobs_data:
            del job_data['service']
        return data
    
    def get_profession(self, obj):
        return dict(Service.PROFESSIONS)[obj.profession]
    
class UserReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'image']

class ReviewSerializer(serializers.ModelSerializer):
    user = UserReviewSerializer(read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
