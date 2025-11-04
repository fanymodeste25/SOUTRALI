import { api } from './api';
import type {
  Payment,
  PaymentInitiationRequest,
  PaymentInitiationResponse,
  AvailableProvider,
  PaginatedResponse,
} from '../types';

export const paymentService = {
  async initiate(data: PaymentInitiationRequest): Promise<PaymentInitiationResponse> {
    const response = await api.post('/payments/initiate/', data);
    return response.data;
  },

  async verify(transactionId: string): Promise<Payment> {
    const response = await api.get(`/payments/verify/${transactionId}/`);
    return response.data;
  },

  async list(params?: {
    campaign?: string;
    status?: string;
  }): Promise<PaginatedResponse<Payment>> {
    const response = await api.get('/payments/list/', { params });
    return response.data;
  },

  async getProviders(): Promise<AvailableProvider[]> {
    const response = await api.get('/payments/providers/');
    return response.data;
  },

  async requestRefund(data: {
    transaction_id: string;
    reason: string;
  }): Promise<void> {
    await api.post('/payments/refunds/', data);
  },
};
