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
from django.utils import timezone
import datetime as datetime2

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
            return JsonResponse({'details': 'La descripción no puede superar los 500 caracteres', 'status': '500'})
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
            return JsonResponse({'details': 'La descripción no puede superar los 500 caracteres', 'status': '500'})
        if End < Init:
            raise ValidationError("La fecha de finalizacion no puede ser antes que la inicial")
        if Init < today:
            raise ValidationError("La fecha de inicio no puede ser antes que hoy")
        if new_cost <= 0.0:
            raise ValidationError("El precio no puede ser menor o igual que 0")
        if contract_data['accept_worker'] != '':
            contract.accept_worker = new_accept_worker
        if contract_data['accept_client'] != '':
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
        if contract.client != user and (status_num != 6 and status_num != 4):
            raise PermissionDenied("No tienes permiso para editar un contrato que no te pertenece")
        if contract.service.worker != user and (status_num != 2 and status_num != 3):
            raise PermissionDenied("No tienes permiso para editar un contrato que no te pertenece")
        if (not user.is_staff) and (status_num != 1 and status_num != 5):
            raise PermissionDenied("No tienes permiso para editar un contrato que no te pertenece")
        if status_num == 6:
            user.points = user.points + int(5*contract.cost)
            user.save()
        contract.status = status_num
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
        points = request.data.get('points')
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if not points:
            points = 0
        else:
            points = int(points)
        if user.points < points:
            return Response('No se pueden gastar más puntos de los disponibles', status=status.HTTP_400_BAD_REQUEST)
        user.points = user.points - points
        user.save()
        if user != contract.client:
            raise PermissionDenied("No puedes proceder al pago de un contrato que no te pertenece")
        if contract.cost < points/100:
            return Response('El precio del contrato es menor al valor de los puntos utilizados', status=status.HTTP_400_BAD_REQUEST)
        if contract.cost == points/100:
            return Response('El contrato se ha pagado sin necesidad de proceder al pago')
        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            contractReceipt = stripe.Product.create(
                name = 'Contrato de Prueba',
                description = contract.description
            )
            price = stripe.Price.create(
                unit_amount = int(contract.cost * 100)-int(points),
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
            return JsonResponse({'sessionUrl': session.url, 'price': price.unit_amount})
        except stripe.error.StripeError as e:
            error_msg = str(e)
            return Response({'Error al completar el pago': error_msg}, status=status.HTTP_400_BAD_REQUEST)

class ContractCancelation(APIView):
    @authentication_classes([TokenAuthentication])
    def put(self, request, contract_id):
        contract_data = request.data
        contract = get_object_or_404(Contract, pk = contract_id)
        token_id = request.headers['Authorization']
        token = get_object_or_404(Token, key=token_id.split()[-1])
        user = token.user
        if contract.service.user != user and contract.client != user:
            raise PermissionDenied("No tienes permiso para cancelar un contrato que no te pertenece")
        new_description = contract_data['description']
        if len(new_description) > 500:
            return Response('La descripción no puede superar los 500 caracteres', status=status.HTTP_400_BAD_REQUEST)
        if new_description.strip() == '':
            return Response('La descripción no puede estar vacía', status=status.HTTP_400_BAD_REQUEST)
        if contract.status != 1 and contract.status != 2 and contract.status != 6:
            return Response('Solo se puede cancelar un contrato que ya este en marcha o finalizado', status=status.HTTP_400_BAD_REQUEST)
        contract.description_cancelation = new_description
        refund = '0'
        if contract.status == 6:
            if (contract.initial_date < (timezone.now() + datetime2.timedelta(days=3)) and contract.service.user == user
                ) or contract.initial_date > (timezone.now() + datetime2.timedelta(days=3)):
                client = contract.client
                if contract.cost*5 > client.points:
                    amount_to_refund = 100*contract.cost + (client.points - contract.cost*5)
                    refund = str(amount_to_refund/100)
                    client.points = 0
                    client.save()
                else:
                    refund = str(contract.cost)
                    client.points = client.points - int(5*contract.cost)
                    client.save()
        contract.status = 5
        contract.save()
        serializer = ContractSerializer(contract, many=False,context ={'request': request})
        data = serializer.data
        data['refund'] = refund
        return Response(data)
        