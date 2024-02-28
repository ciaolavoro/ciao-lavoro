from rest_framework import serializers
from .models import Service

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ('profession', 'city', 'experience', 'works', 'is_active', 'is_promoted')