import { Link } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { HelpCircle, BookOpen, MessageCircle, Mail, Search } from 'lucide-react';
import { useState } from 'react';

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: BookOpen,
      title: "Guide de démarrage",
      description: "Apprenez à créer et gérer votre campagne",
      link: "/how-it-works"
    },
    {
      icon: MessageCircle,
      title: "Questions fréquentes",
      description: "Trouvez des réponses aux questions courantes",
      link: "#faq"
    },
    {
      icon: Mail,
      title: "Nous contacter",
      description: "Notre équipe est là pour vous aider",
      link: "/contact"
    }
  ];

  const faqs = [
    {
      question: "Comment créer une campagne ?",
      answer: "Pour créer une campagne, inscrivez-vous d'abord sur la plateforme en tant qu'organisateur. Ensuite, cliquez sur 'Créer une campagne' et remplissez le formulaire avec les détails de votre projet."
    },
    {
      question: "Quels sont les frais de la plateforme ?",
      answer: "SOUTRALI prélève une commission de 5% sur les fonds collectés pour couvrir les frais de plateforme et de traitement des paiements."
    },
    {
      question: "Comment puis-je faire un don ?",
      answer: "Visitez la page de la campagne qui vous intéresse, cliquez sur 'Faire un don', entrez le montant souhaité et suivez les instructions de paiement."
    },
    {
      question: "Les paiements sont-ils sécurisés ?",
      answer: "Oui, tous les paiements sont traités via des passerelles de paiement sécurisées (FedaPay, Moov Money, Orange Money). Vos informations bancaires sont cryptées et protégées."
    },
    {
      question: "Puis-je annuler mon don ?",
      answer: "Les dons sont généralement non remboursables. Cependant, si une campagne est annulée ou frauduleuse, les remboursements peuvent être traités. Contactez-nous pour plus d'informations."
    },
    {
      question: "Comment retirer les fonds collectés ?",
      answer: "Une fois votre campagne terminée et l'objectif atteint, vous pouvez demander le retrait des fonds via votre tableau de bord. Le virement est effectué sous 5 à 10 jours ouvrés."
    },
    {
      question: "Puis-je modifier ma campagne après sa création ?",
      answer: "Oui, vous pouvez modifier certains détails de votre campagne via votre tableau de bord. Certains champs comme l'objectif financier peuvent avoir des restrictions."
    },
    {
      question: "Comment partager ma campagne ?",
      answer: "Chaque campagne dispose de boutons de partage pour les réseaux sociaux. Vous pouvez également copier le lien de votre campagne et le partager par email, WhatsApp, etc."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Centre d'aide
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trouvez des réponses à vos questions et apprenez à utiliser SOUTRALI
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <category.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {category.title}
              </h3>
              <p className="text-gray-600">
                {category.description}
              </p>
            </Link>
          ))}
        </div>

        {/* FAQ Section */}
        <div id="faq" className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-start">
                    <HelpCircle className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 ml-7">
                    {faq.answer}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  Aucun résultat trouvé pour "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vous n'avez pas trouvé votre réponse ?
          </h2>
          <p className="text-gray-600 mb-6">
            Notre équipe de support est là pour vous aider
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Mail className="w-5 h-5 mr-2" />
            Contactez-nous
          </Link>
        </div>
      </div>
    </Layout>
  );
}
