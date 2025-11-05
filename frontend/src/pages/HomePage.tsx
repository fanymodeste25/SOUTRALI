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
      {/* Hero Section with Vibrant Gradient */}
      <section className="section-hero text-white py-24 md:py-32 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-coral-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Solidarité pour l'Afrique
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 leading-relaxed">
              Soutrali connecte les donateurs avec des causes significatives à travers l'Afrique.
              Créez une campagne ou soutenez-en une dès aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/campaigns" className="btn-secondary">
                Parcourir les Campagnes
              </Link>
              <Link to="/campaigns/create" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                Créer une Campagne
              </Link>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" fillOpacity="0.1"/>
            <path d="M0 40L60 46.7C120 53 240 67 360 70C480 73 600 67 720 63.3C840 60 960 60 1080 63.3C1200 67 1320 73 1380 76.7L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V40Z" fill="white" fillOpacity="0.05"/>
          </svg>
        </div>
      </section>

      {/* Features Section with African Pattern */}
      <section className="section-feature">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-gradient-vibrant">Pourquoi Soutrali ?</span>
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
            Une plateforme moderne et sécurisée pour transformer la solidarité en Afrique
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card-gradient text-center p-8 group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <FiZap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Rapide & Facile
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Créez une campagne en quelques minutes et commencez à recevoir des dons via
                mobile money instantanément.
              </p>
            </div>

            <div className="card-gradient text-center p-8 group">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <FiShield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Sécurisé & Fiable
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Vos dons sont protégés avec une sécurité bancaire et un suivi transparent
                de chaque transaction.
              </p>
            </div>

            <div className="card-gradient text-center p-8 group">
              <div className="w-20 h-20 bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <FiHeart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Centré sur la Communauté
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Conçu pour les communautés africaines avec Wave, Orange Money et
                MTN Mobile Money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Campagnes en Vedette
              </h2>
              <p className="text-gray-600 text-lg">Soutenez les causes qui vous tiennent à cœur</p>
            </div>
            <Link
              to="/campaigns"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-lg group"
            >
              Voir Tout
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {isLoading ? (
            <Loading />
          ) : featuredCampaigns.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="w-12 h-12 text-primary-600" />
              </div>
              <p className="text-gray-600 text-lg">Aucune campagne en vedette pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCampaigns.map((campaign, index) => (
                <div key={campaign.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CampaignCard campaign={campaign} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-vibrant"></div>
        <div className="absolute inset-0 african-pattern"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Prêt à Faire la Différence ?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-white/90 leading-relaxed">
              Lancez votre campagne de financement aujourd'hui et obtenez le soutien de votre communauté.
            </p>
            <Link to="/register" className="btn-secondary inline-block">
              Commencer Maintenant
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
