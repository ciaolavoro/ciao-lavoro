from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from api.serializers import ContractSerializer

class ContractCreation(APIView):
    def post(self, request):
        serializer = ContractSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)