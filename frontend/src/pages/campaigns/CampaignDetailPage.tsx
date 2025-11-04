import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../../components/common/Layout';
import { Loading } from '../../components/common/Loading';
import { campaignService } from '../../services/campaign.service';
import type { Campaign } from '../../types';
import { FiCalendar, FiUsers, FiShare2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const CampaignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCampaign(id);
    }
  }, [id]);

  const loadCampaign = async (campaignId: string) => {
    try {
      setIsLoading(true);
      const data = await campaignService.get(campaignId);
      setCampaign(data);
    } catch (error) {
      toast.error('Failed to load campaign');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!campaign) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Campaign not found
          </h2>
          <Link to="/campaigns" className="btn-primary">
            Browse Campaigns
          </Link>
        </div>
      </Layout>
    );
  }

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: campaign.title,
        text: campaign.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50">
        {/* Hero Image */}
        <div className="relative h-96 bg-gray-200">
          {campaign.cover_image ? (
            <img
              src={campaign.cover_image}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-xl">No image</span>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full">
                    {campaign.category}
                  </span>
                  {campaign.is_featured && (
                    <span className="bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {campaign.title}
                </h1>

                <div className="flex items-center gap-4 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <FiUsers className="mr-2" />
                    <span>{campaign.donors_count} donors</span>
                  </div>
                  {daysLeft !== null && (
                    <div className="flex items-center">
                      <FiCalendar className="mr-2" />
                      <span>{daysLeft} days left</span>
                    </div>
                  )}
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {campaign.description}
                  </p>
                </div>
              </div>

              {/* Organizer Info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Campaign Organizer
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-xl">
                      {campaign.organizer.first_name[0]}
                      {campaign.organizer.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {campaign.organizer.first_name} {campaign.organizer.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{campaign.organizer.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                {/* Progress */}
                <div className="mb-6">
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {formatAmount(campaign.current_amount, campaign.currency)}
                  </p>
                  <p className="text-gray-600 mb-4">
                    raised of {formatAmount(campaign.goal_amount, campaign.currency)} goal
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{campaign.donors_count} donors</span>
                    <span>{progress.toFixed(0)}% funded</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Link
                    to={`/donate/${campaign.id}`}
                    className="btn-primary w-full text-center block"
                  >
                    Donate Now
                  </Link>

                  <button
                    onClick={handleShare}
                    className="btn-outline w-full flex items-center justify-center"
                  >
                    <FiShare2 className="mr-2" />
                    Share Campaign
                  </button>
                </div>

                {/* Beneficiary Info */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Beneficiary
                  </h3>
                  <p className="text-gray-700">{campaign.beneficiary_name}</p>
                  {campaign.beneficiary_phone && (
                    <p className="text-sm text-gray-600 mt-1">
                      {campaign.beneficiary_phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
