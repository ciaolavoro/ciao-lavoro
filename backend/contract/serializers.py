from rest_framework import serializers
from user.models import User
from .models import Contract

class UserServiceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'image']

class ContractSerializer(serializers.HyperlinkedModelSerializer):
    client = UserServiceSerializer()
    worker = UserServiceSerializer()
    estatus = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Contract
        fields = ['id', 'worker', 'client', 'estatus', 'accept_worker', 'accept_client', 'description', 'initial_date','end_date','cost','service','description_cancelation']
    def get_status(self, obj):
        return dict(Contract.STATUS_CHOICES).get(obj.status, "Desconocido")