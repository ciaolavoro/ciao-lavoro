from django.urls import path
from . import views

app_name = 'user'

urlpatterns = [
    path('',views.UserList.as_view(), name='user-list'),
    path('<int:user_id>/', views.UserDetails.as_view(), name='user-details'),
    path('profile/', views.Profile.as_view(), name='profile'),
    path('register/', views.register.as_view(), name='register'),
    path('login/', views.login_view.as_view(), name='login'),
    path('getPoints/', views.GetPoints.as_view(), name='user-points')
]