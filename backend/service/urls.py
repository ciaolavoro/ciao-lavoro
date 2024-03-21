from django.urls import path
from .views import ServiceList,UserHasService, UserServiceList, JobViewSet 
from .views import JobList, ServiceCreation, JobCreation, JobEdit 
from .views import JobDelete, ReviewCreation, ReviewList, EditService
app_name = 'service'

urlpatterns = [
    path('', ServiceList.as_view(), name='service-list'),
    path('<int:service_id>/edit/', EditService.as_view(), name='service-edit'),
    path('jobs/', JobList.as_view(), name='service-jobs'),
    path('<int:service_id>/jobs/', JobViewSet.as_view({'get': 'list'}), name='service-jobs-list'),
    path('user/<int:user_id>', UserServiceList.as_view(), name='user-service-list'),
    path('create/', ServiceCreation.as_view(), name='service-create'),
    path('create/<int:service_id>/jobs/', JobCreation.as_view(), name='service-job-create'),
    path('edit/jobs/<int:job_id>', JobEdit.as_view(), name='service-job-edit'),
    path('delete/jobs/<int:job_id>', JobDelete.as_view(), name='service-job-edit'),
    path('<int:service_id>/create/review/', ReviewCreation.as_view()),
    path('<int:service_id>/reviews/', ReviewList.as_view(), name='service-review'),
    path('<int:service_id>/userProperty/', UserHasService.as_view(), name='has-service')
]