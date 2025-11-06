import { Layout } from '../components/common/Layout';
import { FaShieldAlt } from 'react-icons/fa';

export const PrivacyPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-dark-800 to-dark-900 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaShieldAlt className="text-3xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-gray-400">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          {/* Content */}
          <div className="bg-dark-700 rounded-xl p-8 md:p-12 border border-dark-600">
            <div className="prose prose-invert max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Soutrali ("nous", "notre", "nos") s'engage à protéger et à respecter votre vie privée.
                  Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons
                  et protégeons vos informations personnelles lorsque vous utilisez notre plateforme de
                  collecte de fonds.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  En utilisant nos services, vous acceptez la collecte et l'utilisation de vos informations
                  conformément à cette politique.
                </p>
              </section>

              {/* Information Collection */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">1. Informations que Nous Collectons</h2>

                <h3 className="text-xl font-bold text-white mb-3 mt-6">1.1 Informations Personnelles</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Lorsque vous créez un compte ou utilisez nos services, nous pouvons collecter :
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Adresse physique</li>
                  <li>Informations de paiement (via nos prestataires sécurisés)</li>
                  <li>Photo de profil (optionnelle)</li>
                </ul>

                <h3 className="text-xl font-bold text-white mb-3 mt-6">1.2 Informations de Transaction</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Nous collectons des informations sur vos transactions, y compris :
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li>Montants des dons et collectes</li>
                  <li>Dates et heures des transactions</li>
                  <li>Méthodes de paiement utilisées</li>
                  <li>Historique des campagnes créées ou soutenues</li>
                </ul>

                <h3 className="text-xl font-bold text-white mb-3 mt-6">1.3 Données Techniques</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Nous collectons automatiquement certaines informations techniques :
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li>Adresse IP</li>
                  <li>Type de navigateur et version</li>
                  <li>Système d'exploitation</li>
                  <li>Pages visitées et temps passé</li>
                  <li>Données de cookies et technologies similaires</li>
                </ul>
              </section>

              {/* Information Use */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">2. Comment Nous Utilisons Vos Informations</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Nous utilisons vos informations pour :
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li>Créer et gérer votre compte utilisateur</li>
                  <li>Traiter les transactions et les paiements</li>
                  <li>Envoyer des notifications importantes sur votre compte et vos campagnes</li>
                  <li>Améliorer et personnaliser votre expérience sur la plateforme</li>
                  <li>Détecter et prévenir la fraude et les activités illégales</li>
                  <li>Respecter nos obligations légales et réglementaires</li>
                  <li>Vous envoyer des communications marketing (avec votre consentement)</li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">3. Partage de Vos Informations</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Nous ne vendons jamais vos informations personnelles. Nous pouvons partager vos
                  informations uniquement dans les cas suivants :
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li><strong className="text-white">Prestataires de services :</strong> Avec des partenaires de confiance qui nous aident à fournir nos services (traitement des paiements, hébergement, analyses)</li>
                  <li><strong className="text-white">Conformité légale :</strong> Lorsque la loi l'exige ou pour protéger nos droits légaux</li>
                  <li><strong className="text-white">Avec votre consentement :</strong> Lorsque vous nous autorisez explicitement à partager vos informations</li>
                  <li><strong className="text-white">Informations publiques :</strong> Les informations que vous rendez publiques sur votre profil ou vos campagnes</li>
                </ul>
              </section>

              {/* Data Security */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">4. Sécurité des Données</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées
                  pour protéger vos informations personnelles contre l'accès non autorisé, la perte, la
                  destruction ou l'altération. Cela inclut :
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li>Cryptage SSL/TLS pour toutes les transmissions de données</li>
                  <li>Stockage sécurisé des données avec accès restreint</li>
                  <li>Audits de sécurité réguliers</li>
                  <li>Formation du personnel sur la protection des données</li>
                </ul>
              </section>

              {/* User Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. Vos Droits</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Vous avez le droit de :
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li><strong className="text-white">Accéder</strong> à vos informations personnelles</li>
                  <li><strong className="text-white">Rectifier</strong> les informations inexactes ou incomplètes</li>
                  <li><strong className="text-white">Supprimer</strong> vos informations (sous réserve de nos obligations légales)</li>
                  <li><strong className="text-white">Limiter</strong> le traitement de vos données</li>
                  <li><strong className="text-white">Vous opposer</strong> au traitement de vos données</li>
                  <li><strong className="text-white">Portabilité</strong> de vos données vers un autre service</li>
                </ul>
                <p className="text-gray-400 leading-relaxed mt-4">
                  Pour exercer ces droits, contactez-nous à <a href="mailto:privacy@soutrali.com" className="text-primary-500 hover:text-primary-400">privacy@soutrali.com</a>
                </p>
              </section>

              {/* Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">6. Cookies et Technologies Similaires</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience,
                  analyser l'utilisation de notre plateforme et personnaliser le contenu. Vous pouvez gérer
                  vos préférences de cookies dans les paramètres de votre navigateur.
                </p>
              </section>

              {/* Data Retention */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">7. Conservation des Données</h2>
                <p className="text-gray-400 leading-relaxed">
                  Nous conservons vos informations personnelles aussi longtemps que nécessaire pour fournir
                  nos services et respecter nos obligations légales. Lorsque vous supprimez votre compte,
                  nous supprimons ou anonymisons vos informations, sauf si la loi nous oblige à les conserver.
                </p>
              </section>

              {/* Children Privacy */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">8. Protection des Mineurs</h2>
                <p className="text-gray-400 leading-relaxed">
                  Nos services ne sont pas destinés aux personnes de moins de 18 ans. Nous ne collectons
                  pas sciemment d'informations personnelles auprès de mineurs sans le consentement parental.
                </p>
              </section>

              {/* Changes */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">9. Modifications de Cette Politique</h2>
                <p className="text-gray-400 leading-relaxed">
                  Nous pouvons mettre à jour cette Politique de Confidentialité de temps en temps. Nous vous
                  informerons de tout changement important par email ou via une notification sur la plateforme.
                  La version mise à jour sera datée et publiée sur cette page.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Nous Contacter</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Pour toute question concernant cette Politique de Confidentialité ou vos données personnelles,
                  veuillez nous contacter :
                </p>
                <div className="bg-dark-600 rounded-lg p-6 border border-dark-500">
                  <p className="text-white mb-2"><strong>Email :</strong> <a href="mailto:privacy@soutrali.com" className="text-primary-500 hover:text-primary-400">privacy@soutrali.com</a></p>
                  <p className="text-white mb-2"><strong>Téléphone :</strong> +237 6XX XX XX XX</p>
                  <p className="text-white"><strong>Adresse :</strong> Yaoundé, Cameroun</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
