// User Types
export type UserRole = 'ADMIN' | 'ORGANIZER' | 'DONOR';

export const UserRole = {
  ADMIN: 'ADMIN' as UserRole,
  ORGANIZER: 'ORGANIZER' as UserRole,
  DONOR: 'DONOR' as UserRole,
};

export type KYCStatus = 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export const KYCStatus = {
  NOT_SUBMITTED: 'NOT_SUBMITTED' as KYCStatus,
  PENDING: 'PENDING' as KYCStatus,
  APPROVED: 'APPROVED' as KYCStatus,
  REJECTED: 'REJECTED' as KYCStatus,
};

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: UserRole;
  kyc_status: KYCStatus;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role?: UserRole;
}

// Campaign Types
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export const CampaignStatus = {
  DRAFT: 'DRAFT' as CampaignStatus,
  ACTIVE: 'ACTIVE' as CampaignStatus,
  PAUSED: 'PAUSED' as CampaignStatus,
  COMPLETED: 'COMPLETED' as CampaignStatus,
  CANCELLED: 'CANCELLED' as CampaignStatus,
};

export type CampaignCategory = 'MEDICAL' | 'EDUCATION' | 'EMERGENCY' | 'COMMUNITY' | 'BUSINESS' | 'OTHER';

export const CampaignCategory = {
  MEDICAL: 'MEDICAL' as CampaignCategory,
  EDUCATION: 'EDUCATION' as CampaignCategory,
  EMERGENCY: 'EMERGENCY' as CampaignCategory,
  COMMUNITY: 'COMMUNITY' as CampaignCategory,
  BUSINESS: 'BUSINESS' as CampaignCategory,
  OTHER: 'OTHER' as CampaignCategory,
};

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: CampaignCategory;
  goal_amount: string;
  current_amount: string;
  currency: string;
  status: CampaignStatus;
  organizer: User;
  beneficiary_name: string;
  beneficiary_phone?: string;
  cover_image?: string;
  images?: string[];
  start_date?: string;
  end_date?: string;
  is_featured: boolean;
  donors_count: number;
  created_at: string;
  updated_at: string;
}

export interface CampaignUpdate {
  id: string;
  campaign: string;
  title: string;
  content: string;
  created_at: string;
}

export interface CampaignComment {
  id: string;
  campaign: string;
  user: User;
  content: string;
  created_at: string;
}

// Payment Types
export type PaymentProvider = 'WAVE' | 'ORANGE_MONEY' | 'MTN_MOMO';

export const PaymentProvider = {
  WAVE: 'WAVE' as PaymentProvider,
  ORANGE_MONEY: 'ORANGE_MONEY' as PaymentProvider,
  MTN_MOMO: 'MTN_MOMO' as PaymentProvider,
};

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export const PaymentStatus = {
  PENDING: 'PENDING' as PaymentStatus,
  PROCESSING: 'PROCESSING' as PaymentStatus,
  SUCCESS: 'SUCCESS' as PaymentStatus,
  FAILED: 'FAILED' as PaymentStatus,
  CANCELLED: 'CANCELLED' as PaymentStatus,
  REFUNDED: 'REFUNDED' as PaymentStatus,
};

export interface Payment {
  transaction_id: string;
  campaign: Campaign;
  amount: string;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  donor_email: string;
  donor_phone: string;
  donor_name?: string;
  is_anonymous: boolean;
  provider_transaction_id?: string;
  redirect_url?: string;
  payment_instructions?: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
}

export interface PaymentInitiationRequest {
  campaign_id: string;
  amount: string;
  currency: string;
  provider: PaymentProvider;
  donor_email: string;
  donor_phone: string;
  donor_name?: string;
  is_anonymous?: boolean;
  idempotency_key: string;
}

export interface PaymentInitiationResponse {
  transaction_id: string;
  status: PaymentStatus;
  redirect_url?: string;
  payment_instructions?: string;
}

export interface AvailableProvider {
  code: PaymentProvider;
  name: string;
  logo?: string;
  currencies: string[];
  is_available: boolean;
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface ApiError {
  detail?: string;
  [key: string]: any;
}

// Dashboard Types
export interface DashboardStats {
  total_campaigns: number;
  active_campaigns: number;
  total_raised: string;
  total_donors: number;
  recent_donations: Payment[];
}
