from django.urls import path
from .views import ServiceList, JobViewSet, JobList, ServiceCreation, JobCreation

app_name = 'service'

urlpatterns = [
    path('', ServiceList.as_view(), name='service-list'),
    path('jobs/', JobList.as_view(), name='service-jobs'),
    path('<int:service_id>/jobs/', JobViewSet.as_view({'get': 'list'})),
    path('create/', ServiceCreation.as_view(), name='service-create'),
    path('create/job/', JobCreation.as_view(), name='service-job-create'),
]