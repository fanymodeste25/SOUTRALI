import { Layout } from '../components/common/Layout';
import { FiFileText } from 'react-icons/fi';

export const TermsPage = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiFileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-vibrant">Conditions d'Utilisation</span>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptation des Conditions</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                En accédant et en utilisant la plateforme Soutrali, vous acceptez d'être lié par ces conditions
                d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description du Service</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Soutrali est une plateforme de financement participatif qui permet aux utilisateurs de :
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Créer et gérer des campagnes de collecte de fonds</li>
                <li>Faire des dons à des campagnes via mobile money</li>
                <li>Partager et promouvoir des causes</li>
                <li>Suivre l'avancement des campagnes</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Inscription et Compte Utilisateur</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pour utiliser certaines fonctionnalités de Soutrali, vous devez :
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Avoir au moins 18 ans</li>
                <li>Fournir des informations exactes et à jour</li>
                <li>Maintenir la confidentialité de vos identifiants de connexion</li>
                <li>Être responsable de toutes les activités sous votre compte</li>
                <li>Nous informer immédiatement de toute utilisation non autorisée</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Création de Campagnes</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                En créant une campagne, vous vous engagez à :
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Fournir des informations véridiques et complètes</li>
                <li>Utiliser les fonds collectés pour l'objectif déclaré</li>
                <li>Tenir les donateurs informés de l'avancement</li>
                <li>Compléter le processus de vérification KYC</li>
                <li>Respecter les lois applicables dans votre juridiction</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                Soutrali se réserve le droit de suspendre ou supprimer toute campagne qui viole ces conditions
                ou qui est frauduleuse, trompeuse ou illégale.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Dons et Paiements</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Concernant les dons :
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Tous les dons sont volontaires et non remboursables, sauf en cas de fraude avérée</li>
                <li>Les paiements sont traités par nos partenaires : Wave, Orange Money, MTN Mobile Money</li>
                <li>Des frais de service s'appliquent sur les dons collectés</li>
                <li>Les donateurs peuvent choisir de rester anonymes</li>
                <li>Soutrali ne garantit pas le succès d'une campagne</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Frais et Commissions</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Soutrali prélève une commission sur les fonds collectés pour maintenir et améliorer la plateforme.
                Les frais actuels sont :
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>5% de commission sur les dons collectés</li>
                <li>Frais de transaction mobile money selon votre fournisseur</li>
                <li>Aucun frais d'inscription ou d'abonnement</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contenu et Propriété Intellectuelle</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Vous conservez les droits sur le contenu que vous publiez, mais vous accordez à Soutrali
                une licence pour l'utiliser, l'afficher et le promouvoir sur notre plateforme.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Vous ne devez pas publier de contenu qui :
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Viole les droits d'autrui</li>
                <li>Est illégal, offensant ou inapproprié</li>
                <li>Contient des virus ou du code malveillant</li>
                <li>Fait la promotion de la haine ou de la violence</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Interdictions</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Il est strictement interdit de :
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Créer de fausses campagnes ou fournir des informations frauduleuses</li>
                <li>Utiliser la plateforme pour blanchir de l'argent</li>
                <li>Harceler, menacer ou intimider d'autres utilisateurs</li>
                <li>Tenter de contourner nos mesures de sécurité</li>
                <li>Utiliser des robots ou des scripts automatisés</li>
                <li>Collecter des données d'autres utilisateurs sans consentement</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Responsabilité et Garanties</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Soutrali fournit la plateforme "en l'état" sans garantie. Nous ne sommes pas responsables de :
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>L'exactitude des informations des campagnes</li>
                <li>L'utilisation des fonds par les organisateurs</li>
                <li>Les pertes financières liées aux dons</li>
                <li>Les interruptions de service ou erreurs techniques</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Résiliation</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous pouvons suspendre ou résilier votre compte si vous violez ces conditions.
                Vous pouvez également supprimer votre compte à tout moment depuis les paramètres.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modifications des Conditions</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous nous réservons le droit de modifier ces conditions à tout moment.
                Les modifications importantes seront communiquées par email ou notification sur la plateforme.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Loi Applicable et Juridiction</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ces conditions sont régies par les lois du Sénégal et de la CEDEAO.
                Tout litige sera soumis à la juridiction des tribunaux de Dakar, Sénégal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pour toute question concernant ces conditions d'utilisation, contactez-nous :
              </p>
              <div className="bg-primary-50 rounded-xl p-6">
                <p className="text-gray-900 font-semibold mb-2">Email : legal@soutrali.com</p>
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
