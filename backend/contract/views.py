
from django.conf import settings
from django.http import JsonResponse
from .models import Contract
from service.models import Service
from .serializers import ContractSerializer
from django.forms import ValidationError
from datetime import datetime
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
import stripe

class ContractCreation(APIView):
    @authentication_classes([TokenAuthentication])
    def post(self, request, service_id):
        contract_data = request.data
        service = get_object_or_404(Service, pk=service_id)
        worker = service.user
        token_id = request.headers['Authorization']
        token = get_object_or_404(Token, key=token_id.split()[-1])
        client = token.user
        description = contract_data['description']
        if contract_data['initial_date'] and contract_data['initial_date'].strip() != '':
            initial_date = contract_data['initial_date']
        else:
            raise ValidationError("Todo contrato ha de tener una fecha de inicio")
        if contract_data['end_date'] and contract_data['end_date'].strip() != '':
            end_date = contract_data['end_date']
        else:
            raise ValidationError("Todo contrato ha de tener una fecha de fin")
        if contract_data['cost'] and contract_data['cost'] != '':
            cost = float(contract_data['cost'])
        else:
            raise ValidationError("Todo contrato ha de tener un valor de coste aunque no sea definitivo")

        today = datetime.today()
        Init =  datetime.strptime(initial_date, '%Y-%m-%dT%H:%M')
        End = datetime.strptime(end_date, '%Y-%m-%dT%H:%M')

        if len(description) > 500:
            raise ValidationError("La descripción no puede superar los 500 caracteres")
        if End < Init:
            raise ValidationError("La fecha de finalizacion no puede ser antes que la inicial")
        if Init < today:
            raise ValidationError("La fecha de inicio no puede ser antes que hoy")
        if cost <= 0.0:
            raise ValidationError("El precio no puede ser menor o igual que 0")
        if client == worker:
            raise ValidationError("No puede contratarse a sí mismo")

        contract = Contract.objects.create(worker = worker, client = client,
                                           description = description,
                                           initial_date = initial_date,
                                           end_date = end_date,
                                           cost = cost,
                                           status = 1,
                                           service = service)
        serializer = ContractSerializer(contract, many=False,context ={'request': request})
        return Response(serializer.data)
class ContractEdit(APIView):
    @authentication_classes([TokenAuthentication])
    def put(self, request, contract_id):
        contract_data = request.data
        contract = get_object_or_404(Contract, pk = contract_id)
        token_id = request.headers['Authorization']
        token = get_object_or_404(Token, key=token_id.split()[-1])
        user = token.user
        if contract.client != user and contract.service.user != user and not user.is_staff:
            raise PermissionDenied("No tienes permiso para editar un contrato que no te pertenece")

        if contract_data['description']:
            new_description = contract_data['description']
        else:
            ValidationError("La descripción no puede ser nula, como mucho ha de ser vacía")
        if contract_data['initial_date'] and contract_data['initial_date'].strip() != '':
            new_initial_date = contract_data['initial_date']
        else:
            raise ValidationError("Todo contrato ha de tener una fecha de inicio")

        if contract_data['end_date'] and contract_data['end_date'].strip() != '':
            new_end_date = contract_data['end_date']
        else:
            raise ValidationError("Todo contrato ha de tener una fecha de fin")

        if contract_data['cost'] and contract_data['cost'].strip() != '':
            new_cost = float(contract_data['cost'])
        else:
            raise ValidationError("Todo contrato ha de tener un valor de coste aunque no sea definitivo")

        if contract_data['accept_worker'] and contract_data['accept_worker'].strip() != '':
            new_accept_worker = contract_data['accept_worker']
            if user != contract.worker and new_accept_worker != str(contract.accept_worker):
                raise PermissionDenied("No tienes permiso para cambiar la aceptación del trabajador siendo el cliente")
        else:
            ValidationError("El campo de aceptación de trabajador ha de tener un valor")

        if contract_data['accept_client'] and contract_data['accept_client'].strip() != '':
            new_accept_client = contract_data['accept_client']
            if user != contract.client and new_accept_client != str(contract.accept_client):
                raise PermissionDenied("No tienes permiso para cambiar la aceptación del cliente siendo el trabajador")
        else:
            ValidationError("El campo de aceptación de cliente ha de tener un valor")
        
        today = datetime.today()
        Init =  datetime.strptime(new_initial_date, '%Y-%m-%dT%H:%M')
        End = datetime.strptime(new_end_date, '%Y-%m-%dT%H:%M')
        if len(new_description) > 500:
            raise ValidationError("La descripción no puede superar los 500 caracteres")
        if End < Init:
            raise ValidationError("La fecha de finalizacion no puede ser antes que la inicial")
        if Init < today:
            raise ValidationError("La fecha de inicio no puede ser antes que hoy")
        if new_cost <= 0.0:
            raise ValidationError("El precio no puede ser menor o igual que 0")

        contract.accept_worker = new_accept_worker
        contract.accept_client = new_accept_client
        contract.description = new_description
        contract.initial_date = new_initial_date
        contract.end_date = new_end_date
        contract.cost = new_cost
        contract.save()
        serializer = ContractSerializer(contract, many=False,context ={'request': request})
        return Response(serializer.data)
