from django.urls import path

from service.views import UserServiceViewSet
from . import views
from .views import UserList

app_name = 'user'

urlpatterns = [
    path('', UserList.as_view(), name='user-list'),
    path('<int:user_id>/services/', UserServiceViewSet.as_view({'get': 'list'})),
    path('login/', views.login_view.as_view()),
    path('authenticated/', views.authenticated.as_view(), name='authenticated'),
    path('register/', views.register.as_view(), name='register'),
]