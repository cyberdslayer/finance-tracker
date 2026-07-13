import api, { setAuthHeader } from './api';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export const authService = {
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register/', { username, email, password }),
  
  login: (username: string, password: string): Promise<{ data: AuthResponse }> =>
    api.post('/auth/login/', { username, password }),
  
  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }),
  
  refreshToken: (refresh: string) =>
    api.post('/auth/token/refresh/', { refresh }),
  
  getMe: () => api.get('/auth/me/'),
  
  passwordResetRequest: (email: string) =>
    api.post('/auth/password-reset/', { email }),
  
  passwordResetConfirm: (uid: string, token: string, new_password: string) =>
    api.post('/auth/password-reset/confirm/', { uid, token, new_password }),
};
