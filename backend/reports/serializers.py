from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'report_type', 'title', 'description', 'month', 'year', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
