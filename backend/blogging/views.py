from .models import Blog
from .serializer import BlogSerializer, BlogSerializer2, UserRegistrationSerializer, CustomTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
import json

import os
from dotenv import load_dotenv

from openai import OpenAI
from django.http.response import StreamingHttpResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt

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
    
class BlogCreateView(generics.CreateAPIView):
    serializer_class = BlogSerializer2
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        
class SendImage(APIView):
    def get(self, request):
        try:
            with open("./blogging/gemini-native-image.png", 'rb') as f:
                image_data = f.read()
        except FileNotFoundError:
            return HttpResponse(status=404)
        
        return HttpResponse(image_data, content_type='image/png')

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

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'Authenticated access granted'})