from django.urls import path
from .views import ServiceList, ServiceCreation, JobCreation

app_name = 'service'

urlpatterns = [
    path('', ServiceList.as_view(), name='service-list'),
    path('create/', ServiceCreation.as_view(), name='service-create'),
    path('create/job/', JobCreation.as_view(), name='service-job-create'),
]