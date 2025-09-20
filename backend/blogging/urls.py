from django.urls import path
from . import views
from .views import (
    BlogList, UserRegistrationView, GetLatestBlogs, BlogCreateView, BlogGet, 
    CustomTokenObtainPairView, UserBlogsView, UserProfileView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('blogs/', BlogList.as_view(), name='blog-crud'),
    path('blogs/<int:blog_id>/', BlogList.as_view(), name='delete-blog'),

    path('blogs/create', BlogCreateView.as_view(), name='create-blog'),
    path('blogs/get', BlogGet.as_view(), name='get-all-blog'),
    path('blogs/get-latest', GetLatestBlogs.as_view(), name='get-lastest-blogs'),
    path('blogs/user', UserBlogsView.as_view(), name='get-user-blogs'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),

    path('answer', views.answer),
    path('register', UserRegistrationView.as_view(), name='user_registration'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]