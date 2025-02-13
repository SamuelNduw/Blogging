from django.urls import path
from . import views
from .views import BlogList

urlpatterns = [
    path('blogs/', BlogList.as_view(), name='blog-crud'),
    path('answer', views.answer)
]