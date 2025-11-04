import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/common/Layout';
import { Loading } from '../../components/common/Loading';
import { campaignService } from '../../services/campaign.service';
import { paymentService } from '../../services/payment.service';
import type { Campaign, PaymentProvider, AvailableProvider } from '../../types';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

export const DonatePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [providers, setProviders] = useState<AvailableProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    provider: '' as PaymentProvider | '',
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    is_anonymous: false,
  });

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (campaignId: string) => {
    try {
      setIsLoading(true);
      const [campaignData, providersData] = await Promise.all([
        campaignService.get(campaignId),
        paymentService.getProviders(),
      ]);
      setCampaign(campaignData);
      setProviders(providersData.filter((p) => p.is_available));
    } catch (error) {
      toast.error('Failed to load campaign');
      navigate('/campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!campaign || !formData.provider) {
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await paymentService.initiate({
        campaign_id: campaign.id,
        amount: formData.amount,
        currency: campaign.currency,
        provider: formData.provider,
        donor_email: formData.donor_email,
        donor_phone: formData.donor_phone,
        donor_name: formData.donor_name || undefined,
        is_anonymous: formData.is_anonymous,
        idempotency_key: uuidv4(),
      });

      toast.success('Payment initiated!');

      if (response.redirect_url) {
        window.location.href = response.redirect_url;
      } else {
        navigate(`/payment/verify/${response.transaction_id}`);
      }
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
        toast.error('Payment initiation failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
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
        </div>
      </Layout>
    );
  }

  const formatAmount = (amount: string, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const progress = campaign.goal_amount
    ? (parseFloat(campaign.current_amount) / parseFloat(campaign.goal_amount)) * 100
    : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Make a Donation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Amount ({campaign.currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter amount"
                  />
                  <div className="flex gap-2 mt-3">
                    {[5000, 10000, 25000, 50000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, amount: amount.toString() })
                        }
                        className="btn-outline flex-1 text-sm py-1"
                      >
                        {formatAmount(amount.toString(), campaign.currency)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Provider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {providers.map((provider) => (
                      <label
                        key={provider.code}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.provider === provider.code
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="provider"
                          value={provider.code}
                          checked={formData.provider === provider.code}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              provider: e.target.value as PaymentProvider,
                            })
                          }
                          className="mr-3"
                        />
                        <span className="font-medium">{provider.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Donor Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.donor_name}
                        onChange={(e) =>
                          setFormData({ ...formData, donor_name: e.target.value })
                        }
                        className="input-field"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.donor_email}
                        onChange={(e) =>
                          setFormData({ ...formData, donor_email: e.target.value })
                        }
                        className="input-field"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.donor_phone}
                        onChange={(e) =>
                          setFormData({ ...formData, donor_phone: e.target.value })
                        }
                        className="input-field"
                        placeholder="+221 77 123 45 67"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={formData.is_anonymous}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_anonymous: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="anonymous"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Make this donation anonymous
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.provider}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                </button>
              </form>
            </div>
          </div>

          {/* Campaign Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">
                Campaign Summary
              </h3>

              {campaign.cover_image && (
                <img
                  src={campaign.cover_image}
                  alt={campaign.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}

              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {campaign.title}
              </h4>

              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{formatAmount(campaign.current_amount, campaign.currency)}</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p className="mb-1">
                  <span className="font-medium">Goal:</span>{' '}
                  {formatAmount(campaign.goal_amount, campaign.currency)}
                </p>
                <p>
                  <span className="font-medium">Donors:</span>{' '}
                  {campaign.donors_count}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
