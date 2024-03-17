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
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        profession_number = data['profession']
        profession_name = dict(Service.PROFESSIONS).get(profession_number)
        if profession_name:
            data['profession'] = profession_name
        return data
    
class ContractSerializer(serializers.HyperlinkedModelSerializer):
    client = UserServiceSerializer()
    worker = UserServiceSerializer()
    statusS = serializers.CharField(source='get_status_display', read_only=True)      

    class Meta:
        model = Contract
        fields = ['id', 'worker', 'client', 'statusS', 'accept_worker', 'accept_client', 'description', 'initial_date','end_date','cost','service']
