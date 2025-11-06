import { Layout } from '../components/common/Layout';
import { FiHeart, FiUsers, FiGlobe, FiTrendingUp } from 'react-icons/fi';
import { AfricaMapOutline } from '../components/common/AfricaMap';

export const AboutPage = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-vibrant">À propos de Soutrali</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Une plateforme de financement participatif conçue spécialement pour l'Afrique
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Notre Mission */}
          <div className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  <span className="text-gradient">Notre Mission</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Soutrali a été créé avec une vision simple mais puissante : rendre la collecte de fonds
                  accessible à tous les Africains, où qu'ils soient. Nous croyons en la force de la solidarité
                  et en la capacité des communautés à se soutenir mutuellement.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Notre plateforme facilite les dons via mobile money, rendant le processus rapide, sécurisé
                  et transparent pour tous les utilisateurs à travers le continent africain.
                </p>
              </div>
              <div className="relative">
                <div className="relative z-10">
                  <AfricaMapOutline
                    className="w-full h-auto text-primary-600"
                    strokeColor="currentColor"
                    animated
                  />
                </div>
                {/* Decorative dots on map */}
                <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-accent-500 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-coral-500 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-primary-500 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>

          {/* Nos Valeurs */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="text-gradient">Nos Valeurs</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card-gradient p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiHeart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Solidarité</h3>
                <p className="text-gray-600">
                  Nous croyons en la force de la communauté et de l'entraide
                </p>
              </div>

              <div className="card-gradient p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiUsers className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Inclusion</h3>
                <p className="text-gray-600">
                  Accessible à tous, sans distinction de pays ou de statut
                </p>
              </div>

              <div className="card-gradient p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiGlobe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Transparence</h3>
                <p className="text-gray-600">
                  Traçabilité complète de chaque don et de son utilisation
                </p>
              </div>

              <div className="card-gradient p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiTrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Innovation</h3>
                <p className="text-gray-600">
                  Technologies modernes adaptées au contexte africain
                </p>
              </div>
            </div>
          </div>

          {/* Pourquoi Mobile Money */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8 md:p-12 mb-20">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-gradient">Pourquoi le Mobile Money ?</span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Le mobile money est devenu le moyen de paiement préféré de millions d'Africains.
                En intégrant Wave, Orange Money et MTN Mobile Money, nous rendons les dons :
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-600 text-lg">
                    <strong className="text-gray-900">Accessibles</strong> - Pas besoin de carte bancaire ou de compte en banque
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-600 text-lg">
                    <strong className="text-gray-900">Instantanés</strong> - Les fonds sont transférés en quelques secondes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-coral-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-600 text-lg">
                    <strong className="text-gray-900">Sécurisés</strong> - Protection bancaire pour chaque transaction
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-600 text-lg">
                    <strong className="text-gray-900">Locaux</strong> - Adaptés aux habitudes de paiement africaines
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Notre Impact */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-12">
              <span className="text-gradient">Notre Impact en Chiffres</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="card-gradient p-8">
                <div className="text-4xl font-bold text-gradient-vibrant mb-2">12</div>
                <div className="text-gray-600 font-semibold">Pays Africains</div>
              </div>
              <div className="card-gradient p-8">
                <div className="text-4xl font-bold text-gradient-vibrant mb-2">50K+</div>
                <div className="text-gray-600 font-semibold">Personnes Aidées</div>
              </div>
              <div className="card-gradient p-8">
                <div className="text-4xl font-bold text-gradient-vibrant mb-2">100%</div>
                <div className="text-gray-600 font-semibold">Transparent</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
