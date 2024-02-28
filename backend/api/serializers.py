from django.contrib.auth.models import Group, User
from rest_framework import serializers
from user.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'name', 'lastname', 'email', 'desc', 'birth_date', 'date_joined', 'lenguage', 'is_worker', 'profession', 'years_experience', 'task']