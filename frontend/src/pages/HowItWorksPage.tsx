import { Layout } from '../components/common/Layout';
import { FaRocket, FaUsers, FaMobileAlt, FaCheckCircle } from 'react-icons/fa';

export const HowItWorksPage = () => {
  const steps = [
    {
      icon: <FaUsers className="text-5xl text-primary-500" />,
      title: "Créez une Campagne",
      description: "Inscrivez-vous en tant qu'organisateur et créez votre campagne de collecte de fonds en quelques minutes. Partagez votre histoire et définissez vos objectifs."
    },
    {
      icon: <FaRocket className="text-5xl text-accent-500" />,
      title: "Partagez avec Votre Communauté",
      description: "Diffusez votre campagne sur les réseaux sociaux et auprès de votre communauté. Plus vous partagez, plus vous collectez de fonds."
    },
    {
      icon: <FaMobileAlt className="text-5xl text-primary-500" />,
      title: "Recevez des Dons via Mobile Money",
      description: "Les donateurs peuvent contribuer facilement avec MTN Mobile Money, Orange Money, ou d'autres méthodes de paiement mobile populaires en Afrique."
    },
    {
      icon: <FaCheckCircle className="text-5xl text-accent-500" />,
      title: "Gérez et Recevez vos Fonds",
      description: "Suivez vos donations en temps réel via votre tableau de bord et recevez vos fonds directement sur votre compte mobile money."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-dark-800 to-dark-900 py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comment Ça Marche ?
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Soutrali facilite la collecte de fonds pour les communautés africaines.
              Découvrez comment créer votre campagne en 4 étapes simples.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-dark-700 rounded-xl p-8 border border-dark-600 hover:border-primary-500 transition-all duration-300"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg mb-4">
                      <span className="text-white font-bold text-2xl">{index + 1}</span>
                    </div>
                    <div className="flex justify-center mt-4">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Pourquoi Choisir Soutrali ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Frais Transparents</h3>
                <p className="text-white/90">Frais de plateforme compétitifs et transparents</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Paiements Locaux</h3>
                <p className="text-white/90">Accepte tous les moyens de paiement mobile populaires</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Support 24/7</h3>
                <p className="text-white/90">Notre équipe est là pour vous aider à chaque étape</p>
              </div>
            </div>
            <div className="mt-8">
              <a
                href="/register"
                className="inline-block bg-white text-primary-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Commencer Maintenant
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
