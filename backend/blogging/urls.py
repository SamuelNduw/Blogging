from django.urls import path
from . import views
from .views import BlogList, UserRegistrationView, ProtectedView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('blogs/', BlogList.as_view(), name='blog-crud'),
    path('answer', views.answer),
    path('register/', UserRegistrationView.as_view(), name='user_registration'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', ProtectedView.as_view(), name="test_protected_view")
]