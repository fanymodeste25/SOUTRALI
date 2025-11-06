import { Layout } from '../components/common/Layout';
import { FiUser, FiTarget, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

export const HowItWorksPage = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-vibrant">Comment ça marche ?</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Soutrali rend la collecte de fonds simple et transparente pour les communautés africaines
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Pour les Organisateurs */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="text-gradient">Pour les Organisateurs</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card-gradient p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Créez un Compte</h3>
                <p className="text-gray-600">
                  Inscrivez-vous gratuitement en tant qu'organisateur sur Soutrali
                </p>
              </div>

              <div className="card-gradient p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTarget className="w-6 h-6 text-accent-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Créez une Campagne</h3>
                <p className="text-gray-600">
                  Décrivez votre cause, fixez votre objectif et ajoutez des photos
                </p>
              </div>

              <div className="card-gradient p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="w-6 h-6 text-coral-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Partagez</h3>
                <p className="text-gray-600">
                  Partagez votre campagne avec votre réseau sur les réseaux sociaux
                </p>
              </div>

              <div className="card-gradient p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCreditCard className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Recevez des Fonds</h3>
                <p className="text-gray-600">
                  Recevez les dons directement via mobile money dans votre pays
                </p>
              </div>
            </div>
          </div>

          {/* Pour les Donateurs */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="text-gradient">Pour les Donateurs</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-gradient p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Trouvez une Campagne</h3>
                <p className="text-gray-600">
                  Parcourez les campagnes et trouvez une cause qui vous tient à cœur
                </p>
              </div>

              <div className="card-gradient p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Faites un Don</h3>
                <p className="text-gray-600">
                  Choisissez votre montant et payez via Wave, Orange Money ou MTN Mobile Money
                </p>
              </div>

              <div className="card-gradient p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Suivez l'Impact</h3>
                <p className="text-gray-600">
                  Recevez des mises à jour sur l'avancement de la campagne et son impact
                </p>
              </div>
            </div>
          </div>

          {/* Méthodes de Paiement */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-gradient">Méthodes de Paiement Acceptées</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="badge-primary text-lg px-6 py-3">Wave</div>
              <div className="badge-accent text-lg px-6 py-3">Orange Money</div>
              <div className="badge-coral text-lg px-6 py-3">MTN Mobile Money</div>
            </div>
            <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto">
              Nous acceptons les paiements via les principales méthodes de mobile money utilisées en Afrique,
              rendant les dons faciles et accessibles à tous.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
