from datetime import date, datetime
from rest_framework import generics, status
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from api.serializers import ContractSerializer
from .models import Contract
from service.models import Service
from rest_framework.exceptions import PermissionDenied

class ContractCreation(APIView):
    def post(self, request, service_id):
        contract_data = request.data
        service = Service.objects.get(pk=service_id)
        client = request.user
        if service.user == client and not request.user.is_staff:
            raise PermissionDenied("No tienes permiso para crear un contrato para tu propio servicio")
        description = contract_data['description']
        initial_date = contract_data['initial_date']
        end_date = contract_data['end_date']
        today = date.today()
        Init =  datetime.strptime(initial_date, '%Y-%m-%d').date()
        End = datetime.strptime(end_date, '%Y-%m-%d').date()
        if End < Init:
            raise PermissionDenied("La fecha de finalizacion no puede ser antes que la inicial")
        if Init < today:
            raise PermissionDenied("La fecha de inicio no puede ser antes que hoy")
        cost = contract_data['cost']
        if cost <= 0:
            raise PermissionDenied("El precio no puede ser menor o igual que 0")
        contract = Contract.objects.create(worker = service.user, client = client, description=description,
                                           initial_date=initial_date,
                                           end_date = end_date,
                                           cost = cost,
                                           service=service)
        serializer = ContractSerializer(contract, many=False,context ={'request': request})
        return Response(serializer.data)

class ContractEdit(APIView):
    def post(self, request, contract_id):
        contract_data = request.data
        contract = Contract.objects.get(pk=contract_id)
        if contract.client != request.user and contract.service.user != request.user and not request.user.is_staff:
            raise PermissionDenied("No tienes permiso para editar un contrato que no te pertenece")
        new_accept_worker = contract_data['accept_worker']
        new_accept_client = contract_data['accept_client']
        new_description = contract_data['description']
        new_initial_date = contract_data['initial_date']
        new_end_date = contract_data['end_date']
        new_cost = contract_data['cost']
        today = date.today()
        Init =  datetime.strptime(new_initial_date, '%Y-%m-%d').date()
        if new_end_date < new_initial_date:
            raise PermissionDenied("La fecha de finalizacion no puede ser antes que la inicial")
        if Init < today:
            raise PermissionDenied("La fecha de inicio no puede ser antes que hoy")
        if new_cost <= 0:
            raise PermissionDenied("El precio no puede ser menor o igual que 0")
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
        contracts = Contract.objects.filter(client=user)
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

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.serializer_class(data= queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ContractWorkerList(generics.ListAPIView):
    # permission_classes = [permissions.IsAuthenticated]
    serializer_class=ContractSerializer
    def get_queryset(self):
        user=self.request.user.id
        contracts=Contract.objects.filter(worker=user)
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

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.serializer_class(data = queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return queryset