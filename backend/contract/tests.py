from django.utils import timezone
import datetime
from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from .models import Contract
from user.models import User
from service.models import Service
# Create your tests here.
User = get_user_model()
class ContractTestCase(TestCase):
    def setUp(self):
        self.user_data1 = {
            'username': 'testuser1',
            'email': 'test@example.com',
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User',
            'birth_date': (timezone.now() - datetime.timedelta(days=365*25)).date(),
            'language': 'English',
        }
        self.user1 = User.objects.create_user(**self.user_data1)
        self.user_data2 = {
            'username': 'testuser2',
            'email': 'test@example.com',
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User',
            'birth_date': (timezone.now() - datetime.timedelta(days=365*25)).date(),
            'language': 'English',
        }
        self.user2 = User.objects.create_user(**self.user_data2)
        self.service_data = {
            'user': self.user1,
            'profession': 2,
            'city': 'Sevilla',
            'experience': 3,
            'is_active': True
        }
        self.service = Service.objects.create(**self.service_data)
        self.service2_data = {
            'user': self.user1,
            'profession': 1,
            'city': 'Sevilla',
            'experience': 3,
            'is_active': True
        }
        self.service = Service.objects.create(**self.service2_data)
        self.service3_data = {
            'user': self.user1,
            'profession': 3,
            'city': 'Sevilla',
            'experience': 3,
            'is_active': True
        }
        self.service = Service.objects.create(**self.service3_data)
        self.contract_data={
            'worker': self.user1,
            'client': self.user2,
            'accept_worker':True,
            'accept_client':False,
            'description':'descristion',
            'description_cancelation':'',
            'initial_date': (timezone.now() + datetime.timedelta(days=10)).strftime('%Y-%m-%dT%H:%M'),
            'end_date': (timezone.now() + datetime.timedelta(days=11)).strftime('%Y-%m-%dT%H:%M'),
            'cost': 4,
            'status': 1,
            'service': self.service
        }
        self.contract = Contract.objects.create(**self.contract_data)
        self.client = APIClient()

    def test_contract_clean(self):
        contract = Contract(**self.contract_data)
        contract.clean()
        self.assertEqual(contract.description, self.contract_data['description'])

