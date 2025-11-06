import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/common/Layout';
import { campaignService } from '../../services/campaign.service';
import { CampaignCategory } from '../../types';
import { getCategoryLabel } from '../../utils/translations';
import toast from 'react-hot-toast';

export const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CampaignCategory.OTHER,
    goal_amount: '',
    currency: 'XOF',
    beneficiary_name: '',
    beneficiary_phone: '',
    end_date: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const campaign = await campaignService.create({
        ...formData,
        status: 'DRAFT' as any,
      });

      toast.success('Campagne créée avec succès !');
      navigate(`/campaigns/${campaign.id}`);
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData) {
        Object.keys(errorData).forEach((key) => {
          const messages = errorData[key];
          if (Array.isArray(messages)) {
            messages.forEach((msg) => toast.error(`${key}: ${msg}`));
          } else {
            toast.error(`${key}: ${messages}`);
          }
        });
      } else {
        toast.error('Échec de la création de la campagne');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Créer une Campagne
        </h1>
        <p className="text-gray-600 mb-8">
          Partagez votre histoire et commencez à collecter des fonds pour votre cause
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la Campagne *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Donnez à votre campagne un titre clair et descriptif"
              maxLength={200}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.title.length}/200 caractères
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description de la Campagne *
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="input-field min-h-[200px]"
              placeholder="Racontez votre histoire. Pourquoi collectez-vous des fonds ? Comment l'argent sera-t-il utilisé ?"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              required
            >
              {Object.values(CampaignCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {getCategoryLabel(cat)}
                </option>
              ))}
            </select>
          </div>

          {/* Goal Amount and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant Objectif *
              </label>
              <input
                type="number"
                name="goal_amount"
                required
                min="0"
                step="any"
                value={formData.goal_amount}
                onChange={handleChange}
                className="input-field"
                placeholder="100000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Devise *
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="XOF">XOF (Franc CFA)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="USD">USD (Dollar US)</option>
              </select>
            </div>
          </div>

          {/* Beneficiary Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informations sur le Bénéficiaire
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du Bénéficiaire *
                </label>
                <input
                  type="text"
                  name="beneficiary_name"
                  required
                  value={formData.beneficiary_name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Qui bénéficiera de cette campagne ?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone du Bénéficiaire (Optionnel)
                </label>
                <input
                  type="tel"
                  name="beneficiary_phone"
                  value={formData.beneficiary_phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+221 77 123 45 67"
                />
              </div>
            </div>
          </div>

          {/* Campaign Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de Fin (Optionnel)
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="input-field"
              min={new Date().toISOString().split('T')[0]}
            />
            <p className="text-sm text-gray-500 mt-1">
              Laissez vide si vous ne souhaitez pas définir de date de fin
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex-1"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Création...' : 'Créer la Campagne'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
