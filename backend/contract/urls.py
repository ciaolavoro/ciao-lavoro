from django.urls import path

from .views import ContractCreation, ContractEdit,ContractStatusEdit,ContractDelete,ContractWorkerList,ContractClientList, TaskViewSet

app_name = 'contracts'

urlpatterns = [
    path('create/<int:service_id>/', ContractCreation.as_view(), name='contract-create'),
    path('edit/<int:contract_id>/', ContractEdit.as_view(), name='contract-edit'),
    path('edit/<int:contract_id>/<int:status_num>/', ContractStatusEdit.as_view(), name='contract-status-edit'),
    path('delete/<int:contract_id>/', ContractDelete.as_view(), name='contract-delete'),
    path('clientList/', ContractClientList.as_view(), name="client-contracts"),
    path('workerList/', ContractWorkerList.as_view(), name="worker-contracts"),
    path('tasks/<int:pk>/', TaskViewSet.as_view(), name='task-detail')



]
