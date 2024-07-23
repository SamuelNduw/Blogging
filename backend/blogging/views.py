from .models import Blog
from .serializer import serialize_blogs
from django.http import JsonResponse

def blog_list(request):
    blogs = Blog.objects.all()
    return JsonResponse(serialize_blogs(blogs), safe=False)
