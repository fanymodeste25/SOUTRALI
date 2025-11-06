import { Layout } from '../components/common/Layout';
import { FiShield } from 'react-icons/fi';

export const PrivacyPage = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiShield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-vibrant">Politique de Confidentialité</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <div className="card-gradient p-8 md:p-12">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Chez Soutrali, nous nous engageons à protéger votre vie privée et vos données personnelles.
                Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et
                protégeons vos informations lorsque vous utilisez notre plateforme de financement participatif.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Données Collectées</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous collectons les types de données suivants :
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li><strong>Informations d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
                <li><strong>Informations de paiement :</strong> coordonnées de mobile money, historique des transactions</li>
                <li><strong>Informations de campagne :</strong> détails des campagnes créées, dons effectués</li>
                <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées</li>
                <li><strong>Documents KYC :</strong> pièces d'identité pour la vérification (organisateurs uniquement)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilisation des Données</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous utilisons vos données pour :
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Gérer votre compte et vos campagnes</li>
                <li>Traiter les paiements et les dons</li>
                <li>Vérifier votre identité (processus KYC)</li>
                <li>Vous envoyer des notifications importantes</li>
                <li>Améliorer nos services et l'expérience utilisateur</li>
                <li>Prévenir la fraude et garantir la sécurité</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Partage des Données</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations avec :
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li><strong>Fournisseurs de paiement :</strong> Wave, Orange Money, MTN Mobile Money pour traiter les transactions</li>
                <li><strong>Partenaires techniques :</strong> hébergement, analyse, support client</li>
                <li><strong>Autorités légales :</strong> en cas d'obligation légale ou de prévention de fraude</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sécurité des Données</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous mettons en œuvre des mesures de sécurité strictes :
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Cryptage SSL/TLS pour toutes les communications</li>
                <li>Stockage sécurisé des données avec chiffrement</li>
                <li>Authentification à deux facteurs disponible</li>
                <li>Audits de sécurité réguliers</li>
                <li>Accès limité aux données personnelles</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Vos Droits</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Conformément aux lois sur la protection des données, vous avez le droit de :
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Accéder à vos données personnelles</li>
                <li>Corriger ou mettre à jour vos informations</li>
                <li>Supprimer votre compte et vos données</li>
                <li>Vous opposer au traitement de vos données</li>
                <li>Demander la portabilité de vos données</li>
                <li>Retirer votre consentement à tout moment</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Pour exercer ces droits, contactez-nous à : <strong>privacy@soutrali.com</strong>
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies et Technologies Similaires</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous utilisons des cookies et technologies similaires pour améliorer votre expérience.
                Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Conservation des Données</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous conservons vos données aussi longtemps que nécessaire pour fournir nos services
                et respecter nos obligations légales. Les données de transaction sont conservées
                pendant au moins 7 ans conformément aux lois fiscales et comptables.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Transferts Internationaux</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Vos données peuvent être transférées et traitées dans des pays en dehors de votre pays de résidence.
                Nous nous assurons que ces transferts sont effectués conformément aux lois applicables sur la
                protection des données.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications de Cette Politique</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous pouvons mettre à jour cette politique de confidentialité périodiquement.
                Nous vous informerons de tout changement important par email ou via une notification sur la plateforme.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pour toute question concernant cette politique de confidentialité ou le traitement de vos données,
                veuillez nous contacter :
              </p>
              <div className="bg-primary-50 rounded-xl p-6">
                <p className="text-gray-900 font-semibold mb-2">Email : privacy@soutrali.com</p>
                <p className="text-gray-900 font-semibold mb-2">Téléphone : +221 XX XXX XX XX</p>
                <p className="text-gray-900 font-semibold">Adresse : Dakar, Sénégal</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};
