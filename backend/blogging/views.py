from .models import Blog
from .serializer import BlogSerializer, BlogSerializer2, UserRegistrationSerializer, CustomTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

import json
import os
from dotenv import load_dotenv

from openai import OpenAI
from django.http.response import StreamingHttpResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt

import uuid
from .firebase_config import get_bucket

# Register the user
class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'user': serializer.data,
            'message': 'User registered successfully.'
        }, status=status.HTTP_201_CREATED)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
class BlogGet(APIView):
    def get(self, request):
        Blogs = Blog.objects.all().order_by('-created_at')
        serializer = BlogSerializer2(Blogs, many=True)
        return Response(serializer.data)
    
class GetLatestBlogs(APIView):
    def get(self, request):
        latestBlogs = Blog.objects.order_by('-created_at')[:4]
        serializer = BlogSerializer2(latestBlogs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class BlogCreateView(generics.CreateAPIView):
    serializer_class = BlogSerializer2
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class BlogList(APIView):
    def get(self, request):
        Blogs = Blog.objects.all().order_by('-created_at')
        serializer = BlogSerializer(Blogs, many=True)
        return Response(serializer.data)

    def post(self, request):
        if isinstance(request.data, list):
            serializer = BlogSerializer(data=request.data, many=True)
        else:
            serializer = BlogSerializer2(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, *args, **kwargs):
        try:
            id = request.query_params["id"]
            instance = Blog.objects.get(id=id)
        except Blog.DoesNotExist:
            return Response({"error": "Object not found"}, status=400)
        
        serializer = BlogSerializer(instance, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, blog_id):
        try:
            instance = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({"error": "Object not found"}, status=status.HTTP_404_NOT_FOUND)
        
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class BlogDeleteView(generics.DestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer2
    permission_classes = [permissions.IsAuthenticated]

class BulkBlogDeleteView(APIView):
    def delete(self, request, *args, **kwargs):
        ids = request.data.get("ids", [])
        if not ids:
            return Response({"detail", "No IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        deleted_count, _ = Blog.objects.filter(id__in=ids).delete()
        return Response({"deleted": deleted_count}, status=status.HTTP_200_OK)
        
load_dotenv()

client = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY")
)
def generate_response(question):
    stream = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": question}],
        stream=True
    )

    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            yield(chunk.choices[0].delta.content)

@csrf_exempt
def answer(request):
    data = json.loads(request.body)
    print(data)
    message = data["message"]
    response = StreamingHttpResponse(generate_response(message), status=200, content_type="text/plain")
    return response

class UserBlogsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_blogs = Blog.objects.filter(author=request.user).order_by('-created_at')
            serializer = BlogSerializer2(user_blogs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch user blogs', 'details': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            user_blogs_count = Blog.objects.filter(author=user).count()
            
            profile_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name or '',
                'last_name': user.last_name or '',
                'date_joined': user.date_joined,
                'is_staff': user.is_staff,
                'is_admin': user.is_superuser,
                'blog_count': user_blogs_count,
            }
            
            return Response(profile_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch user profile', 'details': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class BlogInlineImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file")

        if not file_obj:
            return Response(
                {"detail": "No file provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        bucket = get_bucket()

        ext = file_obj.name.split(".")[-1].lower()
        filename = f"blog_inline/{uuid.uuid4()}.{ext}"

        blob = bucket.blob(filename)
        blob.upload_from_file(file_obj, content_type=file_obj.content_type)

        blob.make_public()

        return Response({"url": blob.public_url}, status=status.HTTP_201_CREATED)
