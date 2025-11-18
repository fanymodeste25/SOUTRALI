import { api } from './api';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  async submitContactForm(data: ContactFormData): Promise<void> {
    await api.post('/contact/', data);
  },
};
