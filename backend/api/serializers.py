from user.models import User
from service.models import Job, Service,Review
from contract.models import Contract
from rest_framework import serializers


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
class UserReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'image']

class ReviewSerializer(serializers.ModelSerializer):
    user = UserReviewSerializer(read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
class ServiceSerializer(serializers.HyperlinkedModelSerializer):
    user = UserServiceSerializer()
    jobs = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    class Meta:
        model = Service
        fields = ['id', 'user', 'profession', 'city', 'experience', 'is_active', 'is_promoted', 'jobs','reviews']

    def get_jobs(self, obj):
        request = self.context.get('request')
        jobs = Job.objects.filter(service=obj)
        job_data = JobSerializer(jobs, many=True, context={'request': request}).data
        # Eliminar el campo 'service' de cada trabajo
        for job in job_data:
            del job['service']
        return job_data
    def get_reviews(self, obj):
        request = self.context.get('request')
        reviews = Review.objects.filter(service=obj)
        review_data = ReviewSerializer(reviews, many=True, context={'request': request}).data
        # Eliminar el campo 'service' de cada trabajo
        for review in review_data:
            del review['service']
        return review_data
    
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

    class Meta:
        model = Contract
        fields = ['id', 'worker', 'client', 'estatus', 'accept_worker', 'accept_client', 'description', 'initial_date','end_date','cost','service']
    def get_status(self, obj):
        return dict(Contract.STATUS_CHOICES).get(obj.status, "Desconocido")
