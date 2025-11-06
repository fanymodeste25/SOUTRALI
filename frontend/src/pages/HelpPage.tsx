import { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaEnvelope, FaPhone } from 'react-icons/fa';

export const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Comment créer une campagne de collecte de fonds ?",
      answer: "Pour créer une campagne, inscrivez-vous en tant qu'organisateur, connectez-vous à votre compte, puis cliquez sur 'Créer une Campagne' dans le menu. Remplissez les informations requises : titre, description, objectif financier, et téléchargez une image. Une fois votre campagne validée, elle sera visible publiquement."
    },
    {
      question: "Quels moyens de paiement sont acceptés ?",
      answer: "Nous acceptons les principaux moyens de paiement mobile en Afrique : MTN Mobile Money, Orange Money, Moov Money, et d'autres services de paiement mobile selon votre pays. Nous travaillons également à intégrer des cartes bancaires et PayPal."
    },
    {
      question: "Quels sont les frais de la plateforme ?",
      answer: "Soutrali prélève des frais de plateforme transparents pour couvrir les coûts de traitement des paiements et de maintenance. Les frais exacts dépendent du montant collecté et sont affichés clairement lors de la création de votre campagne."
    },
    {
      question: "Comment et quand puis-je retirer mes fonds ?",
      answer: "Une fois votre campagne activée et que vous commencez à recevoir des dons, vous pouvez suivre vos fonds en temps réel via votre tableau de bord. Les retraits peuvent être effectués vers votre compte Mobile Money une fois que vous avez atteint un seuil minimum. Le délai de traitement est généralement de 2-3 jours ouvrables."
    },
    {
      question: "Ma campagne doit-elle être approuvée avant d'être publiée ?",
      answer: "Oui, toutes les campagnes sont examinées par notre équipe avant d'être publiées pour garantir qu'elles respectent nos directives communautaires et nos conditions d'utilisation. Ce processus prend généralement 24-48 heures."
    },
    {
      question: "Comment puis-je partager ma campagne ?",
      answer: "Une fois votre campagne publiée, vous recevrez un lien unique que vous pouvez partager sur les réseaux sociaux (Facebook, Twitter, WhatsApp), par email, ou SMS. Plus vous partagez, plus vous avez de chances d'atteindre votre objectif."
    },
    {
      question: "Puis-je modifier ma campagne après sa publication ?",
      answer: "Oui, vous pouvez modifier certains éléments de votre campagne depuis votre tableau de bord, comme la description et les mises à jour. Toutefois, l'objectif financier et certaines informations clés ne peuvent pas être modifiés une fois la campagne publiée."
    },
    {
      question: "Que se passe-t-il si je n'atteins pas mon objectif ?",
      answer: "Contrairement aux plateformes 'tout ou rien', Soutrali vous permet de conserver tous les fonds collectés, même si vous n'atteignez pas votre objectif initial. Nous croyons que chaque contribution compte."
    },
    {
      question: "Comment puis-je faire un don ?",
      answer: "Pour faire un don, trouvez une campagne qui vous intéresse, cliquez sur 'Faire un Don', choisissez votre montant et votre mode de paiement (Mobile Money ou autre), puis suivez les instructions. Vous recevrez une confirmation par email et SMS."
    },
    {
      question: "Mes dons sont-ils sécurisés ?",
      answer: "Absolument. Nous utilisons des protocoles de sécurité de niveau bancaire pour protéger toutes les transactions. Vos informations de paiement sont cryptées et nous ne stockons jamais vos données sensibles."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-dark-800 to-dark-900 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaQuestionCircle className="text-3xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Centre d'Aide
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Trouvez des réponses à vos questions sur Soutrali. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Questions Fréquentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-dark-700 rounded-xl border border-dark-600 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-dark-600 transition-colors"
                  >
                    <span className="text-lg font-semibold text-white pr-4">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <FaChevronUp className="text-primary-500 flex-shrink-0" />
                    ) : (
                      <FaChevronDown className="text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Besoin d'Aide Supplémentaire ?
              </h2>
              <p className="text-white/90 text-lg">
                Notre équipe est disponible pour répondre à toutes vos questions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <a
                href="/contact"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Contactez-nous</h3>
                    <p className="text-white/80">
                      Envoyez-nous un message et nous vous répondrons dans les plus brefs délais
                    </p>
                  </div>
                </div>
              </a>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Support Téléphonique</h3>
                    <p className="text-white/80 mb-2">
                      Appelez-nous du lundi au vendredi, 9h-18h
                    </p>
                    <p className="text-white font-semibold">+237 6XX XX XX XX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
