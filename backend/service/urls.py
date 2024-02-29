from django.urls import path
from . import views

app_name = 'user'

urlpatterns = [
    path('list/', views.list_services, name='services-list'),
]