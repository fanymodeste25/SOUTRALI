import { api } from './api';
import type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
} from '../types';

export const authService = {
  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post('/users/register/', data);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post('/users/login/', credentials);
    const { user, access, refresh } = response.data;

    // Store tokens
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    return { user, tokens: { access, refresh } };
  },

  async logout(): Promise<void> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/users/profile/');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/users/profile/', data);
    return response.data;
  },

  async changePassword(data: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<void> {
    await api.post('/users/password/change/', data);
  },

  async submitKYC(data: {
    id_type: string;
    id_number: string;
    id_document: File;
    address_document?: File;
  }): Promise<void> {
    const formData = new FormData();
    formData.append('id_type', data.id_type);
    formData.append('id_number', data.id_number);
    formData.append('id_document', data.id_document);
    if (data.address_document) {
      formData.append('address_document', data.address_document);
    }

    await api.post('/users/kyc/submit/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
