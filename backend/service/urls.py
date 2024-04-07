from django.urls import path
from .views import UserHasService, AllServiceInPromotion, ServiceList, AllProfessionList
from .views import ServiceView, JobView, ReviewView, UserServiceList, ProfessionList
from .views import PromotionPayment
app_name = 'service'

urlpatterns = [
    path('', ServiceList.as_view(), name='service-list'),
    path('<int:service_id>/edit/', ServiceView.as_view(), name='service-edit'),
    path('create/', ServiceView.as_view(), name='service-create'),
    path('user/<int:user_id>', UserServiceList.as_view(), name='user-service-list'),
    path('create/<int:service_id>/jobs/', JobView.as_view(), name='service-job-create'),
    path('edit/jobs/<int:job_id>', JobView.as_view(), name='service-job-edit'),
    path('delete/jobs/<int:job_id>', JobView.as_view(), name='service-job-delete'),
    path('<int:service_id>/create/review/', ReviewView.as_view(), name='service-review-create'),
    path('<int:service_id>/reviews', ReviewView.as_view(), name='service-review'),
    path('professionsList/', ProfessionList.as_view(), name='service-professions'),
    path('allProfessionsList/', AllProfessionList.as_view(), name='service-all-professions'),
    path('<int:service_id>/userProperty/', UserHasService.as_view(), name='has-service'),
    path('promotion/<int:service_id>/', PromotionPayment.as_view(), name= 'service-promotion'),
    path('promoted/', AllServiceInPromotion.as_view(), name= 'service-all-promotion')
]