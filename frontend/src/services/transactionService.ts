import api from './api';

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  type_display: string;
  category: string;
  category_display: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionPayload {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  date: string;
}

export const transactionService = {
  getAll: (filters?: any) => api.get('/transactions/', { params: filters }),
  create: (data: CreateTransactionPayload) => api.post('/transactions/', data),
  getById: (id: number) => api.get(`/transactions/${id}/`),
  update: (id: number, data: Partial<CreateTransactionPayload>) =>
    api.put(`/transactions/${id}/`, data),
  delete: (id: number) => api.delete(`/transactions/${id}/`),
  getSummary: () => api.get('/transactions/summary/'),
  getMonthlyTrend: () => api.get('/transactions/trends/monthly/'),
};
