import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { CampaignCard } from '../components/campaigns/CampaignCard';
import { Loading } from '../components/common/Loading';
import { campaignService } from '../services/campaign.service';
import type { Campaign } from '../types';
import { FiHeart, FiShield, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const HomePage = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedCampaigns();
  }, []);

  const loadFeaturedCampaigns = async () => {
    try {
      const response = await campaignService.list({
        is_featured: true,
        ordering: '-created_at',
      });
      setFeaturedCampaigns(response.results.slice(0, 6));
    } catch (error) {
      toast.error('Failed to load featured campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Help for African Communities
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Soutrali connects donors with meaningful causes across Africa. Start a
              campaign or support one today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/campaigns" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Browse Campaigns
              </Link>
              <Link to="/campaigns/create" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                Start a Campaign
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Soutrali?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiZap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast & Easy
              </h3>
              <p className="text-gray-600">
                Create a campaign in minutes and start receiving donations through
                mobile money instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure & Trusted
              </h3>
              <p className="text-gray-600">
                Your donations are protected with bank-level security and transparent
                tracking.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Community Focused
              </h3>
              <p className="text-gray-600">
                Built for African communities with support for Wave, Orange Money, and
                MTN Mobile Money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Campaigns
            </h2>
            <Link
              to="/campaigns"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>

          {isLoading ? (
            <Loading />
          ) : featuredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured campaigns at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Start your fundraising campaign today and get support from your community.
          </p>
          <Link to="/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            Get Started
          </Link>
        </div>
      </section>
    </Layout>
  );
};
