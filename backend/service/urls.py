from django.urls import path
from .views import ServiceList, JobViewSet, JobList, ServiceCreation

app_name = 'user'

urlpatterns = [
    path('', ServiceList.as_view(), name='service-list'),
    path('create/', ServiceCreation.as_view(), name='service-create'),
    path('jobs/', JobList.as_view(), name='service-jobs'),
    path('<int:service_id>/jobs/', JobViewSet.as_view({'get': 'list'})),
]