class ContractStatusEdit(APIView):
    @authentication_classes([TokenAuthentication])
    def put(self, request, status_num, contract_id):
        contract = get_object_or_404(Contract, pk = contract_id)
        token_id = request.headers['Authorization']
        token = get_object_or_404(Token, key=token_id.split()[-1])
        user = token.user
        if contract.client != user and contract.service.user != user and not user.is_staff:
            raise PermissionDenied("No tienes permiso para editar un contrato que no te pertenece")
        new_status = status_num
        contract.status = new_status
        contract.save()
        serializer = ContractSerializer(contract, many=False,context ={'request': request})
        return Response(serializer.data)
class ContractDelete(APIView):
    @authentication_classes([TokenAuthentication])
    def delete(self, request, contract_id):
        contract = get_object_or_404(Contract, pk = contract_id)
        token_id = request.headers['Authorization']
        token = get_object_or_404(Token, key=token_id.split()[-1])
        user = token.user
        serializer = ContractSerializer(contract, many=False,context ={'request': request})
        if contract.client != user and contract.service.user != user and not user.is_staff:
            raise PermissionDenied("No tienes permiso para eliminar un contrato que no te pertenece")
        Contract.delete(contract)
        return Response(serializer.data)
class ContractList(generics.ListAPIView):
    serializer_class = ContractSerializer
    def get_queryset(self):
        contracts = Contract.objects.all()
        estate = self.request.query_params.get('status')
        initial_date = self.request.query_params.get('initial_date')
        end_date = self.request.query_params.get('end_date')
        if estate:
            contracts = contracts.filter(status=estate)
        if initial_date:
            contracts = contracts.filter(initial_date=initial_date)
        if end_date:
            contracts = contracts.filter(end_date=end_date)
        return contracts
    @authentication_classes([TokenAuthentication])
    def get(self, request,cow_id):
        token_id = self.request.headers['Authorization']
        token = get_object_or_404(Token, key=token_id.split()[-1])
        client = token.user
        queryset = self.get_queryset()
        if cow_id == 1:
            queryset = queryset.filter(worker = client)
        else:
            queryset = queryset.filter(client = client)
        if not queryset.exists():
            return Response([], status=status.HTTP_200_OK)
        serializer = self.serializer_class(queryset, many=True, context ={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class ContractDetail(generics.ListAPIView):
    serializer_class = ContractSerializer
    @authentication_classes([TokenAuthentication])
    def get(self, request, contract_id):
        contract = get_object_or_404(Contract, pk = contract_id)
        token_id = self.request.headers['Authorization']
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if contract.client != user and contract.service.user != user and not user.is_staff:
            raise PermissionDenied("No tienes permiso para contemplar un contrato que no te pertenece")
        serializer = self.serializer_class(contract, many = False,
                                            context ={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ContractPayment(APIView):
    @authentication_classes([TokenAuthentication])
    def post(self, request, contract_id):
        contract = get_object_or_404(Contract, pk = contract_id)
        token_id = self.request.headers['Authorization']
        returnURL = request.data.get('returnURL')
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if user != contract.client:
            raise PermissionDenied("No puedes proceder al pago de un contrato que no te pertenece")
        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            contractReceipt = stripe.Product.create(
                name = 'Contrato de Prueba',
                description = contract.description
            )
            price = stripe.Price.create(
                unit_amount = int(contract.cost * 100),
                currency = 'eur',
                product = contractReceipt.id,
            )

            session = stripe.checkout.Session.create(
                payment_method_types = ['card'],
                line_items = [{
                    'price': price.id,
                    'quantity': 1,
                    }],
                mode = 'payment',
                customer_email = user.email,
                success_url = returnURL,
            )
            return JsonResponse({'sessionUrl': session.url})
        except stripe.error.StripeError as e:
            error_msg = str(e)
            return Response({'Error al completar el pago': error_msg}, status=status.HTTP_400_BAD_REQUEST)