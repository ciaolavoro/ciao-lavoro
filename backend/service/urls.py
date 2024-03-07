from django.urls import path
from .views import ServiceList, UserServiceList, JobViewSet, JobList, ServiceCreation, JobCreation

app_name = 'service'

urlpatterns = [
    path('', ServiceList.as_view(), name='service-list'),
    path('jobs/', JobList.as_view(), name='service-jobs'),
    path('<int:service_id>/jobs/', JobViewSet.as_view({'get': 'list'})),
    path('user/<int:user_id>', UserServiceList.as_view(), name='user-service-list'),
    path('create/', ServiceCreation.as_view(), name='service-create'),
    path('create/<int:service_id>/jobs/', JobCreation.as_view(), name='service-job-create'),
]