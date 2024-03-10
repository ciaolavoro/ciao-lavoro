from django.urls import path

from service.views import UserServiceViewSet
from . import views

app_name = 'user'

urlpatterns = [
    path('', views.UserList.as_view(), name='user-list'),
    path('<int:user_id>/services/', UserServiceViewSet.as_view({'get': 'list'})),
    path('login/', views.login_view.as_view()),
    path('authenticated/', views.authenticated.as_view(), name='authenticated'),
    path('register/', views.register.as_view(), name='register'),
    path('edit/', views.UserUpdate.as_view(), name='user-update'),
]