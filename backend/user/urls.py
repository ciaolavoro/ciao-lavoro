from django.urls import path
from . import views

app_name = 'user'

urlpatterns = [
    path('list/', views.list_users, name='user-list'),
    path('login/', views.login_view.as_view()),
    path('logout/', views.logout_view.as_view(), name='logout'),
    path('authenticated/', views.authenticated.as_view(), name='authenticated'),
    path('register/', views.register.as_view(), name='register'),
]