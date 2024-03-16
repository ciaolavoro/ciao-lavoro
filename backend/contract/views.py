from datetime import date, datetime
from django.forms import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from api.serializers import ContractSerializer
from .models import Contract
from service.models import Service
from rest_framework.exceptions import PermissionDenied
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes

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
        initial_date = contract_data['initial_date']
        end_date = contract_data['end_date']
        today = datetime.today()
        Init =  datetime.strptime(initial_date, '%Y-%m-%d %H:%M')
        End = datetime.strptime(end_date, '%Y-%m-%d %H:%M')
        if End < Init:
            raise ValidationError("La fecha de finalizacion no puede ser antes que la inicial")
        if Init < today:
            raise ValidationError("La fecha de inicio no puede ser antes que hoy")
        cost = float(contract_data['cost'])
        if cost <= 0:
            raise ValidationError("El precio no puede ser menor o igual que 0")
        if client == worker:
            raise ValidationError("No puede realizar un contrato a su propio servicio")
        contract = Contract.objects.create(worker = worker, client = client, description=description,
                                           initial_date=initial_date,
                                           end_date = end_date,
                                           cost = cost,
                                           status=2,
                                           service=service)
        serializer = ContractSerializer(contract, many=False,context ={'request': request})
        return Response(serializer.data)

class ContractEdit(APIView):
    def post(self, request, contract_id):
        contract_data = request.data
        contract = Contract.objects.get(pk=contract_id)
        if contract.client != request.user and contract.service.user != request.user and not request.user.is_staff:
            raise ValidationError("No tienes permiso para editar un contrato que no te pertenece")
        new_accept_worker = contract_data['accept_worker']
        new_accept_client = contract_data['accept_client']
        new_description = contract_data['description']
        new_initial_date = contract_data['initial_date']
        new_end_date = contract_data['end_date']
        new_cost = contract_data['cost']
        today = date.today()
        Init =  datetime.strptime(new_initial_date, '%Y-%m-%d').date()
        if new_end_date < new_initial_date:
            raise ValidationError("La fecha de finalizacion no puede ser antes que la inicial")
        if Init < today:
            raise ValidationError("La fecha de inicio no puede ser antes que hoy")
        if new_cost <= 0:
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
    def post(self, request, status_num,contract_id):
        contract = Contract.objects.get(pk=contract_id)
        if contract.client != request.user and contract.service.user != request.user and not request.user.is_staff:
            raise PermissionDenied("No tienes permiso para editar un contrato que no te pertenece")
        new_status = status_num
        contract.status = new_status
        contract.save()
        serializer = ContractSerializer(contract, many=False,context ={'request': request})
        return Response(serializer.data)

class ContractDelete(APIView):
    def post(self, request, contract_id):
        contract = Contract.objects.get(pk=contract_id)
        if contract.client != request.user and contract.service.user != request.user and not request.user.is_staff:
            raise PermissionDenied("No tienes permiso para eliminar un contrato que no te pertenece")
        Contract.delete(contract)
        serializer = ContractSerializer(contract, many=False,context ={'request': request})
        return Response(serializer.data)

class ContractClientList(generics.ListAPIView):
    # permission_classes = [permissions.IsAuthenticated]
    serializer_class=ContractSerializer
    def get_queryset(self):
        user=self.request.user.id
        queryset=Contract.objects.filter(client=user)
        return queryset

class ContractWorkerList(generics.ListAPIView):
    # permission_classes = [permissions.IsAuthenticated]
    serializer_class=ContractSerializer
    def get_queryset(self):
        user=self.request.user.id
        queryset=Contract.objects.filter(worker =user)
        return queryset
