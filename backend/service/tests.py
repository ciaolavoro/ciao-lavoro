from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import get_user_model
from django.urls import reverse
from .models import Service, Job, Review
from django.utils import timezone
import datetime

User = get_user_model()

class ServiceTestCase(TestCase):
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
        self.service_data = {
            'user': self.user,
            'profession': 1,
            'city': 'Test City',
            'experience': 5,
            'is_active': True,
        }
        self.service = Service.objects.create(**self.service_data)

    def test_service_rating(self):
        self.assertEqual(self.service.rating(), 0)

    def test_service_str(self):
        expected_string = f"{self.user.username} ({self.service.get_profession_display()})"
        self.assertEqual(str(self.service), expected_string)


class ServiceViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser',
                                            email='joaquin.arregui2002@gmail.com',
                                            password='testpassword',
                                            first_name='Test',
                                            last_name='User',
                                            birth_date= (timezone.now() - datetime.timedelta(days=365*25)).date(),
                                            language= 'English' )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_create_service(self):
        url = reverse('service:service-create')
        data = {
            'profession': 6,
            'city': 'Test City',
            'experience': 5,
            'is_active': True,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Service.objects.count(), 1)
        service = Service.objects.first()
        self.assertEqual(service.city, 'Test City')

    def test_edit_service(self):
        service = Service.objects.create(user=self.user, profession=6, city='Old City', experience=2)
        url = reverse('service:service-edit', kwargs={'service_id': service.id})
        data = {
            'profession': "Mecánico",
            'city': 'New City',
            'experience': 5,
            'is_active': False,
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        service.refresh_from_db()
        self.assertEqual(service.city, 'New City')
        self.assertFalse(service.is_active)

    def test_service_promotion(self):
        service = Service.objects.create(user=self.user, profession=6, city='Old City', experience=2)
        url = reverse('service:service-promotion', kwargs={'service_id': service.id})
        data = {
            'returnURL': 'http://localhost:8000/',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)

    def test_service_promotion_negative(self):
        user = User.objects.create(username='anuser', email='anuser@gmail.com',
                                   password='123rt56kl', first_name='Usuario',
                                   last_name ='De prueba', birth_date = (timezone.now() -
                                   datetime.timedelta(days=365*25)).date(), language= 'Russian')
        service = Service.objects.create(user=user, profession=6, city='Old City', experience=2)
        url = reverse('service:service-promotion', kwargs={'service_id': service.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 400)
        service.refresh_from_db()
        self.assertNotEqual(service.is_promoted,datetime.date.today())

    def test_user_has_service(self):
        service = Service.objects.create(user=self.user, profession=6, city='Test City', experience=5)
        url = reverse('service:has-service', kwargs={'service_id': service.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['user_state'], False)

class ServiceListTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser',
                                            email='joaquin.arregui2002@gmail.com',
                                            password='testpassword', first_name='Test',
                                            last_name='User',
                                            birth_date= (timezone.now() - datetime.timedelta(days=365*25)).date(),
                                            language= 'English' )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.service_data = {
            'user': self.user,
            'profession': 1,
            'city': 'Test City',
            'experience': 5,
            'is_active': True,
        }
        self.service = Service.objects.create(**self.service_data)

    def test_get_service_list(self):
        url = reverse('service:service-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_by_profession(self):
        url = reverse('service:service-list') + '?search_profession=1'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)

    def test_search_by_city(self):
        url = reverse('service:service-list') + '?search_city=Test'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)

    def test_search_by_profession_and_city(self):
        url = reverse('service:service-list') + '?search_profession=1&search_city=Test'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)

class AllProfessionListTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser',
                                            email='joaquin.arregui2002@gmail.com',
                                            password='testpassword',
                                            first_name='Test',
                                            last_name='User',
                                            birth_date= (timezone.now() - datetime.timedelta(days=365*25)).date(),
                                            language= 'English' )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_get_all_professions(self):
        url = reverse('service:service-all-professions')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('professions' in response.json())
        professions = response.json()['professions']
        self.assertTrue(isinstance(professions, list))
        for profession in professions:
            self.assertTrue('id' in profession)
            self.assertTrue('name' in profession)

class AllPromotedListTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser',
                                            email='joaquin.arregui2002@gmail.com',
                                            password='testpassword',
                                            first_name='Test',
                                            last_name='User',
                                            birth_date= (timezone.now() - datetime.timedelta(days=365*25)).date(),
                                            language= 'English' )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.service1 = Service.objects.create(user=self.user,
                                               profession=1,
                                               city='Test City 1',
                                               experience=5,
                                               is_promoted = (timezone.now().date() - datetime.timedelta(days=29)).strftime('%Y-%m-%d'))
        self.review1 = Review.objects.create(user=self.user,
                                            service=self.service1,
                                            description="Test review1",
                                            rating=5)
        self.service2 = Service.objects.create(user=self.user,
                                               profession=2,
                                               city='Test City 2',
                                               experience=3,
                                               is_promoted= (timezone.now().date() - datetime.timedelta(days=32)).strftime('%Y-%m-%d'))
        self.review2 = Review.objects.create(user=self.user,
                                            service=self.service2,
                                            description="Test review21",
                                            rating=3)
        self.review2 = Review.objects.create(user=self.user,
                                            service=self.service2,
                                            description="Test review22",
                                            rating=5)
        self.service3 = Service.objects.create(user=self.user,
                                               profession=3,
                                               city='Test City 3',
                                               experience=4,
                                               is_promoted= (timezone.now().date() - datetime.timedelta(days=1)).strftime('%Y-%m-%d'))
        self.review3 = Review.objects.create(user=self.user,
                                            service=self.service3,
                                            description="Test review3",
                                            rating=3)
        self.service4 = Service.objects.create(user=self.user,
                                               profession=3,
                                               city='Test City 3',
                                               experience=4,
                                               is_promoted= (timezone.now().date() - datetime.timedelta(days=60)).strftime('%Y-%m-%d'))
        self.review4 = Review.objects.create(user=self.user,
                                            service=self.service4,
                                            description="Test review4",
                                            rating=5)

    def test_get_all_promoted(self):
        url = reverse('service:service-all-promotion')
        response = self.client.get(url)
        self.assertTrue('promotedServices' in response.json())
        services = response.json()['promotedServices']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(services), 2)
        self.assertEqual(services[0]['city'],'Test City 1')
        self.assertEqual(services[1]['city'], 'Test City 3')

class ProfessionListTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser',
                                            email='joaquin.arregui2002@gmail.com',
                                            password='testpassword',
                                            first_name='Test',
                                            last_name='User',
                                            birth_date= (timezone.now() - datetime.timedelta(days=365*25)).date(),
                                            language= 'English' )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_get_available_professions(self):
        url = reverse('service:service-professions')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('professions' in response.json())
        professions = response.json()['professions']
        professions = response.json()['professions']
        self.assertTrue(isinstance(professions, list))
        for profession in professions:
            self.assertTrue('id' in profession)
            self.assertTrue('name' in profession)

class UserServiceListTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='joaquin.arregui2002@gmail.com',
                                            password='testpassword',
                                            first_name='Test',
                                            last_name='User',
                                            birth_date= (timezone.now() - datetime.timedelta(days=365*25)).date(),
                                            language= 'English')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.another_user = User.objects.create_user(username='anotheruser',
                                                    email='joseluiscoboariza@gmail.com',
                                                    password='anotherpassword',
                                                    first_name='Another',
                                                    last_name='User',
                                                    birth_date= (timezone.now() - datetime.timedelta(days=365*30)).date(),
                                                    language= 'English' )
        self.service1 = Service.objects.create(user=self.user,
                                               profession=1,
                                               city='Test City 1',
                                               experience=5)
        self.service2 = Service.objects.create(user=self.user,
                                               profession=2,
                                               city='Test City 2',
                                               experience=3)
        self.service3 = Service.objects.create(user=self.another_user,
                                               profession=3,
                                               city='Test City 3',
                                               experience=4)

    def test_get_user_services(self):
        url = reverse('service:user-service-list', kwargs={'user_id': self.user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data)

class JobViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(username='testuser', email='joaquin.arregui2002@gmail.com',
                                                        password='testpassword',
                                                        first_name='Test', last_name='User',
                                                        birth_date= (timezone.now() - datetime.timedelta(days=365*25)).date(),
                                                        language= 'English')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        self.service = Service.objects.create(user=self.user, profession=6, city='Old City', experience=2)
        self.job = Job.objects.create(service=self.service, name='Job 1', estimated_price=50)

    def test_create_job(self):
        url = reverse('service:service-job-create', kwargs={'service_id': self.service.id})
        data = {'name': 'New Job', 'estimated_price': 15}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Job.objects.filter(name='New Job').exists())

    def test_update_job(self):
        url = reverse('service:service-job-edit', kwargs={'job_id': self.job.id})
        data = {'name': 'Updated Job', 'estimated_price': 60}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.job.refresh_from_db()
        self.assertEqual(self.job.name, 'Updated Job')
        self.assertEqual(self.job.estimated_price, 60)

    def test_delete_job(self):
        url = reverse('service:service-job-delete', kwargs={'job_id': self.job.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Job.objects.filter(id=self.job.id).exists())

class ReviewViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='joaquin.arregui2002@gmail.com',
                                            password='testpassword',
                                            first_name='Test',
                                            last_name='User',
                                            birth_date= (timezone.now() - datetime.timedelta(days=365*25)).date(),
                                            language= 'English')
        self.another_user = User.objects.create_user(username='anotheruser',
                                                    email='joseluiscoboariza@gmail.com',
                                                    password='anotherpassword',
                                                    first_name='Another',
                                                    last_name='User',
                                                    birth_date= (timezone.now() - datetime.timedelta(days=365*30)).date(),
                                                    language= 'English' )
        self.token = Token.objects.create(user=self.user)
        self.service = Service.objects.create(user=self.user, profession=6, city='Old City', experience=2)
        self.review = Review.objects.create(user=self.another_user,
                                            service=self.service,
                                            description="Test review",
                                            rating=4)

    def test_get_reviews(self):
        url = reverse('service:service-review', kwargs={'service_id': self.service.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['reviews']), 1)
        self.assertEqual(response.data['rating'], 4)
        self.assertEqual(response.data['total_reviews'], 1)

    def test_post_review(self):
        url = reverse('service:service-review-create', kwargs={'service_id': self.service.id})
        data = {'description': 'New review', 'rating': 5}
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Review.objects.count(), 2)

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Ya has dejado una reseña para este servicio")
        self.assertEqual(Review.objects.count(), 2)


class UserHasServiceTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='joaquin.arregui2002@gmail.com',
                                            password='testpassword', first_name='Test',
                                            last_name='User',
                                            birth_date= (timezone.now() - datetime.timedelta(days=365*25)).date(),
                                            language= 'English')
        self.token = Token.objects.create(user=self.user)
        self.service = Service.objects.create(user=self.user, profession=6, city='Old City', experience=2)

    def test_user_has_service(self):

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get(reverse('service:has-service', args=[self.service.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertIn('user_state', response_data)
        expected_state = self.user != self.service.user
        self.assertEqual(response_data['user_state'], expected_state)