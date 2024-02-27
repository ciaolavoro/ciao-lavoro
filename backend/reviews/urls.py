from django.urls import path
from . import views

app_name = 'reviews'

urlpatterns = [
    path('review/', views.review_list, name='review-list'),
]