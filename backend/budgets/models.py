from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.utils import timezone


class Budget(models.Model):
    CATEGORIES = (
        ('food', 'Food & Dining'),
        ('transport', 'Transport'),
        ('utilities', 'Utilities'),
        ('entertainment', 'Entertainment'),
        ('healthcare', 'Healthcare'),
        ('shopping', 'Shopping'),
        ('education', 'Education'),
        ('travel', 'Travel'),
        ('rent', 'Rent/Housing'),
        ('other_expense', 'Other Expense'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.CharField(max_length=50, choices=CATEGORIES)
    monthly_limit = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    month = models.PositiveIntegerField()  # 1-12
    year = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'category', 'month', 'year']
        ordering = ['-year', '-month', 'category']

    def __str__(self):
        return f"{self.get_category_display()} - {self.year}-{self.month:02d}"

    @property
    def spent(self):
        """Calculate total spent in this budget period"""
        from transactions.models import Transaction
        from django.db.models import Sum
        
        spent = Transaction.objects.filter(
            user=self.user,
            category=self.category,
            type='expense',
            date__year=self.year,
            date__month=self.month
        ).aggregate(total=Sum('amount'))['total'] or 0
        return spent

    @property
    def remaining(self):
        """Calculate remaining budget"""
        return self.monthly_limit - self.spent

    @property
    def percentage_used(self):
        """Calculate percentage of budget used"""
        if self.monthly_limit == 0:
            return 0
        return (self.spent / self.monthly_limit) * 100

    @property
    def is_over_budget(self):
        """Check if budget is exceeded"""
        return self.spent > self.monthly_limit
