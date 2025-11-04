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

  return (
    <Link to={`/campaigns/${campaign.id}`} className="card block hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {campaign.cover_image ? (
          <img
            src={campaign.cover_image}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span>No image</span>
          </div>
        )}
        {campaign.is_featured && (
          <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Featured
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
          {campaign.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {campaign.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {campaign.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {formatAmount(campaign.current_amount, campaign.currency)}
            </p>
            <p className="text-xs text-gray-500">
              raised of {formatAmount(campaign.goal_amount, campaign.currency)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">{progress.toFixed(0)}%</p>
            <p className="text-xs text-gray-500">funded</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t">
          <div className="flex items-center">
            <FiUsers className="mr-1" />
            <span>{campaign.donors_count} donors</span>
          </div>
          {daysLeft !== null && (
            <div className="flex items-center">
              <FiCalendar className="mr-1" />
              <span>{daysLeft} days left</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
