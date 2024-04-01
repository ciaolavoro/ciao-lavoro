import os
import time
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.urls import reverse
from rest_framework import status
import datetime
from django.conf import settings
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.admin.sites import AdminSite
from django.test import RequestFactory
from .admin import UserAdmin
from .models import User


User = get_user_model()

class UserTestCase(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'joaquin.arregui2002@gmail.com',
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User',
            'birth_date': (timezone.now() - datetime.timedelta(days=365*25)).date(),
            'language': 'English',
        }
        self.user = User.objects.create_user(**self.user_data)
        self.client = APIClient()

    def test_user_clean(self):
        user = User(**self.user_data)
        user.clean()
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

    def test_non_authenticated_user(self):
        response = self.client.get(reverse('user:authenticated'))
        self.assertFalse(response.json()['isAuthenticated'])

class RegisterViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.base_user_data = {
            'username': 'newuser',
            'firstName': 'New',
            'lastName': 'User',
            'email': 'joseluiscoboariza@gmail.com',
            'password': 'NewPass2024#',
            'birthdate': '1990-01-01',
            'language': 'English',
        }

    def test_user_registration_success(self):
        response = self.client.post(reverse('user:register'), self.base_user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_empty_field(self):
        for field in self.base_user_data:
            user_data = self.base_user_data.copy()
            user_data[field] = ''
            response = self.client.post(reverse('user:register'), user_data)
            self.assertNotEqual(response.status_code, status.HTTP_200_OK, f"{field} is empty but registration succeeded")

    def test_empty_birthdate(self):
        user_data = self.base_user_data.copy()
        user_data['birthdate'] = ''
        response = self.client.post(reverse('user:register'), user_data)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK, f"{'field'} is empty but registration succeeded")

    def test_wrong_email(self):
        user_data = self.base_user_data.copy()
        user_data['email'] = 'notanemail'
        response = self.client.post(reverse('user:register'), user_data)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_inexistent_email(self):
        user_data = self.base_user_data.copy()
        user_data['email'] = 'inexistent@email.com'
        time.sleep(2)
        response = self.client.post(reverse('user:register'), user_data)
        self.assertEqual(response.json()['status'], '500')

    def test_future_birth_date(self):
        user_data = self.base_user_data.copy()
        tomorrow = (timezone.now().date() + datetime.timedelta(days=1)).strftime('%Y-%m-%d')
        user_data['birthdate'] = tomorrow
        response = self.client.post(reverse('user:register'), user_data)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK, "Age validation for younger than 16 failed")

    def test_age_younger_than_16(self):
        user_data = self.base_user_data.copy()
        sixteen_years_ago = (timezone.now().date() - datetime.timedelta(days=14*365)).strftime('%Y-%m-%d')
        user_data['birthdate'] = sixteen_years_ago
        response = self.client.post(reverse('user:register'), user_data)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK, "Age validation for younger than 16 failed")

    def test_age_older_than_80(self):
        user_data = self.base_user_data.copy()
        eighty_years_ago = (timezone.now().date() - datetime.timedelta(days=81*365)).strftime('%Y-%m-%d')
        user_data['birthdate'] = eighty_years_ago
        response = self.client.post(reverse('user:register'), user_data)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK, "Age validation for older than 80 failed")

    def test_repeated_username(self):
        self.client.post(reverse('user:register'), self.base_user_data)
        response = self.client.post(reverse('user:register'), self.base_user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_wrong_date_format(self):
        user_data = self.base_user_data.copy()
        user_data['birthdate'] = '19900101'
        response = self.client.post(reverse('user:register'), user_data)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK, "Birthdate format validation failed")

    def test_common_password(self):
        user_data = self.base_user_data.copy()
        psw = 'password'
        user_data['password'] = psw
        response = self.client.post(reverse('user:register'), user_data)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK, "Common password validation failed")

