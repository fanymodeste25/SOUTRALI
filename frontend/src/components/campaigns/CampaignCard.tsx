import { Link } from 'react-router-dom';
import type { Campaign } from '../../types';
import { FiCalendar, FiUsers } from 'react-icons/fi';

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const progress = campaign.goal_amount
    ? (parseFloat(campaign.current_amount) / parseFloat(campaign.goal_amount)) * 100
    : 0;

  const formatAmount = (amount: string, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const getDaysLeft = () => {
    if (!campaign.end_date) return null;
    const endDate = new Date(campaign.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = getDaysLeft();

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Education': 'badge-primary',
      'Health': 'badge-coral',
      'Emergency': 'badge-accent',
      'Community': 'badge-indigo',
    };
    return colors[category] || 'badge-primary';
  };

  return (
    <Link to={`/campaigns/${campaign.id}`} className="card-vibrant block group">
      {/* Image with Gradient Overlay */}
      <div className="relative h-56 bg-gradient-to-br from-primary-100 to-accent-100 overflow-hidden">
        {campaign.cover_image ? (
          <>
            <img
              src={campaign.cover_image}
              alt={campaign.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <FiCalendar className="w-8 h-8 text-white" />
              </div>
              <span className="text-gray-500 font-medium">Pas d'image</span>
            </div>
          </div>
        )}
        {campaign.is_featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg animate-pulse-glow">
            ⭐ En Vedette
          </div>
        )}
        <div className={`absolute top-3 right-3 ${getCategoryColor(campaign.category)} shadow-md`}>
          {campaign.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {campaign.title}
        </h3>

        <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
          {campaign.description}
        </p>

        {/* Progress Bar with Gradient */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-700">Progression</span>
            <span className="text-xs font-bold text-primary-600">{progress.toFixed(0)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats with Icons */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              {formatAmount(campaign.current_amount, campaign.currency)}
            </p>
            <p className="text-xs text-gray-500 font-medium">
              collectés sur {formatAmount(campaign.goal_amount, campaign.currency)}
            </p>
          </div>
        </div>

        {/* Footer with Modern Design */}
        <div className="flex items-center justify-between text-sm pt-4 border-t-2 border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-700 font-medium">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <FiUsers className="w-4 h-4 text-primary-600" />
            </div>
            <span>{campaign.donors_count} <span className="hidden sm:inline">donateurs</span></span>
          </div>
          {daysLeft !== null && (
            <div className="flex items-center gap-1.5 text-gray-700 font-medium">
              <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                <FiCalendar className="w-4 h-4 text-accent-600" />
              </div>
              <span>{daysLeft} <span className="hidden sm:inline">jours</span></span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
