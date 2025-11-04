import { useState, useEffect } from 'react';
import { Layout } from '../../components/common/Layout';
import { CampaignCard } from '../../components/campaigns/CampaignCard';
import { Loading } from '../../components/common/Loading';
import { campaignService } from '../../services/campaign.service';
import type { CampaignFilters } from '../../services/campaign.service';
import type { Campaign } from '../../types';
import { CampaignStatus, CampaignCategory } from '../../types';
import toast from 'react-hot-toast';

export const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<CampaignFilters>({
    status: CampaignStatus.ACTIVE,
  });

  useEffect(() => {
    loadCampaigns();
  }, [filters]);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const response = await campaignService.list(filters);
      setCampaigns(response.results);
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse Campaigns
          </h1>
          <p className="text-gray-600">
            Support causes that matter to you. Every contribution makes a difference.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    category: e.target.value as CampaignCategory | undefined,
                  })
                }
                className="input-field"
              >
                <option value="">All Categories</option>
                {Object.values(CampaignCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.ordering || ''}
                onChange={(e) =>
                  setFilters({ ...filters, ordering: e.target.value })
                }
                className="input-field"
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="-current_amount">Most Funded</option>
                <option value="current_amount">Least Funded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search campaigns..."
                value={filters.search || ''}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        {isLoading ? (
          <Loading />
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No campaigns found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
