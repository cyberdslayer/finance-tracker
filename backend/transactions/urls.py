from django.urls import path
from .views import TransactionListCreateView, TransactionDetailView, transaction_summary, monthly_trend

urlpatterns = [
    path('', TransactionListCreateView.as_view(), name='transaction-list'),
    path('<int:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
    path('summary/', transaction_summary, name='transaction-summary'),
    path('trends/monthly/', monthly_trend, name='monthly-trend'),
]
