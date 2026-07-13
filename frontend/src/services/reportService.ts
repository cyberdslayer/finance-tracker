import api from './api';

export interface MonthlyReport {
  month: number;
  year: number;
  total_income: number;
  total_expenses: number;
  net_savings: number;
}

export const reportService = {
  getMonthlyReport: (month?: number, year?: number) =>
    api.get('/reports/monthly/', { params: { month, year } }),
  exportPdf: (month?: number, year?: number) =>
    api.get('/reports/export/pdf/', { params: { month, year }, responseType: 'blob' }),
  exportCsv: (month?: number, year?: number) =>
    api.get('/reports/export/csv/', { params: { month, year }, responseType: 'blob' }),
  exportExcel: (month?: number, year?: number) =>
    api.get('/reports/export/excel/', { params: { month, year }, responseType: 'blob' }),
};
