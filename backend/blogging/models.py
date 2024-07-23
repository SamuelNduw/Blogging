from django.db import models

class Blog(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=200)
    body = models.TextField()
    author = models.CharField(max_length=75)

    def __str__(self):
        return (f"{self.title} {self.created_at}")