from django.urls import path
from .views import ServiceList, ServicesView, JobView, ReviewView


app_name = 'service'

urlpatterns = [
    path('', ServiceList.as_view(), name='service-list'),
    path('<int:service_id>/edit/', ServicesView.as_view(), name='service-edit'),
    path('<int:service_id>/jobs/', JobView.as_view(), name='service-jobs-list'),
    path('create/', ServicesView.as_view(), name='service-create'),
    path('create/<int:service_id>/jobs/', JobView.as_view(), name='service-job-create'),
    path('edit/jobs/<int:job_id>', JobView.as_view(), name='service-job-edit'),
    path('delete/jobs/<int:job_id>', JobView.as_view(), name='service-job-edit'),
    path('<int:service_id>/create/review/', ReviewView.as_view()),
    path('<int:service_id>/reviews', ReviewView.as_view(), name='service-review')
]