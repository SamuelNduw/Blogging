from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogging', '0003_alter_blog_author'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='audio_url',
            field=models.URLField(blank=True, default='', max_length=500),
        ),
    ]

