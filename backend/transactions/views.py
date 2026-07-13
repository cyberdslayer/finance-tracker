from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Sum, Q
from django_filters.rest_framework import DjangoFilterBackend
from datetime import datetime, timedelta
from .models import Transaction
from .serializers import TransactionSerializer


class TransactionListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TransactionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'category', 'date']
    search_fields = ['description']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TransactionSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def transaction_summary(request):
    """Get summary of transactions for dashboard"""
    user = request.user
    today = datetime.now().date()
    start_of_month = today.replace(day=1)
    start_of_year = today.replace(month=1, day=1)

    # Monthly stats
    monthly_income = Transaction.objects.filter(
        user=user, type='income', date__gte=start_of_month
    ).aggregate(total=Sum('amount'))['total'] or 0

    monthly_expenses = Transaction.objects.filter(
        user=user, type='expense', date__gte=start_of_month
    ).aggregate(total=Sum('amount'))['total'] or 0

    # Yearly stats
    yearly_income = Transaction.objects.filter(
        user=user, type='income', date__gte=start_of_year
    ).aggregate(total=Sum('amount'))['total'] or 0

    yearly_expenses = Transaction.objects.filter(
        user=user, type='expense', date__gte=start_of_year
    ).aggregate(total=Sum('amount'))['total'] or 0

    # Category-wise breakdown for current month
    category_breakdown = Transaction.objects.filter(
        user=user, type='expense', date__gte=start_of_month
    ).values('category').annotate(
        total=Sum('amount')
    ).order_by('-total')
    
    # Map category codes to names
    category_choices_dict = dict(Transaction.CATEGORIES)
    category_breakdown_with_names = []
    for item in category_breakdown:
        item['category_name'] = category_choices_dict.get(item['category'], item['category'])
        category_breakdown_with_names.append(item)

    return Response({
        'monthly_income': float(monthly_income),
        'monthly_expenses': float(monthly_expenses),
        'monthly_savings': float(monthly_income - monthly_expenses),
        'yearly_income': float(yearly_income),
        'yearly_expenses': float(yearly_expenses),
        'yearly_savings': float(yearly_income - yearly_expenses),
        'category_breakdown': category_breakdown_with_names,
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def monthly_trend(request):
    """Get monthly spending trend for the last 12 months"""
    user = request.user
    today = datetime.now().date()
    months_data = []

    for i in range(11, -1, -1):
        month_start = today - timedelta(days=today.day - 1) - timedelta(days=30 * i)
        month_start = month_start.replace(day=1)
        
        if i > 0:
            month_end = month_start + timedelta(days=30)
        else:
            month_end = today

        income = Transaction.objects.filter(
            user=user, type='income', date__gte=month_start, date__lte=month_end
        ).aggregate(total=Sum('amount'))['total'] or 0

        expenses = Transaction.objects.filter(
            user=user, type='expense', date__gte=month_start, date__lte=month_end
        ).aggregate(total=Sum('amount'))['total'] or 0

        months_data.append({
            'month': month_start.strftime('%Y-%m'),
            'income': float(income),
            'expenses': float(expenses),
        })

    return Response(months_data)
