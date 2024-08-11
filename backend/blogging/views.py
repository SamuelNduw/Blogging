from .models import Blog
from .serializer import BlogSerializer
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class BlogList(APIView):
    def get(self, request):
        Blogs = Blog.objects.all().order_by('-created_at')
        serializer = BlogSerializer(Blogs, many=True)
        return Response(serializer.data)

    def post(self, request):
        if isinstance(request.data, list):
            serializer = BlogSerializer(data=request.data, many=True)
        else:
            serializer = BlogSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class BlogRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
