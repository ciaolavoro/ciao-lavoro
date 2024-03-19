from django.contrib.auth.models import Group
from rest_framework import serializers
from contract.models import Contract
from user.models import User
from service.models import Job, Service
from contract.models import Contract, Task


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
    estatus = serializers.CharField(source='get_status_display', read_only=True)

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
    
class ContractSerializer(serializers.ModelSerializer):

    total_cost = serializers.SerializerMethodField()
    tasks = TaskSerializer(many=True, read_only=True, source='task_set')

    class Meta:
        model = Contract
        fields = ['worker', 'client', 'accept_worker', 'accept_client', 'description', 'total_cost', 'initial_date', 'end_date',
                  'status', 'service', 'tasks']

    def get_status(self, obj):
        return dict(Contract.STATUS_CHOICES).get(obj.status, "Desconocido")

    def get_total_cost(self, obj):
        return obj.total_cost

    def to_representation(self, instance):
        data = super().to_representation(instance)
        tasks_data = data['tasks']
        for task_data in tasks_data:
            del task_data['contract']
        return data