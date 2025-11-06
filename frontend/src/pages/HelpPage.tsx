import { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { FiChevronDown, FiChevronUp, FiHelpCircle } from 'react-icons/fi';

interface FAQ {
  question: string;
  answer: string;
}

export const HelpPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: "Comment créer une campagne de financement ?",
      answer: "Pour créer une campagne, connectez-vous à votre compte en tant qu'organisateur, puis cliquez sur 'Créer une Campagne' dans le menu. Remplissez les informations requises (titre, description, objectif financier, etc.) et soumettez votre campagne pour validation."
    },
    {
      question: "Quelles sont les méthodes de paiement acceptées ?",
      answer: "Nous acceptons Wave, Orange Money et MTN Mobile Money. Ces services de mobile money sont largement utilisés en Afrique et permettent des transactions rapides et sécurisées."
    },
    {
      question: "Comment faire un don à une campagne ?",
      answer: "Trouvez la campagne que vous souhaitez soutenir, cliquez sur 'Faire un don', choisissez votre montant et sélectionnez votre méthode de paiement (Wave, Orange Money ou MTN Mobile Money). Suivez ensuite les instructions pour finaliser votre don."
    },
    {
      question: "Les dons sont-ils sécurisés ?",
      answer: "Oui, absolument. Toutes les transactions sont sécurisées et cryptées. Nous utilisons les infrastructures de paiement officielles de Wave, Orange Money et MTN Mobile Money, qui offrent une protection bancaire pour chaque transaction."
    },
    {
      question: "Qu'est-ce que la vérification KYC ?",
      answer: "KYC (Know Your Customer) est un processus de vérification d'identité requis pour créer des campagnes et recevoir des dons. Cette procédure garantit la sécurité et la transparence de la plateforme pour tous les utilisateurs."
    },
    {
      question: "Combien de temps faut-il pour recevoir les fonds collectés ?",
      answer: "Les fonds sont transférés à la fin de votre campagne ou lorsque vous atteignez votre objectif. Le délai de transfert via mobile money est généralement de 24 à 48 heures après la validation."
    },
    {
      question: "Y a-t-il des frais pour utiliser Soutrali ?",
      answer: "Soutrali prélève une petite commission sur les dons collectés pour maintenir et améliorer la plateforme. Les frais de transaction mobile money s'appliquent également selon votre fournisseur de services."
    },
    {
      question: "Puis-je faire un don anonyme ?",
      answer: "Oui, lors du processus de don, vous avez la possibilité de cocher l'option 'Don anonyme'. Votre nom ne sera pas affiché publiquement, mais vos informations de contact restent nécessaires pour la transaction."
    },
    {
      question: "Comment suivre l'avancement d'une campagne ?",
      answer: "Sur la page de chaque campagne, vous pouvez voir en temps réel le montant collecté, le nombre de donateurs et le pourcentage de l'objectif atteint. Les organisateurs peuvent également publier des mises à jour pour informer les donateurs."
    },
    {
      question: "Que se passe-t-il si une campagne n'atteint pas son objectif ?",
      answer: "Contrairement à certaines plateformes, Soutrali utilise un modèle de financement flexible. Les fonds collectés sont versés à l'organisateur même si l'objectif n'est pas atteint, ce qui permet de soutenir la cause malgré tout."
    },
    {
      question: "Comment puis-je contacter le support ?",
      answer: "Vous pouvez nous contacter via la page Contact ou nous envoyer un email. Notre équipe de support est disponible pour répondre à toutes vos questions et résoudre vos problèmes."
    },
    {
      question: "Dans quels pays Soutrali est-il disponible ?",
      answer: "Soutrali est actuellement disponible dans 12 pays africains : Sénégal, Côte d'Ivoire, Bénin, Burkina Faso, Mali, Niger, Togo, Ghana, Nigeria, Cameroun, Kenya et Rwanda. Nous prévoyons d'étendre nos services à d'autres pays."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiHelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-vibrant">Centre d'Aide</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Trouvez des réponses à vos questions sur Soutrali
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-gradient">Questions Fréquemment Posées</span>
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="card-gradient overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-primary-50/50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <FiChevronUp className="w-6 h-6 text-primary-600 flex-shrink-0" />
                  ) : (
                    <FiChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 animate-slide-up">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Vous n'avez pas trouvé de réponse ?
            </h3>
            <p className="text-gray-600 mb-6">
              Notre équipe de support est là pour vous aider
            </p>
            <a href="/contact" className="btn-primary inline-block">
              Contactez-nous
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};
