import api from './api';

export interface Budget {
  id: number;
  category: string;
  category_display: string;
  monthly_limit: number;
  month: number;
  year: number;
  spent: number;
  remaining: number;
  percentage_used: number;
  is_over_budget: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBudgetPayload {
  category: string;
  monthly_limit: number;
  month: number;
  year: number;
}

export const budgetService = {
  getAll: (filters?: any) => api.get('/budgets/', { params: filters }),
  create: (data: CreateBudgetPayload) => api.post('/budgets/', data),
  getById: (id: number) => api.get(`/budgets/${id}/`),
  update: (id: number, data: Partial<CreateBudgetPayload>) =>
    api.put(`/budgets/${id}/`, data),
  delete: (id: number) => api.delete(`/budgets/${id}/`),
  getCurrentMonth: () => api.get('/budgets/current-month/'),
  getAlerts: () => api.get('/budgets/alerts/'),
};
