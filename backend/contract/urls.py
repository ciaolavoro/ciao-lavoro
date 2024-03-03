from django.urls import path

from .views import ContractCreation

app_name = 'contracts'

urlpatterns = [
    path('create/', ContractCreation.as_view(), name='contract-create'),

]