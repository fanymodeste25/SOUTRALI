import { useState, useEffect } from 'react';
import { Layout } from '../../components/common/Layout';
import { CampaignCard } from '../../components/campaigns/CampaignCard';
import { Loading } from '../../components/common/Loading';
import { campaignService } from '../../services/campaign.service';
import type { CampaignFilters } from '../../services/campaign.service';
import type { Campaign } from '../../types';
import { CampaignStatus, CampaignCategory } from '../../types';
import { getCategoryLabel } from '../../utils/translations';
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
      toast.error('Échec du chargement des campagnes');
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
            Parcourir les Campagnes
          </h1>
          <p className="text-gray-600">
            Soutenez les causes qui vous tiennent à cœur. Chaque contribution fait la différence.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
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
                <option value="">Toutes les Catégories</option>
                {Object.values(CampaignCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trier par
              </label>
              <select
                value={filters.ordering || ''}
                onChange={(e) =>
                  setFilters({ ...filters, ordering: e.target.value })
                }
                className="input-field"
              >
                <option value="-created_at">Plus récentes d'abord</option>
                <option value="created_at">Plus anciennes d'abord</option>
                <option value="-current_amount">Les plus financées</option>
                <option value="current_amount">Les moins financées</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Rechercher des campagnes..."
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
            <p className="text-gray-600 text-lg">Aucune campagne trouvée</p>
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
