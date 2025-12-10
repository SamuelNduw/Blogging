from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

class UserRegistrationViewTest(APITestCase):
    """
    Tests for the UserRegistrationView.
    """
    def setUp(self):
        self.url = reverse('user_registration')
        self.valid_payload = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword123'
        }

    def test_successful_user_registration(self):
        """
        Ensure a new user can be created successfully.
        """
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')
        self.assertIn('user', response.data)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'User registered successfully.')

    def test_registration_with_missing_fields(self):
        """
        Ensure registration fails if required fields are missing.
        """
        invalid_payload = self.valid_payload.copy()
        del invalid_payload['username']
        
        response = self.client.post(self.url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data) # Check for username error

    def test_registration_with_duplicate_username(self):
        """
        Ensure registration fails if the username already exists.
        """
        # Create a user first
        User.objects.create_user(username='testuser', email='another@example.com', password='password')
        
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_registration_with_invalid_email(self):
        """
        Ensure registration fails with an invalid email format.
        """
        invalid_payload = self.valid_payload.copy()
        invalid_payload['email'] = 'not-an-email'
        
        response = self.client.post(self.url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_password_is_not_in_response(self):
        """
        Ensure the user's password is not returned in the registration response.
        """
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotIn('password', response.data.get('user', {}))