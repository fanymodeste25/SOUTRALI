import { api } from './api';
import type { BlogPost, BlogCategory, PaginatedResponse } from '../types';

const BLOG_ENDPOINTS = {
  POSTS: '/blog/posts/',
  CATEGORIES: '/blog/categories/',
  FEATURED: '/blog/posts/featured/',
  RECENT: '/blog/posts/recent/',
};

export const blogService = {
  // Blog Posts
  async getAllPosts(params?: {
    page?: number;
    category?: string;
    search?: string;
    is_featured?: boolean;
  }): Promise<PaginatedResponse<BlogPost>> {
    const response = await api.get(BLOG_ENDPOINTS.POSTS, { params });
    return response.data;
  },

  async getPostBySlug(slug: string): Promise<BlogPost> {
    const response = await api.get(`${BLOG_ENDPOINTS.POSTS}${slug}/`);
    return response.data;
  },

  async getFeaturedPosts(): Promise<BlogPost[]> {
    const response = await api.get(BLOG_ENDPOINTS.FEATURED);
    return response.data;
  },

  async getRecentPosts(): Promise<BlogPost[]> {
    const response = await api.get(BLOG_ENDPOINTS.RECENT);
    return response.data;
  },

  async getPostsByCategory(categorySlug: string, params?: { page?: number }): Promise<PaginatedResponse<BlogPost>> {
    const response = await api.get(`${BLOG_ENDPOINTS.POSTS}category/${categorySlug}/`, { params });
    return response.data;
  },

  // Blog Categories
  async getAllCategories(): Promise<BlogCategory[]> {
    const response = await api.get(BLOG_ENDPOINTS.CATEGORIES);
    return response.data;
  },

  async getCategoryBySlug(slug: string): Promise<BlogCategory> {
    const response = await api.get(`${BLOG_ENDPOINTS.CATEGORIES}${slug}/`);
    return response.data;
  },
};
