from django.contrib.auth.models import Group
from rest_framework import serializers
from contract.models import Contract
from user.models import User
from service.models import Job, Service
from contract.models import Contract


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserServiceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'image']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name'] 

class JobSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Job
        fields = '__all__'

class ServiceSerializer(serializers.HyperlinkedModelSerializer):
    user = UserServiceSerializer()
    jobs = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['id', 'user', 'profession', 'city', 'experience', 'is_active', 'is_promoted', 'jobs']

    def get_jobs(self, obj):
        request = self.context.get('request')
        jobs = Job.objects.filter(service=obj)
        job_data = JobSerializer(jobs, many=True, context={'request': request}).data
        # Eliminar el campo 'service' de cada trabajo
        for job in job_data:
            del job['service']
        return job_data
    
class ContractSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'