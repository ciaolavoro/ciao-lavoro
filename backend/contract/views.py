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
class ContractCreation(APIView):
    @authentication_classes([TokenAuthentication])
    def post(self, request, service_id):
        contract_data = request.data
        service = Service.objects.get(pk=service_id)
        worker = service.user
        token_id = request.headers['Authorization']
        token = get_object_or_404(Token, key=token_id.split()[-1])
        client = token.user
        description = contract_data['description']
        if len(description) > 500:
            raise ValidationError("La descripción no puede superar los 500 caracteres")
        initial_date = contract_data['initial_date']
        end_date = contract_data['end_date']
        today = datetime.today()
        Init =  datetime.strptime(initial_date, '%Y-%m-%dT%H:%M')
        End = datetime.strptime(end_date, '%Y-%m-%dT%H:%M')
        if End < Init:
            raise ValidationError("La fecha de finalizacion no puede ser antes que la inicial")
        if Init < today:
            raise ValidationError("La fecha de inicio no puede ser antes que hoy")
        cost = float(contract_data['cost'])
        if cost <= 0.0:
            raise ValidationError("El precio no puede ser menor o igual que 0")
        if client == worker:
            raise ValidationError("No puede realizar un contrato a su propio servicio")
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
        if contract_data['accept_worker']:
            new_accept_worker = contract_data['accept_worker']
            if user != contract.worker:
                raise PermissionDenied("No tienes permiso para cambiar la aceptación de la otra parte")
        else:
            new_accept_worker = contract.accept_worker
        if contract_data['accept_client']:
            new_accept_client = contract_data['accept_client']
            if user != contract.client:
                raise PermissionDenied("No tienes permiso para cambiar la aceptación de la otra parte")
        else:
            new_accept_client = contract.accept_client
        new_description = contract_data['description']
        if len(new_description) > 500:
            raise ValidationError("La descripción no puede superar los 500 caracteres")
        new_initial_date = contract_data['initial_date']
        new_end_date = contract_data['end_date']
        today = datetime.today()
        Init =  datetime.strptime(new_initial_date, '%Y-%m-%dT%H:%M')
        End = datetime.strptime(new_end_date, '%Y-%m-%dT%H:%M')
        if End < Init:
            raise ValidationError("La fecha de finalizacion no puede ser antes que la inicial")
        if Init < today:
            raise ValidationError("La fecha de inicio no puede ser antes que hoy")
        new_cost = float(contract_data['cost'])
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
        if contract.status >= new_status:
            raise ValidationError("No puedes volver atrás al cambiar el estado")
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
    def get(self, request):
        token_id = self.request.headers['Authorization']
        token = get_object_or_404(Token, key=token_id.split()[-1])
        client = token.user
        queryset = self.get_queryset()
        queryset1 = queryset.filter(worker = client)
        queryset2 = queryset.filter(client = client)
        if not queryset.exists():
            return Response([], status=status.HTTP_200_OK)
        serializer1 = self.serializer_class(queryset1, many=True,
                                            context ={'request': request})
        serializer2 = self.serializer_class(queryset2, many=True,
                                            context ={'request': request})
        return Response({"worker": serializer1.data, "client": serializer2.data},
                            status=status.HTTP_200_OK)

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
        if contract == None:
            return Response([], status=status.HTTP_200_OK)
        serializer = self.serializer_class(contract, many = False,
                                            context ={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)