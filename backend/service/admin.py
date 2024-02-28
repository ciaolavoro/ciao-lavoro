from django import forms
from django.contrib import admin
from django.core.validators import MaxValueValidator, MinValueValidator
from .models import Service
import json

# Register your models here.
# Formulario custom para la entrada de datos

class ServiceForm(forms.ModelForm):
    PROFESSIONS = [
        (1, 'Lavandero'),
        (2, 'Celador'),
        (3, 'Albañil'),
    ]
    profession = forms.ChoiceField(choices=PROFESSIONS)
    city = forms.CharField(widget=forms.TextInput(attrs={'size': 30}))
    works = forms.CharField(widget=forms.Textarea)
    experience = forms.IntegerField(validators=[
        MaxValueValidator(80),
        MinValueValidator(0)
    ])
    is_active = forms.BooleanField(required=True)
    is_promoted = forms.BooleanField(required=False)

    class Meta:
        model = Service
        fields = '__all__'

    def clean_works(self):
        works = self.cleaned_data['works']
        try:
            data = json.loads(works)
            if not isinstance(data, list):
                raise forms.ValidationError("Works must be a list.")
            for item in data:
                if not isinstance(item, list) or len(item) != 2 or not isinstance(item[0], str) or not isinstance(item[1], int):
                    raise forms.ValidationError("Each tuple should contain a string and an integer.")
        except json.JSONDecodeError:
            raise forms.ValidationError("Invalid JSON format for tuples data.")
        return works


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    form = ServiceForm
    list_display = ('profession', 'city', 'experience', 'works')
    search_fields = ('profession', 'city', 'works', 'experience', 'is_active', 'is_promoted')