from django.http import HttpResponse, StreamingHttpResponse
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView 
from rest_framework import status
import json

import os
from dotenv import load_dotenv
from openai import OpenAI
from google import genai
from google.genai import types
from pydantic import BaseModel
from PIL import Image
from io import BytesIO
from tempfile import NamedTemporaryFile
from django.utils.text import slugify

import uuid
from datetime import datetime

import firebase_admin
from firebase_admin import storage
# Ensure Firebase app is initialized if configured; if not, continue gracefully
try:
    from firebase_admin import get_app
    get_app()
except Exception:
    try:
        from . import firebase_config  # initializes firebase app using service account if available
    except Exception:
        pass

load_dotenv()

class ImagePrompt(BaseModel):
    prompt: str

class Version(BaseModel):
    blog_version_no: int
    blog_content: str

class BlogVersions(BaseModel):
    variations: list[Version]


class GenerateImage(APIView):
    parser_classes = [JSONParser]

    def post(self, request):
        try:
            # Extract title and content from request body
            title = request.data.get('title')
            tone = request.data.get('tone')
            art_style = request.data.get('art_style')

            if not title or not tone or not art_style:
                return Response({"error": "The following: 'title', 'tone' and 'art_style' are required."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Build the prompt
            blogInfo = f"""
                        <blogTitle>{title}</blogTitle>
                        <blogTone>{tone}</blogTone>
                        <artStyle>{art_style}</artStyle>
                        """

            # Get API key from environment
            openai_api_key = os.getenv('OPENAI_API_KEY')
            gemini_api_key = os.getenv('GOOGLE_GEMINI_API2')

            if not openai_api_key:
                return Response({"error": "OpenAI API key not found."},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            if not gemini_api_key:
                return Response({"error": "Google Gemini API key not found."},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            openai_client = OpenAI(api_key=openai_api_key)

            prompt_generation_response = openai_client.responses.parse(
                model='gpt-4o',
                input=[
                    {
                        "role": "system",
                        "content": """
                                    You are an image generation prompter.
                                    Use the following variables to create a detailed image prompt: blog title, tone, art style.
                                    The variables will be provided in XML tags.
                                    Based on these, write a single detailed visual prompt that describes a scene or 
                                    composition fitting for a thumbnail. The prompt should guide the image generation model to 
                                    create an eye-catching image that visually reflects the blog's theme and tone.
                                    Only give the prompt, nothing else!
                                    """
                    },
                    {
                        "role": "user",
                        "content": blogInfo
                    }
                ],
                text_format=ImagePrompt,
            )

            image_generation_prompt = prompt_generation_response.output_parsed
            print(f"----------\n{image_generation_prompt}\n----------")

            # image_generation_prompt.model_dump()
            image_generation_prompt = image_generation_prompt.prompt

            # Initialize Google GenAI client
            client = genai.Client(api_key=gemini_api_key)

            # Generate image
            response = client.models.generate_content(
                model="gemini-2.0-flash-preview-image-generation",
                contents=image_generation_prompt,
                config=types.GenerateContentConfig(
                    response_modalities=['TEXT', 'IMAGE']
                )
            )

            # Process the response
            for part in response.candidates[0].content.parts:
                if part.inline_data:
                    #Convert to Pillow Image
                    image = Image.open(BytesIO(part.inline_data.data))

                    # Convert image to bytes
                    image_io = BytesIO()
                    image.save(image_io, format='PNG')
                    image_io.seek(0)

                    return HttpResponse(image_io.read(), content_type='image/png')

            return Response({"error": "No image part in response"}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except Exception as e:
            print("Error:", e)
            return Response({"error": "Failed to generate image.", "details": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenerateBlogVariations(APIView):
    parser_classes = [JSONParser]

    def post(self, request):
        try:

            # Extract title and content from request body
            title = request.data.get('title')
            content = request.data.get('content')
            tone = request.data.get('tone')

            if not title or not content or not tone:
                return Response({"error": "Both 'title', 'content' and 'tone' are required."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Build the prompt
            prompt = f"""
            <blogTitle>{title}</blogTitle> 
            <blogContent>{content}</blogContent>
            <blogTone>{tone}</blogTone>
            """


            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                return Response({"error": "No OpenAI API key provided."},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            client = OpenAI(api_key=api_key)

            response = client.responses.parse(
                model='gpt-4o',
                input=[
                    {
                        "role": "system",
                        "content": """
                                    You are a blog creation assistant. 
                                    The blog title, content and tone will be provided in xml in tags.
                                    Give three versions of the blog provided (only the content, not the title). 
                                    Return exactly this JSON format:
                                    {
                                    "variations": [
                                        {"blog_version_no": 1, "blog_content": "..."},
                                        {"blog_version_no": 2, "blog_content": "..."},
                                        {"blog_version_no": 3, "blog_content": "..."}
                                    ]
                                    }
                                    """
                    },
                    {
                        "role": "user",
                        "content": prompt
                    },
                ],
                text_format=BlogVersions,
            )

            blogs = response.output_parsed
            print(blogs)

            # Convert Pydantic model to a Python dictionary
            blogs = blogs.model_dump()
            return Response({"versions": blogs}, status=status.HTTP_200_OK)

        except Exception as e:
            print("Error:", e)
            return Response({"error": "Failed to generate blog variations.", "details": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TextToSpeechAPI(APIView):
    parser_classes = [JSONParser]

    def post(self, request):
        # Expects: { blog_id: number, voice?: string, format?: 'mp3'|'wav' }
        try:
            from blogging.models import Blog
        except Exception:
            return Response({'error': 'Blog model not available'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        blog_id = request.data.get('blog_id')
        voice = request.data.get('voice', 'alloy')
        audio_format = request.data.get('format', 'mp3')

        if not blog_id:
            return Response({'error': "'blog_id' is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog not found'}, status=status.HTTP_404_NOT_FOUND)

        if getattr(blog, 'audio_url', ''):
            return Response({'audio_url': blog.audio_url}, status=status.HTTP_200_OK)

        text = (blog.body or '').strip()
        if not text:
            return Response({'error': 'Blog has no content to synthesize'}, status=status.HTTP_400_BAD_REQUEST)

        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            return Response({'error': 'OpenAI API key not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Preflight: ensure Firebase is configured to avoid wasting TTS
        try:
            if not firebase_admin._apps:
                raise ValueError("Firebase not initialized: provide service account or env vars.")
            _ = storage.bucket()  # may raise if app/bucket misconfigured
        except Exception as e:
            return Response(
                {
                    'error': 'Firebase is not configured',
                    'details': str(e),
                    'how_to_fix': 'Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS and FIREBASE_STORAGE_BUCKET.'
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # 1) Synthesize speech to a temp file
        try:
            client = OpenAI(api_key=api_key)
            file_suffix = f".{audio_format}" if audio_format in ('mp3', 'wav') else '.mp3'
            with NamedTemporaryFile(suffix=file_suffix, delete=False) as tmp:
                with client.audio.speech.with_streaming_response.create(
                    model="gpt-4o-mini-tts",
                    voice=voice,
                    input=text,
                    response_format=audio_format if audio_format in ('mp3', 'wav') else 'mp3',
                ) as response:
                    response.stream_to_file(tmp.name)
                tmp.flush()
                tmp.seek(0)
                audio_bytes = tmp.read()
        except Exception as e:
            return Response({'error': 'TTS generation failed', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 2) Upload to Firebase Storage and make public
        try:
            bucket = storage.bucket()
            safe_title = slugify(blog.title)[:50] or 'blog'
            unique_name = f"blogAudio/{safe_title}-{uuid.uuid4().hex[:8]}{file_suffix}"
            blob = bucket.blob(unique_name)
            content_type = 'audio/mpeg' if file_suffix == '.mp3' else 'audio/wav'
            blob.upload_from_string(audio_bytes, content_type=content_type)
            try:
                blob.make_public()
                audio_url = blob.public_url
            except Exception:
                # Fallback to signed URL for 10 years
                from datetime import timedelta
                audio_url = blob.generate_signed_url(expiration=timedelta(days=3650), method='GET')

            blog.audio_url = audio_url
            blog.save(update_fields=['audio_url'])
        except Exception as e:
            return Response({'error': 'Failed to upload audio to storage', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'audio_url': blog.audio_url}, status=status.HTTP_201_CREATED)


openaiClient = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY")
)
def generate_response(question):
    stream = openaiClient.chat.completions.create(
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
