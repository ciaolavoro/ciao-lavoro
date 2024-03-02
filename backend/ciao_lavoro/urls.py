"""
URL configuration for ispp_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'user', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'service', views.ServiceViewSet)
router.register(r'contracts', views.ContractViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('user.urls', namespace='user')),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('clientContractList/', views.ContractClientList.as_view(), name="client-contracts"),
    path('workerContractList/', views.ContractWorkerList.as_view(), name="worker-contracts"),
    path('service/', include('service.urls', namespace='services')),

]
