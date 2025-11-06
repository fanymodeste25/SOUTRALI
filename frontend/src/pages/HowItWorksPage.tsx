import { Link } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { FileText, Users, TrendingUp, CheckCircle } from 'lucide-react';

export function HowItWorksPage() {
  const steps = [
    {
      icon: FileText,
      title: "Créez votre campagne",
      description: "Inscrivez-vous et créez une campagne de financement en quelques minutes. Décrivez votre projet, fixez un objectif et ajoutez des photos."
    },
    {
      icon: Users,
      title: "Partagez avec votre communauté",
      description: "Partagez votre campagne sur les réseaux sociaux, par email, et mobilisez votre communauté autour de votre projet."
    },
    {
      icon: TrendingUp,
      title: "Recevez des dons",
      description: "Les donateurs soutiennent votre projet via des paiements sécurisés. Suivez vos progrès en temps réel."
    },
    {
      icon: CheckCircle,
      title: "Réalisez votre projet",
      description: "Une fois votre objectif atteint, utilisez les fonds pour concrétiser votre projet et partagez vos résultats."
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            SOUTRALI rend le financement participatif simple et accessible.
            Suivez ces étapes pour lancer votre projet.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <step.icon className="w-8 h-8" />
              </div>
              <div className="text-sm font-semibold text-blue-600 mb-2">
                Étape {index + 1}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Questions fréquentes
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Combien coûte la création d'une campagne ?
              </h3>
              <p className="text-gray-600">
                La création d'une campagne est gratuite. Nous appliquons une commission de 5%
                sur les fonds collectés pour couvrir les frais de plateforme et de paiement.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Combien de temps dure une campagne ?
              </h3>
              <p className="text-gray-600">
                Vous définissez vous-même la durée de votre campagne lors de sa création.
                Nous recommandons généralement une durée de 30 à 60 jours.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Que se passe-t-il si je n'atteins pas mon objectif ?
              </h3>
              <p className="text-gray-600">
                Cela dépend du type de campagne. Les campagnes "tout ou rien" remboursent
                les donateurs si l'objectif n'est pas atteint. Les campagnes "flexible"
                vous permettent de garder les fonds collectés.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Prêt à lancer votre projet ?
          </h2>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Créer un compte
            </Link>
            <Link
              to="/campaigns"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Voir les campagnes
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
