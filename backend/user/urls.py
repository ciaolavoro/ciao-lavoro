from django.urls import path

from service.views import UserServiceViewSet
from . import views

app_name = 'user'

urlpatterns = [
    path('<int:user_id>/', views.UserDetails.as_view(), name='user-details'),
    path('<int:user_id>/services/', UserServiceViewSet.as_view({'get': 'list'})),
    path('register/', views.register.as_view(), name='register'),
    path('edit/', views.UserUpdate.as_view(), name='user-update'),
    path('login/', views.login_view.as_view()),
    path('authenticated/', views.authenticated.as_view(), name='authenticated'),
]