from django.urls import path
from .views import monthly_report, export_pdf, export_csv, export_excel

urlpatterns = [
    path('monthly/', monthly_report, name='monthly-report'),
    path('export/pdf/', export_pdf, name='export-pdf'),
    path('export/csv/', export_csv, name='export-csv'),
    path('export/excel/', export_excel, name='export-excel'),
]
