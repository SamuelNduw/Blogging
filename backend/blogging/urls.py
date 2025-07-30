from django.urls import path
from . import views
from .views import SendImage, BlogList, UserRegistrationView, ProtectedView, BlogCreateView, BlogGet, CustomTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('blogs/', BlogList.as_view(), name='blog-crud'),
    path('blogs/<int:blog_id>/', BlogList.as_view(), name='delete-blog'),

    path('blogs/create', BlogCreateView.as_view(), name='create-blog'),
    path('blogs/get', BlogGet.as_view(), name='get-all-blog'),
    path('image', SendImage.as_view(), name='image_send'),

    path('answer', views.answer),
    path('register', UserRegistrationView.as_view(), name='user_registration'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', ProtectedView.as_view(), name="test_protected_view")
]