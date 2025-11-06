import { Link } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { Heart, Globe, Users, Shield } from 'lucide-react';

export function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Solidarité",
      description: "Nous croyons en la force de la communauté et en l'entraide pour réaliser des projets significatifs."
    },
    {
      icon: Globe,
      title: "Accessibilité",
      description: "Nous rendons le financement participatif accessible à tous, partout au Burkina Faso et au-delà."
    },
    {
      icon: Users,
      title: "Transparence",
      description: "Nous garantissons une totale transparence dans la gestion des fonds et le suivi des projets."
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "Vos transactions sont sécurisées et vos données personnelles sont protégées."
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            À propos de SOUTRALI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une plateforme de financement participatif dédiée aux projets
            sociaux et communautaires au Burkina Faso
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="bg-blue-50 rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Notre Mission
            </h2>
            <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
              SOUTRALI a pour mission de démocratiser l'accès au financement pour les
              projets sociaux, éducatifs, culturels et communautaires. Nous connectons
              des porteurs de projets passionnés avec des donateurs généreux qui partagent
              leurs valeurs et leur vision d'un monde meilleur.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Nos Valeurs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Notre Histoire
            </h2>
            <div className="prose prose-lg text-gray-600">
              <p className="mb-4">
                SOUTRALI est né de la conviction que chaque projet mérite une chance
                d'être réalisé, indépendamment des moyens financiers de son porteur.
                Nous avons créé cette plateforme pour permettre aux initiatives locales
                de trouver le soutien dont elles ont besoin.
              </p>
              <p className="mb-4">
                Depuis notre lancement, nous avons aidé des dizaines de projets à voir
                le jour : des écoles construites, des centres de santé équipés, des
                formations organisées, et bien plus encore. Chaque campagne réussie
                est une victoire pour toute la communauté.
              </p>
              <p>
                Aujourd'hui, SOUTRALI continue de grandir grâce à la confiance de nos
                utilisateurs et à l'engagement de notre communauté. Ensemble, nous
                construisons un avenir meilleur, un projet à la fois.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Rejoignez-nous dans cette aventure
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Que vous soyez porteur de projet ou donateur, votre participation
            fait la différence. Ensemble, créons un impact positif.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/campaigns/create"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Créer une campagne
            </Link>
            <Link
              to="/campaigns"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Soutenir un projet
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
