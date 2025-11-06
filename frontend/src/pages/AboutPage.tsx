import { Layout } from '../components/common/Layout';
import { FaHeart, FaHandsHelping, FaGlobeAfrica } from 'react-icons/fa';

export const AboutPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-dark-800 to-dark-900 py-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-5xl">S</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              À Propos de Soutrali
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Soutrali est une plateforme de collecte de fonds dédiée aux communautés africaines.
              Notre mission est de faciliter l'accès au financement participatif pour tous, partout en Afrique.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-dark-700 rounded-xl p-8 border border-dark-600">
              <h2 className="text-3xl font-bold text-white mb-6">Notre Mission</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Nous croyons fermement que chaque communauté mérite d'avoir accès à des outils
                modernes et efficaces pour collecter des fonds. Soutrali a été créée pour combler
                le fossé entre les besoins de financement et les solutions de paiement mobile
                largement utilisées en Afrique.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Nous permettons aux organisateurs de campagnes de collecter des fonds facilement
                via Mobile Money (MTN, Orange, etc.) tout en offrant une expérience simple et
                sécurisée aux donateurs.
              </p>
            </div>

            <div className="bg-dark-700 rounded-xl p-8 border border-dark-600">
              <h2 className="text-3xl font-bold text-white mb-6">Notre Vision</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Nous imaginons un avenir où chaque personne en Afrique peut facilement mobiliser
                sa communauté pour soutenir des causes qui lui tiennent à cœur, qu'il s'agisse
                d'urgences médicales, d'éducation, de projets communautaires ou d'entrepreneuriat.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Notre vision est de devenir la plateforme de référence pour la collecte de fonds
                solidaire en Afrique, en connectant des millions de personnes autour de causes
                communes.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Nos Valeurs</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-primary-600/20 to-accent-500/20 rounded-xl p-8 border border-primary-500/30 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
                    <FaHeart className="text-3xl text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Solidarité</h3>
                <p className="text-gray-400">
                  Nous croyons au pouvoir de la communauté et de l'entraide pour créer un impact positif.
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary-600/20 to-accent-500/20 rounded-xl p-8 border border-primary-500/30 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
                    <FaHandsHelping className="text-3xl text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Accessibilité</h3>
                <p className="text-gray-400">
                  Nous rendons la collecte de fonds accessible à tous, avec des outils simples et adaptés au contexte africain.
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary-600/20 to-accent-500/20 rounded-xl p-8 border border-primary-500/30 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
                    <FaGlobeAfrica className="text-3xl text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Innovation</h3>
                <p className="text-gray-400">
                  Nous innovons continuellement pour offrir les meilleures solutions de paiement et de gestion de campagnes.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Rejoignez la Révolution de la Solidarité
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Que vous soyez un organisateur cherchant à collecter des fonds ou un donateur
              souhaitant soutenir des causes importantes, Soutrali est fait pour vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="inline-block bg-white text-primary-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Créer une Campagne
              </a>
              <a
                href="/campaigns"
                className="inline-block bg-dark-700 text-white font-bold px-8 py-4 rounded-lg hover:bg-dark-600 transition-colors border border-white/20"
              >
                Découvrir les Campagnes
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
