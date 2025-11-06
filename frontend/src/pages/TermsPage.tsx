import { Layout } from '../components/common/Layout';
import { FileText } from 'lucide-react';

export function TermsPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conditions d'utilisation
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Acceptation des conditions
            </h2>
            <p className="text-gray-600">
              En accédant et en utilisant la plateforme SOUTRALI, vous acceptez d'être lié
              par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions,
              veuillez ne pas utiliser notre plateforme.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Description du service
            </h2>
            <p className="text-gray-600">
              SOUTRALI est une plateforme de financement participatif qui permet aux
              utilisateurs de créer des campagnes de collecte de fonds et aux donateurs
              de soutenir financièrement ces projets. Nous agissons en tant qu'intermédiaire
              entre les organisateurs de campagnes et les donateurs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Inscription et compte utilisateur
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
              <li>Vous devez fournir des informations exactes et complètes lors de l'inscription</li>
              <li>Vous êtes responsable de la confidentialité de votre mot de passe</li>
              <li>Vous êtes responsable de toutes les activités effectuées depuis votre compte</li>
              <li>Vous devez nous informer immédiatement de toute utilisation non autorisée</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Création de campagnes
            </h2>
            <p className="text-gray-600 mb-3">
              En tant qu'organisateur de campagne, vous vous engagez à :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Fournir des informations véridiques et précises sur votre projet</li>
              <li>Utiliser les fonds collectés uniquement pour l'objectif déclaré</li>
              <li>Tenir les donateurs informés de l'avancement du projet</li>
              <li>Ne pas créer de campagnes frauduleuses, trompeuses ou illégales</li>
              <li>Respecter toutes les lois applicables</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Dons et paiements
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Tous les dons sont volontaires et généralement non remboursables</li>
              <li>Les paiements sont traités via des prestataires tiers sécurisés</li>
              <li>SOUTRALI prélève une commission de 5% sur les fonds collectés</li>
              <li>Les frais de transaction peuvent s'appliquer selon le mode de paiement</li>
              <li>Vous recevrez un reçu pour chaque don effectué</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Contenu interdit
            </h2>
            <p className="text-gray-600 mb-3">
              Il est strictement interdit de créer des campagnes pour :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Des activités illégales ou frauduleuses</li>
              <li>Du contenu haineux, discriminatoire ou diffamatoire</li>
              <li>Des produits ou services illégaux</li>
              <li>Du harcèlement, de la violence ou de l'intimidation</li>
              <li>Des contenus violant les droits de propriété intellectuelle</li>
              <li>Des schémas pyramidaux ou systèmes de Ponzi</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Propriété intellectuelle
            </h2>
            <p className="text-gray-600">
              Tous les contenus de la plateforme (logos, textes, graphiques, logiciels)
              sont la propriété de SOUTRALI ou de ses concédants de licence et sont
              protégés par les lois sur la propriété intellectuelle. Vous conservez les
              droits sur le contenu que vous publiez, mais vous accordez à SOUTRALI une
              licence pour l'utiliser sur la plateforme.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Responsabilité
            </h2>
            <p className="text-gray-600">
              SOUTRALI agit en tant qu'intermédiaire et n'est pas responsable :
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>De l'exactitude des informations fournies par les organisateurs</li>
              <li>De l'utilisation des fonds collectés par les organisateurs</li>
              <li>Des interactions entre utilisateurs</li>
              <li>Des pertes ou dommages résultant de l'utilisation de la plateforme</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Suspension et résiliation
            </h2>
            <p className="text-gray-600">
              Nous nous réservons le droit de suspendre ou de résilier votre compte en cas
              de violation de ces conditions d'utilisation, d'activité frauduleuse ou pour
              toute autre raison jugée nécessaire pour protéger l'intégrité de la plateforme.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Modifications des conditions
            </h2>
            <p className="text-gray-600">
              Nous pouvons modifier ces conditions d'utilisation à tout moment. Les
              modifications entreront en vigueur dès leur publication. Votre utilisation
              continue de la plateforme après les modifications constitue votre acceptation
              des nouvelles conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Loi applicable
            </h2>
            <p className="text-gray-600">
              Ces conditions d'utilisation sont régies par les lois du Burkina Faso.
              Tout litige sera soumis à la juridiction exclusive des tribunaux de Ouagadougou.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Contact
            </h2>
            <p className="text-gray-600">
              Pour toute question concernant ces conditions d'utilisation, contactez-nous :
            </p>
            <ul className="list-none pl-0 text-gray-600 mt-3">
              <li>Email : legal@soutrali.bf</li>
              <li>Adresse : Ouagadougou, Burkina Faso</li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
}
