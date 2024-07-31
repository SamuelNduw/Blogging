from .models import Blog
from typing import Iterable, List, Dict, Any
from rest_framework import serializers

def serialize_blogs(blogs: Iterable[Blog]) -> List[Dict[str, Any]]:
    data = []
    for blog in blogs:
        data.append({
            'title': blog.title,
            'body': blog.body,
            'author': blog.author,
            'created_at': blog.created_at,
        })
    return data

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ('id', 'title', 'body', 'author', 'created_at') 