class CreateViewTests(TestCase):
    def setUp(self):
        self.user_data1 = {
            'username': 'testuser1',
            'email': 'test@example.com',
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User',
            'birth_date': (timezone.now() - datetime.timedelta(days=365*25)).date(),
            'language': 'English',
        }
        self.user1 = User.objects.create_user(**self.user_data1)
        self.user_data2 = {
            'username': 'testuser2',
            'email': 'test@example.com',
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User',
            'birth_date': (timezone.now() - datetime.timedelta(days=365*25)).date(),
            'language': 'English',
        }
        self.user2 = User.objects.create_user(**self.user_data2)
        
        self.service_data = {
            'user': self.user1,
            'profession': 2,
            'city': 'Sevilla',
            'experience': 3,
            'is_active': True
        }
        self.service = Service.objects.create(**self.service_data)
        self.service2_data = {
            'user': self.user1,
            'profession': 1,
            'city': 'Sevilla',
            'experience': 3,
            'is_active': True
        }
        self.service2 = Service.objects.create(**self.service2_data)
        self.service3_data = {
            'user': self.user1,
            'profession': 3,
            'city': 'Sevilla',
            'experience': 3,
            'is_active': True
        }
        self.service3 = Service.objects.create(**self.service3_data)
        self.client = APIClient()
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.base_contract_data = {
            'worker': self.user1,
            'accept_worker':True,
            'accept_client':False,
            'description':'descristion',
            'initial_date': (timezone.now() + datetime.timedelta(days=10)).strftime('%Y-%m-%dT%H:%M'),
            'end_date': (timezone.now() + datetime.timedelta(days=12)).strftime('%Y-%m-%dT%H:%M'),
            'cost': 2
        }
    def test_contract_creation_success(self):
        response = self.client.post(reverse('contracts:contract-create',kwargs={'service_id': self.service2.id}), self.base_contract_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
class ContractListViewTests(ContractTestCase):
    def test_contract_list(self):
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.get(reverse('contracts:user-contracts',kwargs={'cow_id': 2}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)

class ContractDetailViewTests(ContractTestCase):
    def test_contract_details(self):
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.get(reverse('contracts:contract-detail', kwargs={'contract_id': str(self.contract.id)}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['description'], self.contract.description)

class ContractUpdateTests(ContractTestCase):
    def test_get_update_contract(self):
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.get(reverse('contracts:contract-detail',kwargs={'contract_id': self.contract.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['description'], self.contract.description)
        update_data = {
            'description':'nuevadescristion',
            'initial_date': (timezone.now() + datetime.timedelta(days=2)).strftime('%Y-%m-%dT%H:%M'),
            'end_date': (timezone.now() + datetime.timedelta(days=3)).strftime('%Y-%m-%dT%H:%M'),
            'cost': '5'
        }
        response = self.client.put(reverse('contracts:contract-edit',kwargs={'contract_id': 1}), update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.contract.refresh_from_db()
        self.assertEqual(self.contract.accept_worker, False)
        self.assertEqual(self.contract.accept_client, True)
        self.assertEqual(self.contract.initial_date, (timezone.now() + datetime.timedelta(days=2)).replace(second=0, microsecond=0))
        self.assertEqual(self.contract.end_date,(timezone.now() + datetime.timedelta(days=3)).replace(second=0, microsecond=0))
        self.assertEqual(self.contract.description, 'nuevadescristion')
        self.assertEqual(self.contract.cost, 5)

class ContractDeleteTests(ContractTestCase):
    def test_delete_contract(self):
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.delete(reverse('contracts:contract-delete',kwargs={'contract_id': self.contract.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('contracts:contract-detail',kwargs={'contract_id': self.contract.id}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class ContractCancelTests(ContractTestCase):

    def test_get_cancel_contract_client(self):
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.assertEqual(self.contract.description_cancelation, '')
        cancelation_data = {
            'description':'test description',
        }
        response = self.client.put(reverse('contracts:contract-cancel',kwargs={'contract_id': 1}), cancelation_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.contract.refresh_from_db()
        self.assertEqual(self.contract.description_cancelation, 'test description')
        self.assertEqual(response.json()["refund"], "0")

    def test_get_cancel_contract_worker(self):
        token, _ = Token.objects.get_or_create(user=self.user1)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.assertEqual(self.contract.description_cancelation, '')
        self.contract.initial_date = timezone.now() + datetime.timedelta(days=1)
        self.contract.save()
        cancelation_data = {
            'description':'test description',
        }
        response = self.client.put(reverse('contracts:contract-cancel',kwargs={'contract_id': 1}), cancelation_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.contract.refresh_from_db()
        self.assertEqual(self.contract.description_cancelation, 'test description')
        self.assertEqual(response.json()["refund"], "0")

    def test_get_cancel_contract(self):
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.assertEqual(self.contract.description_cancelation, '')
        self.contract.initial_date = timezone.now() + datetime.timedelta(days=1)
        self.contract.save()
        cancelation_data = {
            'description':'test description',
        }
        response = self.client.put(reverse('contracts:contract-cancel',kwargs={'contract_id': 1}), cancelation_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.contract.refresh_from_db()
        self.assertEqual(self.contract.description_cancelation, 'test description')
        self.assertEqual(response.json()["refund"], "0")

    def test_get_cancel_contract_without_description(self):
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.assertEqual(self.contract.description_cancelation, '')
        cancelation_data = {
            'description':'',
        }
        response = self.client.put(reverse('contracts:contract-cancel',kwargs={'contract_id': 1}), cancelation_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_get_cancel_contract_long_description(self):
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.assertEqual(self.contract.description_cancelation, '')
        cancelation_data = {
            'description':'''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaa''',
        }
        response = self.client.put(reverse('contracts:contract-cancel',kwargs={'contract_id': 1}), cancelation_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_cancel_contract_without_permission(self):
        user_data = {
            'username': 'testuser3',
            'email': 'test@example.com',
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User',
            'birth_date': (timezone.now() - datetime.timedelta(days=365*25)).date(),
            'language': 'English',
        }
        user = User.objects.create_user(**user_data)
        token, _ = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.assertEqual(self.contract.description_cancelation, '')
        cancelation_data = {
            'description':'Prueba',
        }
        response = self.client.put(reverse('contracts:contract-cancel',kwargs={'contract_id': 1}), cancelation_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_cancel_finished_contract(self):
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.assertEqual(self.contract.description_cancelation, '')
        self.contract.initial_date = timezone.now() + datetime.timedelta(days=1)
        self.contract.status = 4
        self.contract.save()
        cancelation_data = {
            'description':'test description',
        }
        response = self.client.put(reverse('contracts:contract-cancel',kwargs={'contract_id': 1}), cancelation_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_cancel_paid_contract(self):
        token, _ = Token.objects.get_or_create(user=self.user1)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.assertEqual(self.contract.description_cancelation, '')
        self.contract.initial_date = timezone.now() + datetime.timedelta(days=1)
        self.contract.status = 6
        self.contract.save()
        self.user2.points = self.contract.cost*5 + 100
        self.user2.save()
        cancelation_data = {
            'description':'test description',
        }
        response = self.client.put(reverse('contracts:contract-cancel',kwargs={'contract_id': 1}), cancelation_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.contract.refresh_from_db()
        self.assertEqual(self.contract.status, 5)
        self.assertEqual(response.json()['refund'], str(self.contract.cost))
        self.user2.refresh_from_db()
        self.assertEqual(self.user2.points, 100)

    def test_get_cancel_paid_contract_without_points(self):
        token, _ = Token.objects.get_or_create(user=self.user1)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.assertEqual(self.contract.description_cancelation, '')
        self.contract.initial_date = timezone.now() + datetime.timedelta(days=1)
        self.contract.status = 6
        self.contract.save()
        cancelation_data = {
            'description':'test description',
        }
        response = self.client.put(reverse('contracts:contract-cancel',kwargs={'contract_id': 1}), cancelation_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.contract.refresh_from_db()
        self.assertEqual(self.contract.status, 5)
        amount_to_refund = self.contract.cost + (self.user1.points - self.contract.cost*5)/100
        self.assertEqual(response.json()['refund'], str(amount_to_refund))

class ContractPaymentTests(ContractTestCase):
    def setUp(self):
        super().setUp()
        self.payment_url = reverse('contracts:contract-payment', kwargs={'contract_id': self.contract.id})
        self.return_url = 'http://example.com/payment-success/'

    def test_payment_initiation_success(self):
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.payment_url, {'returnURL': self.return_url})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('sessionUrl' in response.json())
        self.assertEqual(response.json()['price'], self.contract.cost*100)

    def test_payment_initiation_permission_denied(self):
        token, _ = Token.objects.get_or_create(user=self.user1)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        token, _ = Token.objects.get_or_create(user=self.user1)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.payment_url, {'returnURL': self.return_url, 'points': 0})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_payment_initiation_more_points_than_available(self):
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.payment_url, {'returnURL': self.return_url, 'points': 10})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), 'No se pueden gastar más puntos de los disponibles')

    def test_payment_initiation_too_much_points(self):
        self.user2.points = 1000000
        self.user2.save()
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.payment_url, {'returnURL': self.return_url, 'points': 1000000})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), 'El precio del contrato es menor al valor de los puntos utilizados')

    def test_payment_initiation_with_points(self):
        self.user2.points = 100
        self.user2.save()
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.payment_url, {'returnURL': self.return_url, 'points': 100})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('sessionUrl' in response.json())
        self.assertEqual(response.json()['price'], (self.contract.cost*100)-100)
    def test_payment_initiation_point_equals_cost(self):
        self.user2.points = self.contract.cost*100
        self.user2.save()
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.payment_url, {'returnURL': self.return_url, 'points': self.contract.cost*100})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), 'El contrato se ha pagado sin necesidad de proceder al pago')

    def test_payment_initiation_error(self):
        self.user2.points = self.contract.cost*100
        self.user2.save()
        token, _ = Token.objects.get_or_create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.payment_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
