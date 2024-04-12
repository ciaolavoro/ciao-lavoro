from django.urls import path

from .views import ContractCreation, ContractEdit, ContractStatusEdit, ContractDelete, ContractList, ContractDetail, ContractPayment, ContractCancelation

app_name = 'contracts'

urlpatterns = [
    path('create/<int:service_id>/', ContractCreation.as_view(), name='contract-create'),
    path('edit/<int:contract_id>/', ContractEdit.as_view(), name='contract-edit'),
    path('edit/<int:contract_id>/<int:status_num>/', ContractStatusEdit.as_view(), name='contract-status-edit'),
    path('delete/<int:contract_id>/', ContractDelete.as_view(), name='contract-delete'),
    path('list/<int:cow_id>/', ContractList.as_view(), name="user-contracts"),
    path('detail/<int:contract_id>/', ContractDetail.as_view(), name="contract-detail"),
    path('<int:contract_id>/payment/', ContractPayment.as_view(), name="contract-payment"),
    path('cancel/<int:contract_id>/', ContractCancelation.as_view(), name='contract-cancel')
]

