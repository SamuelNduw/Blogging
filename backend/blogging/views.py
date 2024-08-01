from .models import Blog
from .serializer import BlogSerializer
from rest_framework import generics
from .serializer import serialize_blogs
from django.http import JsonResponse


class BlogListCreateView(generics.ListCreateAPIView):
    serializer_class = BlogSerializer
    queryset = Blog.objects.all()

class BlogRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
