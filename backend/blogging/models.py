from django.db import models
from django.contrib.auth.models import User

class Blog(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=200)
    body = models.TextField()
    # author = models.CharField(max_length=75)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogs')

    image_url = models.URLField(max_length=500, blank=True, default="https://firebasestorage.googleapis.com/v0/b/blogging-e5f0c.appspot.com/o/blogImages%2FdefaultImage.jpg?alt=media&token=aea70a20-64fd-4a89-9669-8e1b5b8fe8c9")

    def __str__(self):
        return (f"{self.title} {self.created_at}")