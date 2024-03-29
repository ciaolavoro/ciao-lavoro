# tests.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.urls import reverse
from rest_framework import status
import datetime
from django.utils import timezone

User = get_user_model()

class UserTestCase(TestCase):
    def setUp(self):
        # Creating a user for testing authentication
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User',
            'birth_date': (timezone.now() - datetime.timedelta(days=365*25)).date(),
            'language': 'English',
        }
        self.user = User.objects.create_user(**self.user_data)
        self.client = APIClient()

    def test_user_clean(self):
        # Test validations in User model's clean method
        user = User(**self.user_data)
        user.clean()  # This should not raise any ValidationError
        self.assertEqual(user.username, self.user_data['username'])

class LoginViewTests(UserTestCase):
    def test_login_success(self):
        response = self.client.post(reverse('user:login'), {
            'username': self.user_data['username'],
            'password': self.user_data['password'],
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn('token', response.json())

    def test_login_wrong_username(self):
        response = self.client.post(reverse('user:login'), {
            'username': 'worngusername',
            'password': self.user_data['password'],
        })
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_login_wrong_password(self):
        response = self.client.post(reverse('user:login'), {
            'username': self.user_data['username'],
            'password': 'wrongpassword',
        })
        self.assertEqual(response.json()['status'], '0')

class AuthenticatedViewTests(UserTestCase):
    def test_authenticated_user(self):
        token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.get(reverse('user:authenticated'))
        self.assertTrue(response.json()['isAuthenticated'])

class RegisterViewTests(TestCase):
    def test_user_registration(self):
        client = APIClient()
        user_data = {
            'username': 'newuser',
            'firstName': 'New',
            'lastName': 'User',
            'email': 'newuser@example.com',
            'password': 'NewPass2024#',
            'birthdate': '1990-01-01',
            'language': 'English',
        }
        response = client.post(reverse('user:register'), user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class UserListViewTests(UserTestCase):
    def test_user_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('user:user-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)  # Only one user in the system

class UserDetailsViewTests(UserTestCase):
    def test_user_details(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('user:user-details', kwargs={'user_id': self.user.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['username'], self.user.username)

class UserProfileViewTests(UserTestCase):
    def test_get_update_profile(self):
        token, created = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.get(reverse('user:profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['username'], self.user.username)
        username = self.user.username
        first_name = self.user.first_name
        last_name = self.user.last_name
        email = self.user.email
        language = self.user.language
        birth_date = self.user.birth_date
        update_data = {
            'username': '',
            'first_name': 'UpdatedName',
            'last_name': '',
            'email': '',
            'language': '',
            'birth_date': '',
            }
        response = self.client.put(reverse('user:profile'), update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, username)
        self.assertNotEqual(self.user.first_name, first_name)
        self.assertEqual(self.user.first_name, 'UpdatedName')
        self.assertEqual(self.user.last_name, last_name)
        self.assertEqual(self.user.email, email)
        self.assertEqual(self.user.language, language)
        self.assertEqual(self.user.birth_date, birth_date)
