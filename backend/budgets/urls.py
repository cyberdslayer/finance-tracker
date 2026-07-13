from django.urls import path
from .views import BudgetListCreateView, BudgetDetailView, current_month_budgets, budget_alerts

urlpatterns = [
    path('', BudgetListCreateView.as_view(), name='budget-list'),
    path('<int:pk>/', BudgetDetailView.as_view(), name='budget-detail'),
    path('current-month/', current_month_budgets, name='current-month-budgets'),
    path('alerts/', budget_alerts, name='budget-alerts'),
]
