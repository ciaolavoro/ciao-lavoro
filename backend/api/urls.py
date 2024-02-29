from django.urls import path,include
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'contratos',views.ContratoViewSet, 'contrato')
urlpatterns = [
    path("api/v1/", include(router.urls))
    
]