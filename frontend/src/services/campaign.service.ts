import { api } from './api';
import type {
  Campaign,
  CampaignUpdate,
  CampaignComment,
  PaginatedResponse,
  CampaignStatus,
  CampaignCategory,
} from '../types';

export interface CampaignFilters {
  status?: CampaignStatus;
  category?: CampaignCategory;
  search?: string;
  is_featured?: boolean;
  ordering?: string;
}

export const campaignService = {
  async list(params?: CampaignFilters): Promise<PaginatedResponse<Campaign>> {
    const response = await api.get('/campaigns/', { params });
    return response.data;
  },

  async get(id: string): Promise<Campaign> {
    const response = await api.get(`/campaigns/${id}/`);
    return response.data;
  },

  async create(data: Partial<Campaign>): Promise<Campaign> {
    const response = await api.post('/campaigns/', data);
    return response.data;
  },

  async update(id: string, data: Partial<Campaign>): Promise<Campaign> {
    const response = await api.put(`/campaigns/${id}/`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/campaigns/${id}/`);
  },

  async uploadCoverImage(id: string, file: File): Promise<Campaign> {
    const formData = new FormData();
    formData.append('cover_image', file);

    const response = await api.patch(`/campaigns/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Campaign Updates
  async getUpdates(campaignId: string): Promise<CampaignUpdate[]> {
    const response = await api.get('/campaigns/updates/', {
      params: { campaign: campaignId },
    });
    return response.data.results;
  },

  async createUpdate(data: {
    campaign: string;
    title: string;
    content: string;
  }): Promise<CampaignUpdate> {
    const response = await api.post('/campaigns/updates/', data);
    return response.data;
  },

  // Campaign Comments
  async getComments(campaignId: string): Promise<CampaignComment[]> {
    const response = await api.get('/campaigns/comments/', {
      params: { campaign: campaignId },
    });
    return response.data.results;
  },

  async createComment(data: {
    campaign: string;
    content: string;
  }): Promise<CampaignComment> {
    const response = await api.post('/campaigns/comments/', data);
    return response.data;
  },

  async deleteComment(id: string): Promise<void> {
    await api.delete(`/campaigns/comments/${id}/`);
  },
};
