import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/common/Layout';
import { Loading } from '../../components/common/Loading';
import { CampaignCard } from '../../components/campaigns/CampaignCard';
import { campaignService } from '../../services/campaign.service';
import type { Campaign } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { FiPlus, FiDollarSign, FiUsers, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const OrganizerDashboard = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const response = await campaignService.list();
      // Filter campaigns created by the current user
      const userCampaigns = response.results.filter(
        (c) => c.organizer.id === user?.id
      );
      setCampaigns(userCampaigns);
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    const totalRaised = campaigns.reduce(
      (sum, c) => sum + parseFloat(c.current_amount),
      0
    );
    const totalDonors = campaigns.reduce((sum, c) => sum + c.donors_count, 0);
    const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length;

    return { totalRaised, totalDonors, activeCampaigns };
  };

  const stats = calculateStats();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Organizer Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your campaigns and track donations
            </p>
          </div>
          <Link to="/campaigns/create" className="btn-primary flex items-center">
            <FiPlus className="mr-2" />
            Create Campaign
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Raised</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF',
                    minimumFractionDigits: 0,
                  }).format(stats.totalRaised)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Donors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalDonors}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.activeCampaigns}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Campaigns
          </h2>

          {isLoading ? (
            <Loading />
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                You haven't created any campaigns yet
              </p>
              <Link to="/campaigns/create" className="btn-primary">
                Create Your First Campaign
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
