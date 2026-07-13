from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from datetime import datetime
from .models import Budget
from .serializers import BudgetSerializer


class BudgetListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BudgetSerializer

    def get_queryset(self):
        user = self.request.user
        
        # Filter by month and year if provided
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')
        
        queryset = Budget.objects.filter(user=user)
        
        if month:
            queryset = queryset.filter(month=month)
        if year:
            queryset = queryset.filter(year=year)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BudgetDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BudgetSerializer

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_month_budgets(request):
    """Get all budgets for current month"""
    today = datetime.now()
    budgets = Budget.objects.filter(
        user=request.user,
        month=today.month,
        year=today.year
    )
    serializer = BudgetSerializer(budgets, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def budget_alerts(request):
    """Get budgets that are over or near limit"""
    today = datetime.now()
    budgets = Budget.objects.filter(
        user=request.user,
        month=today.month,
        year=today.year
    )
    
    alerts = []
    for budget in budgets:
        percentage = budget.percentage_used
        
        if percentage >= 100:
            alerts.append({
                'budget_id': budget.id,
                'category': budget.get_category_display(),
                'status': 'OVER_BUDGET',
                'message': f'Over budget! Spent {budget.spent} out of {budget.monthly_limit}',
                'percentage_used': percentage,
                'amount_over': float(budget.spent - budget.monthly_limit),
            })
        elif percentage >= 80:
            alerts.append({
                'budget_id': budget.id,
                'category': budget.get_category_display(),
                'status': 'WARNING',
                'message': f'Approaching budget limit! {percentage:.1f}% used',
                'percentage_used': percentage,
                'remaining': float(budget.remaining),
            })
    
    return Response({
        'alerts': alerts,
        'total_alerts': len(alerts)
    })
