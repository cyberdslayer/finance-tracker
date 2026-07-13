from rest_framework import serializers
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    spent = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    remaining = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    percentage_used = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    is_over_budget = serializers.BooleanField(read_only=True)

    class Meta:
        model = Budget
        fields = [
            'id', 'category', 'category_display', 'monthly_limit',
            'month', 'year', 'spent', 'remaining', 'percentage_used',
            'is_over_budget', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_monthly_limit(self, value):
        if value < 0:
            raise serializers.ValidationError("Budget limit cannot be negative")
        return value

    def validate(self, data):
        if data.get('month') < 1 or data.get('month') > 12:
            raise serializers.ValidationError("Month must be between 1 and 12")
        if data.get('year') < 2000:
            raise serializers.ValidationError("Year must be 2000 or later")
        return data
