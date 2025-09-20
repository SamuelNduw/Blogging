from django.urls import path
from .views import GenerateImage, GenerateBlogVariations, TextToSpeechAPI
from . import views

urlpatterns = [
    path("generate_image", GenerateImage.as_view(), name="generate_image"),
    path("generate_blog_variations", GenerateBlogVariations.as_view(), name="generate_blog_variations"),
    path("answer", views.answer),
    path("text_to_speech", TextToSpeechAPI.as_view(), name="text_to_speech"),
]
