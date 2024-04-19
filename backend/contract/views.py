from django.conf import settings

from user.serializers import UserSerializer
from .models import Contract
from service.models import Service
from .serializers import ContractSerializer
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
            return Response("Todo contrato ha de tener una fecha de inicio", status=status.HTTP_400_BAD_REQUEST)
        if contract_data['end_date'] and contract_data['end_date'].strip() != '':
            end_date = contract_data['end_date']
        else:
            return Response("Todo contrato ha de tener una fecha de fin", status=status.HTTP_400_BAD_REQUEST)
        if contract_data['cost'] and contract_data['cost'] != '':
            cost = float(contract_data['cost'])
        else:
            return Response("Todo contrato ha de tener un valor de coste aunque no sea definitivo", status=status.HTTP_400_BAD_REQUEST)

        today = datetime.today()
        Init =  datetime.strptime(initial_date, '%Y-%m-%dT%H:%M')
        End = datetime.strptime(end_date, '%Y-%m-%dT%H:%M')

        if len(description) > 500:
            return Response({'La descripción no puede superar los 500 caracteres'}, status=status.HTTP_400_BAD_REQUEST)
        if End < Init:
            return Response("La fecha de finalizacion no puede ser antes que la inicial", status=status.HTTP_400_BAD_REQUEST)
        if Init < today:
            return Response("La fecha de inicio no puede ser antes que hoy", status=status.HTTP_400_BAD_REQUEST)
        if cost <= 0.0:
            return Response("El precio no puede ser menor o igual que 0", status=status.HTTP_400_BAD_REQUEST)
        if client == worker:
            return Response("No puede contratarse a sí mismo", status=status.HTTP_400_BAD_REQUEST)

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
            return Response("La descripción no puede ser nula, como mucho ha de ser vacía", status=status.HTTP_400_BAD_REQUEST)
        if contract_data['initial_date'] and contract_data['initial_date'].strip() != '':
            new_initial_date = contract_data['initial_date']
        else:
            return Response("Todo contrato ha de tener una fecha de inicio", status=status.HTTP_400_BAD_REQUEST)

        if contract_data['end_date'] and contract_data['end_date'].strip() != '':
            new_end_date = contract_data['end_date']
        else:
            return Response("Todo contrato ha de tener una fecha de fin", status=status.HTTP_400_BAD_REQUEST)

        if contract_data['cost'] and contract_data['cost'].strip() != '':
            new_cost = float(contract_data['cost'])
        else:
            return Response("Todo contrato ha de tener un valor de coste aunque no sea definitivo", status=status.HTTP_400_BAD_REQUEST)
        today = datetime.today()
        Init =  datetime.strptime(new_initial_date, '%Y-%m-%dT%H:%M')
        End = datetime.strptime(new_end_date, '%Y-%m-%dT%H:%M')
        if len(new_description) > 500:
            return Response({'La descripción no puede superar los 500 caracteres'}, status=status.HTTP_400_BAD_REQUEST)
        if End < Init:
            return Response("La fecha de finalizacion no puede ser antes que la inicial", status=status.HTTP_400_BAD_REQUEST)
        if Init < today:
            return Response("La fecha de inicio no puede ser antes que hoy", status=status.HTTP_400_BAD_REQUEST)
        if new_cost <= 0.0:
            return Response("El precio no puede ser menor o igual que 0", status=status.HTTP_400_BAD_REQUEST)
        if contract.worker == user:
            contract.accept_client = False
            contract.accept_worker = True
        if contract.client == user:
            contract.accept_client = True
            contract.accept_worker = False
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
        if not ((contract.client == user and (status_num == 6 or status_num == 4)
                 ) or (contract.service.user == user and (status_num == 2 or status_num == 3))):
            raise PermissionDenied("No tienes permiso para editar un contrato que no te pertenece")
        if status_num == 6:
            session_id = request.data.get('session_id', None)
            if not session_id:
                return Response('session_id is required for completing the payment', status=status.HTTP_400_BAD_REQUEST)
            try:
                stripe.api_key = settings.STRIPE_SECRET_KEY
                session = stripe.checkout.Session.retrieve(session_id)
            except stripe.error.StripeError as e:
                error_msg = str(e)
                return Response({'StripeError': error_msg}, status=status.HTTP_400_BAD_REQUEST)
            if session.payment_status != 'paid':
                return Response('Payment for the session is not completed', status=status.HTTP_400_BAD_REQUEST)
            points = request.data.get('points')
            if points > 100*contract.cost or points > user.points or points < 0:
                return Response('Invalid value for points', status=status.HTTP_400_BAD_REQUEST)
            user.points = user.points - points
            user.points = user.points + int(5*contract.cost)
            user.save()
        contract.status = status_num
        contract.save()
        user_serializer = UserSerializer(user, many=False,context ={'request': request})
        contract_serializer = ContractSerializer(contract, many=False,context ={'request': request})
        token,_ = Token.objects.get_or_create(user=user)
        return Response({'user': user_serializer.data, 'contract': contract_serializer.data, 'token': token.key})

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
        if initial_date and initial_date != '':
            initial_date = datetime.strptime(self.request.query_params.get('initial_date'),'%Y-%m-%d')
            contracts = contracts.filter(initial_date__date=initial_date)
        if end_date and end_date != '':
            end_date = datetime.strptime(self.request.query_params.get('end_date'),'%Y-%m-%d')
            contracts = contracts.filter(end_date__date=end_date)
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
        if not returnURL:
            return Response('Debe enviar una ruta de retorno', status=status.HTTP_400_BAD_REQUEST)
        points = request.data.get('points')
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if not points:
            points = 0
        else:
            points = int(points)
        if user.points < points:
            return Response('No se pueden gastar más puntos de los disponibles', status=status.HTTP_400_BAD_REQUEST)
        user_serializer = UserSerializer(user, many=False,context ={'request': request})
        token,_ = Token.objects.get_or_create(user=user)
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
                success_url = returnURL + '?session_id={CHECKOUT_SESSION_ID}&points='+str(points),
                cancel_url = returnURL,
            )
            return Response({'sessionUrl': session.url, 'price': price.unit_amount, 'user': user_serializer.data, 'token': token.key})
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