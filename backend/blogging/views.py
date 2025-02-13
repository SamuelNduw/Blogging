from .models import Blog
from .serializer import BlogSerializer
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

import os
from dotenv import load_dotenv

from openai import OpenAI
from django.http.response import StreamingHttpResponse


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
    
    def delete(self, request, *args, **kwargs):
        try:
            id = request.query_params["id"]
            instance = Blog.objects.get(id=id)
        except Blog.DoesNotExist:
            return Response({"error": "Object not found"}, status=status.HTTP_404_NOT_FOUND)
        
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        

# class BlogRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Blog.objects.all()
#     serializer_class = BlogSerializer

load_dotenv()

client = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY")
)
def generate_response(question):
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": question}],
        stream=True
    )

    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            yield(chunk.choices[0].delta.content)

def answer(request):
    message = "give me 5 ideas i can do using a chatbot"
    response = StreamingHttpResponse(generate_response(message), status=200, content_type="text/plain")
    return response