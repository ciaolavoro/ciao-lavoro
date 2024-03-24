from django.urls import path

from .views import ContractCreation, ContractEdit, ContractStatusEdit, ContractDelete, ContractList, ContractDetail, ContractPayment

app_name = 'contracts'

urlpatterns = [
    path('create/<int:service_id>/', ContractCreation.as_view(), name='contract-create'),
    path('edit/<int:contract_id>/', ContractEdit.as_view(), name='contract-edit'),
    path('edit/<int:contract_id>/<int:status_num>/', ContractStatusEdit.as_view(), name='contract-status-edit'),
    path('delete/<int:contract_id>/', ContractDelete.as_view(), name='contract-delete'),
    path('list/<int:cow_id>/', ContractList.as_view(), name="user-contracts"),
    path('list/<int:contract_id>/', ContractDetail.as_view(), name="user-contract"),
    path('<int:contract_id>/payment/', ContractPayment.as_view(), name="contract-payment")
]

