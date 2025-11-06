import { Layout } from '../components/common/Layout';
import { Shield } from 'lucide-react';

export function PrivacyPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600">
              SOUTRALI s'engage à protéger la confidentialité de vos données personnelles.
              Cette politique décrit comment nous collectons, utilisons et protégeons vos
              informations lorsque vous utilisez notre plateforme de financement participatif.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Données collectées
            </h2>
            <p className="text-gray-600 mb-3">
              Nous collectons les informations suivantes :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Informations d'identification : nom, prénom, adresse email</li>
              <li>Informations de contact : numéro de téléphone, adresse postale</li>
              <li>Informations de paiement : coordonnées bancaires, historique de transactions</li>
              <li>Données de navigation : adresse IP, cookies, pages visitées</li>
              <li>Contenus générés : campagnes créées, commentaires, messages</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Utilisation des données
            </h2>
            <p className="text-gray-600 mb-3">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Traiter vos dons et transactions</li>
              <li>Vous envoyer des notifications concernant vos campagnes</li>
              <li>Améliorer nos services et votre expérience utilisateur</li>
              <li>Prévenir la fraude et assurer la sécurité de la plateforme</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Partage des données
            </h2>
            <p className="text-gray-600">
              Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos
              informations avec :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Nos prestataires de services de paiement (FedaPay, Moov Money, Orange Money)</li>
              <li>Nos partenaires techniques nécessaires au fonctionnement de la plateforme</li>
              <li>Les autorités légales si requis par la loi</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Sécurité des données
            </h2>
            <p className="text-gray-600">
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles
              appropriées pour protéger vos données contre tout accès non autorisé, modification,
              divulgation ou destruction. Toutes les transactions sont cryptées via SSL/TLS.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Vos droits
            </h2>
            <p className="text-gray-600 mb-3">
              Conformément à la réglementation en vigueur, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification de vos données</li>
              <li>Droit à l'effacement de vos données</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité de vos données</li>
              <li>Droit d'opposition au traitement</li>
            </ul>
            <p className="text-gray-600 mt-3">
              Pour exercer ces droits, contactez-nous à : privacy@soutrali.bf
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Cookies
            </h2>
            <p className="text-gray-600">
              Notre site utilise des cookies pour améliorer votre expérience de navigation,
              mémoriser vos préférences et analyser notre trafic. Vous pouvez gérer vos
              préférences de cookies via les paramètres de votre navigateur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Conservation des données
            </h2>
            <p className="text-gray-600">
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour
              fournir nos services et respecter nos obligations légales. Les données de
              transaction sont conservées pendant 10 ans conformément aux obligations comptables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Modifications
            </h2>
            <p className="text-gray-600">
              Nous nous réservons le droit de modifier cette politique de confidentialité à
              tout moment. Les modifications entreront en vigueur dès leur publication sur
              cette page. Nous vous encourageons à consulter régulièrement cette page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Contact
            </h2>
            <p className="text-gray-600">
              Pour toute question concernant cette politique de confidentialité ou le
              traitement de vos données personnelles, contactez-nous :
            </p>
            <ul className="list-none pl-0 text-gray-600 mt-3">
              <li>Email : privacy@soutrali.bf</li>
              <li>Adresse : Ouagadougou, Burkina Faso</li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
}
