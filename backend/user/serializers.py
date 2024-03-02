from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'birth_date', 'language')