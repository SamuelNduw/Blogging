from django.urls import path
from . import views
from .views import BlogList, BlogRetrieveUpdateDestroyView

urlpatterns = [
    path('blogs/', BlogList.as_view(), name='blog-list-create'),
    path('blogs/<int:pk>/', BlogRetrieveUpdateDestroyView.as_view(), name='blog-retrieve-update-destroy'),
]