class UserListViewTests(UserTestCase):
    def test_user_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('user:user-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)

class UserDetailsViewTests(UserTestCase):
    def test_user_details(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('user:user-details', kwargs={'user_id': self.user.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['username'], self.user.username)

class UserProfileViewTests(UserTestCase):
    def test_get_update_profile(self):
        token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.get(reverse('user:profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['username'], self.user.username)
        update_data = {
            'username': 'UpdatedUsername',
            'first_name': 'UpdatedName',
            'last_name': 'UpdatedLastName',
            'email': 'fran.antonio2801@gmail.com',
            'language': 'UpdatedLanguage',
            'birth_date': '1950-12-12',
            }
        response = self.client.put(reverse('user:profile'), update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'UpdatedUsername')
        self.assertEqual(self.user.first_name, 'UpdatedName')
        self.assertEqual(self.user.last_name, 'UpdatedLastName')
        self.assertEqual(self.user.email, 'fran.antonio2801@gmail.com')
        self.assertEqual(self.user.language, 'UpdatedLanguage')
        self.assertEqual(self.user.birth_date, datetime.date(1950, 12, 12))

    def test_update_profile_image(self):
        default_image_path = os.path.join(settings.BASE_DIR, 'users', 'default.png').replace('\\','/')
        with open(default_image_path, 'rb') as image:
            image_data = image.read()
        image_file = SimpleUploadedFile('new_image.jpg', image_data, content_type='image/jpeg')
        update_data = {
            'username': '',
            'first_name': '',
            'last_name': '',
            'email': '',
            'language': '',
            'birth_date': '',
            'image': image_file,
        }
        token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.put(reverse('user:profile'), update_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK, "Failed to update user profile image")
        self.user.refresh_from_db()
        self.assertTrue(self.user.image, "User image was not updated")
        self.assertIn('new_image', self.user.image.name, "Updated image has incorrect filename")


class UserProfileUpdateTests(UserTestCase):
    def setUp(self):
        super().setUp()
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_update_empty_field(self):
        username = self.user.username
        first_name = self.user.first_name
        last_name = self.user.last_name
        email = self.user.email
        language = self.user.language
        birth_date = self.user.birth_date
        update_data = {
            'username': '',
            'first_name': '',
            'last_name': '',
            'email': '',
            'language': '',
            'birth_date': '',
        }
        response = self.client.put(reverse('user:profile'), update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user.username, username)
        self.assertEqual(self.user.first_name, first_name)
        self.assertEqual(self.user.last_name, last_name)
        self.assertEqual(self.user.email, email)
        self.assertEqual(self.user.language, language)
        self.assertEqual(self.user.birth_date, birth_date)

    def test_update_wrong_email_format(self):
        update_data = {
            'username': '',
            'first_name': '',
            'last_name': '',
            'email': 'wrongemailformat',
            'language': '',
            'birth_date': '',
        }
        response = self.client.put(reverse('user:profile'), update_data, format='json')
        self.assertNotEqual(response.status_code, status.HTTP_200_OK, "Email format validation failed")

    def test_update_inexistent_email(self):
        update_data = {
            'username': '',
            'first_name': '',
            'last_name': '',
            'email': 'inexistent@email.com',
            'language': '',
            'birth_date': '',
        }
        response = self.client.put(reverse('user:profile'), update_data, format='json')
        self.assertEqual(response.json()['status'], '500')

    def test_update_age_out_of_bounds(self):
        update_data = {
            'username': '',
            'first_name': '',
            'last_name': '',
            'email': '',
            'language': '',
            'birth_date': (timezone.now() - datetime.timedelta(days=365*15)).strftime('%Y-%m-%d'),
        }
        response = self.client.put(reverse('user:profile'), update_data, format='json')
        self.assertNotEqual(response.status_code, status.HTTP_200_OK, "Age lower bound validation failed")
        update_data['birth_date'] = (timezone.now() - datetime.timedelta(days=365*81)).strftime('%Y-%m-%d')
        response = self.client.put(reverse('user:profile'), update_data, format='json')
        self.assertNotEqual(response.status_code, status.HTTP_200_OK, "Age upper bound validation failed")

    def test_update_wrong_date_format(self):
        update_data = {
            'username': '',
            'first_name': '',
            'last_name': '',
            'email': '',
            'language': '',
            'birth_date': '20240101',
        }
        response = self.client.put(reverse('user:profile'), update_data, format='json')
        self.assertNotEqual(response.status_code, status.HTTP_200_OK, "Birthdate format validation failed")

class UserAdminTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.request_factory = RequestFactory()
        self.user_admin = UserAdmin(model=User, admin_site=self.site)

    def test_user_password_hashing_on_save(self):
        user = User.objects.create(username='testuser2', first_name='test', last_name='user', email='test2@example.com', password='testpassword', birth_date='1950-12-12')
        self.assertFalse(user.password.startswith('pbkdf2_sha256$'))
        request = self.request_factory.get('/admin/auth/user/')
        self.user_admin.save_model(request, user, None, None)
        user = User.objects.get(username='testuser2')
        self.assertTrue(user.password.startswith('pbkdf2_sha256$'))