import { CampaignCategory } from '../types';

export const getCategoryLabel = (category: CampaignCategory): string => {
  const labels: Record<CampaignCategory, string> = {
    MEDICAL: 'Médical',
    EDUCATION: 'Éducation',
    EMERGENCY: 'Urgence',
    COMMUNITY: 'Communauté',
    BUSINESS: 'Entreprise',
    OTHER: 'Autre',
  };
  return labels[category];
};
