import { Layout } from '../components/common/Layout';
import { FaFileContract } from 'react-icons/fa';

export const TermsPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-dark-800 to-dark-900 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaFileContract className="text-3xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Conditions d'Utilisation
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
                  Bienvenue sur Soutrali. Ces Conditions d'Utilisation ("Conditions") régissent votre accès
                  et votre utilisation de notre plateforme de collecte de fonds. En utilisant Soutrali,
                  vous acceptez d'être lié par ces Conditions.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Si vous n'acceptez pas ces Conditions, veuillez ne pas utiliser nos services.
                </p>
              </section>

              {/* Definitions */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">1. Définitions</h2>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li><strong className="text-white">"Plateforme"</strong> : désigne le site web et les services Soutrali</li>
                  <li><strong className="text-white">"Utilisateur"</strong> : toute personne accédant à la Plateforme</li>
                  <li><strong className="text-white">"Organisateur"</strong> : utilisateur créant une campagne de collecte de fonds</li>
                  <li><strong className="text-white">"Donateur"</strong> : utilisateur effectuant un don à une campagne</li>
                  <li><strong className="text-white">"Campagne"</strong> : une collecte de fonds créée sur la Plateforme</li>
                </ul>
              </section>

              {/* Eligibility */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">2. Éligibilité</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Pour utiliser Soutrali, vous devez :
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li>Avoir au moins 18 ans ou avoir l'autorisation d'un parent/tuteur</li>
                  <li>Avoir la capacité juridique de conclure un contrat</li>
                  <li>Fournir des informations exactes et complètes lors de l'inscription</li>
                  <li>Ne pas avoir été précédemment banni de la Plateforme</li>
                  <li>Respecter toutes les lois applicables dans votre juridiction</li>
                </ul>
              </section>

              {/* Account */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">3. Compte Utilisateur</h2>

                <h3 className="text-xl font-bold text-white mb-3 mt-6">3.1 Création de Compte</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Vous devez créer un compte pour accéder à certaines fonctionnalités. Vous êtes responsable
                  de maintenir la confidentialité de vos identifiants de connexion et de toutes les activités
                  sous votre compte.
                </p>

                <h3 className="text-xl font-bold text-white mb-3 mt-6">3.2 Exactitude des Informations</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Vous vous engagez à fournir des informations exactes, complètes et à jour. Vous devez
                  mettre à jour vos informations en cas de changement.
                </p>

                <h3 className="text-xl font-bold text-white mb-3 mt-6">3.3 Sécurité du Compte</h3>
                <p className="text-gray-400 leading-relaxed">
                  Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte
                  ou de toute autre violation de sécurité.
                </p>
              </section>

              {/* Campaigns */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">4. Campagnes de Collecte de Fonds</h2>

                <h3 className="text-xl font-bold text-white mb-3 mt-6">4.1 Création de Campagnes</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Les Organisateurs peuvent créer des campagnes pour des causes légitimes. Toutes les
                  campagnes doivent :
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li>Être véridiques et ne pas induire en erreur</li>
                  <li>Respecter toutes les lois applicables</li>
                  <li>Ne pas promouvoir la haine, la violence ou des activités illégales</li>
                  <li>Être approuvées par notre équipe avant publication</li>
                </ul>

                <h3 className="text-xl font-bold text-white mb-3 mt-6">4.2 Responsabilité de l'Organisateur</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  L'Organisateur est responsable de :
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li>L'exactitude de toutes les informations de la campagne</li>
                  <li>L'utilisation appropriée des fonds collectés</li>
                  <li>La communication régulière avec les donateurs</li>
                  <li>Le respect des obligations fiscales et légales</li>
                </ul>

                <h3 className="text-xl font-bold text-white mb-3 mt-6">4.3 Retrait de Campagnes</h3>
                <p className="text-gray-400 leading-relaxed">
                  Nous nous réservons le droit de suspendre ou supprimer toute campagne qui viole ces
                  Conditions ou qui semble frauduleuse, sans préavis.
                </p>
              </section>

              {/* Donations */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. Donations</h2>

                <h3 className="text-xl font-bold text-white mb-3 mt-6">5.1 Processus de Don</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Les Donateurs peuvent contribuer aux campagnes via les méthodes de paiement disponibles.
                  Tous les dons sont volontaires et non remboursables, sauf en cas de fraude avérée.
                </p>

                <h3 className="text-xl font-bold text-white mb-3 mt-6">5.2 Frais de Transaction</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Des frais de plateforme et de traitement des paiements s'appliquent. Ces frais sont
                  clairement indiqués avant la finalisation de votre don.
                </p>

                <h3 className="text-xl font-bold text-white mb-3 mt-6">5.3 Reçus</h3>
                <p className="text-gray-400 leading-relaxed">
                  Un reçu électronique sera envoyé pour chaque don effectué. Ce reçu peut être utilisé
                  à des fins fiscales selon votre juridiction.
                </p>
              </section>

              {/* Fees */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">6. Frais et Paiements</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Soutrali facture des frais de plateforme sur les fonds collectés. Ces frais couvrent :
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li>Le traitement des paiements</li>
                  <li>La maintenance de la plateforme</li>
                  <li>Le support client</li>
                  <li>Les services de sécurité et de conformité</li>
                </ul>
                <p className="text-gray-400 leading-relaxed mt-4">
                  Les frais exacts sont affichés lors de la création de votre campagne et peuvent varier
                  selon le type de campagne et le montant collecté.
                </p>
              </section>

              {/* Prohibited Activities */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">7. Activités Interdites</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Vous vous engagez à ne pas :
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li>Créer de fausses campagnes ou fournir des informations trompeuses</li>
                  <li>Utiliser la plateforme pour des activités illégales ou frauduleuses</li>
                  <li>Harceler, menacer ou abuser d'autres utilisateurs</li>
                  <li>Violer les droits de propriété intellectuelle de tiers</li>
                  <li>Tenter d'accéder sans autorisation à des comptes ou systèmes</li>
                  <li>Diffuser des virus, malwares ou autres codes malveillants</li>
                  <li>Utiliser des robots ou scripts automatisés sans autorisation</li>
                  <li>Collecter des informations sur d'autres utilisateurs sans leur consentement</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">8. Propriété Intellectuelle</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  La Plateforme et son contenu (textes, graphiques, logos, images, logiciels) sont la
                  propriété de Soutrali ou de ses concédants de licence et sont protégés par les lois
                  sur la propriété intellectuelle.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Vous conservez tous les droits sur le contenu que vous créez (descriptions de campagnes,
                  images, etc.), mais vous accordez à Soutrali une licence pour afficher et promouvoir
                  ce contenu sur la Plateforme.
                </p>
              </section>

              {/* Liability */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">9. Limitation de Responsabilité</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Soutrali fournit une plateforme de mise en relation entre Organisateurs et Donateurs.
                  Nous ne sommes pas responsables de :
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li>L'exactitude des informations des campagnes</li>
                  <li>L'utilisation des fonds collectés par les Organisateurs</li>
                  <li>Les litiges entre Organisateurs et Donateurs</li>
                  <li>Les pertes financières résultant de l'utilisation de la Plateforme</li>
                </ul>
                <p className="text-gray-400 leading-relaxed mt-4">
                  Dans toute la mesure permise par la loi, notre responsabilité totale ne dépassera pas
                  le montant des frais que vous avez payés à Soutrali au cours des 12 derniers mois.
                </p>
              </section>

              {/* Termination */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">10. Résiliation</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Vous pouvez fermer votre compte à tout moment. Nous nous réservons le droit de suspendre
                  ou résilier votre compte si vous violez ces Conditions ou si nous soupçonnons une
                  activité frauduleuse.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  En cas de résiliation, vous restez responsable de toutes les obligations financières
                  en cours et de l'utilisation appropriée des fonds déjà collectés.
                </p>
              </section>

              {/* Changes */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">11. Modifications des Conditions</h2>
                <p className="text-gray-400 leading-relaxed">
                  Nous pouvons modifier ces Conditions à tout moment. Les modifications importantes seront
                  notifiées par email ou via la Plateforme. Votre utilisation continue de Soutrali après
                  ces modifications constitue votre acceptation des nouvelles Conditions.
                </p>
              </section>

              {/* Governing Law */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">12. Droit Applicable</h2>
                <p className="text-gray-400 leading-relaxed">
                  Ces Conditions sont régies par les lois du Cameroun. Tout litige sera soumis à la
                  juridiction exclusive des tribunaux de Yaoundé, Cameroun.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. Nous Contacter</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Pour toute question concernant ces Conditions d'Utilisation, veuillez nous contacter :
                </p>
                <div className="bg-dark-600 rounded-lg p-6 border border-dark-500">
                  <p className="text-white mb-2"><strong>Email :</strong> <a href="mailto:legal@soutrali.com" className="text-primary-500 hover:text-primary-400">legal@soutrali.com</a></p>
                  <p className="text-white mb-2"><strong>Téléphone :</strong> +237 6XX XX XX XX</p>
                  <p className="text-white"><strong>Adresse :</strong> Yaoundé, Cameroun</p>
                </div>
              </section>

              {/* Acceptance */}
              <section className="mt-8 bg-primary-600/10 border border-primary-500/30 rounded-lg p-6">
                <p className="text-white font-semibold">
                  En utilisant Soutrali, vous reconnaissez avoir lu, compris et accepté ces Conditions
                  d'Utilisation dans leur intégralité.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
