from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.blog.models import BlogCategory, BlogPost
from datetime import timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Load sample blog data for development'

    def handle(self, *args, **options):
        self.stdout.write('Loading blog categories...')

        # Create categories
        categories_data = [
            {
                'name': 'Histoires Inspirantes',
                'slug': 'histoires-inspirantes',
                'description': 'Découvrez les histoires de réussite et de solidarité de notre communauté'
            },
            {
                'name': 'Impact Social',
                'slug': 'impact-social',
                'description': "L'impact de vos contributions sur les communautés africaines"
            },
            {
                'name': 'Conseils et Guides',
                'slug': 'conseils-et-guides',
                'description': 'Conseils pour créer et gérer vos campagnes de collecte de fonds'
            },
            {
                'name': 'Actualités Soutrali',
                'slug': 'actualites-soutrali',
                'description': 'Les dernières nouvelles et mises à jour de la plateforme Soutrali'
            },
            {
                'name': 'Éducation et Formation',
                'slug': 'education-et-formation',
                'description': "Articles sur l'éducation, les bourses et les opportunités de formation"
            },
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = BlogCategory.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            categories[cat_data['slug']] = category
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {category.name}'))
            else:
                self.stdout.write(f'Category already exists: {category.name}')

        # Get or create a default author (first admin or staff user)
        author = User.objects.filter(is_staff=True).first()
        if not author:
            author = User.objects.filter(is_superuser=True).first()
        if not author:
            author = User.objects.first()

        if not author:
            self.stdout.write(self.style.ERROR('No users found. Please create a user first.'))
            return

        self.stdout.write(f'Using author: {author.email}')

        # Create blog posts
        posts_data = [
            {
                'title': 'Comment Soutrali a transformé la vie de Marie à Dakar',
                'slug': 'comment-soutrali-a-transforme-vie-marie-dakar',
                'excerpt': "L'histoire inspirante de Marie qui a pu financer l'opération de sa fille grâce à la solidarité de la communauté Soutrali.",
                'content': """Marie, une mère courageuse vivant à Dakar, a vu sa vie changer grâce à la plateforme Soutrali. Sa fille de 8 ans, Awa, avait besoin d'une opération urgente du cœur. Les frais médicaux s'élevaient à 5 millions de FCFA, une somme impossible à réunir pour Marie qui travaille comme couturière.

Désespérée mais déterminée, Marie a découvert Soutrali par l'intermédiaire d'une amie. En quelques jours, elle a créé sa campagne, partagé son histoire avec des photos et des documents médicaux.

La réponse de la communauté a été extraordinaire. En seulement 3 semaines, plus de 400 personnes ont contribué, permettant de réunir les 5 millions nécessaires et même un peu plus pour les soins post-opératoires.

Aujourd'hui, Awa se porte bien et a pu retourner à l'école. Marie exprime sa gratitude infinie : "Soutrali m'a redonné espoir. Je ne connaissais pas la plupart des donateurs, mais ils ont cru en notre histoire. C'est ça, la vraie solidarité africaine."

Cette histoire n'est qu'une parmi des centaines d'autres. Chaque jour, Soutrali connecte ceux qui ont besoin d'aide avec ceux qui peuvent aider, créant ainsi un réseau de solidarité à travers toute l'Afrique.""",
                'category': categories['histoires-inspirantes'],
                'is_featured': True,
                'status': 'published',
                'views_count': 1245,
            },
            {
                'title': '10 conseils pour réussir votre campagne de financement participatif',
                'slug': '10-conseils-reussir-campagne-financement-participatif',
                'excerpt': 'Découvrez les meilleures pratiques pour maximiser les chances de succès de votre campagne sur Soutrali.',
                'content': """Lancer une campagne de financement participatif peut sembler intimidant, mais avec les bonnes stratégies, vos chances de succès augmentent considérablement. Voici nos 10 conseils essentiels :

1. **Racontez une histoire authentique**
Votre histoire doit toucher le cœur des gens. Soyez honnête, transparent et personnel. Expliquez pourquoi cette cause vous tient à cœur.

2. **Fixez un objectif réaliste**
Un objectif trop élevé peut décourager les donateurs. Calculez précisément vos besoins et ajoutez une petite marge pour les imprévus.

3. **Utilisez des photos et vidéos de qualité**
Le contenu visuel est crucial. Utilisez des photos claires et authentiques. Une courte vidéo augmente les chances de succès de 40%.

4. **Soyez transparent sur l'utilisation des fonds**
Détaillez comment chaque franc sera utilisé. La transparence inspire confiance.

5. **Partagez régulièrement des mises à jour**
Tenez vos donateurs informés de vos progrès. Cela encourage plus de dons et fidélise votre communauté.

6. **Mobilisez votre réseau personnel d'abord**
Commencez par votre famille, vos amis et collègues. Un bon démarrage attire plus de donateurs inconnus.

7. **Utilisez les réseaux sociaux intelligemment**
Partagez votre campagne sur WhatsApp, Facebook, Instagram. Créez des posts engageants et utilisez des hashtags pertinents.

8. **Remerciez chaque donateur**
La gratitude crée des ambassadeurs. Un simple message de remerciement peut encourager le partage.

9. **Fournissez tous les documents justificatifs**
Factures, devis, certificats médicaux - la documentation renforce la crédibilité.

10. **Ne baissez pas les bras**
Les campagnes prennent du temps. Continuez à communiquer et à partager votre histoire.

Avec ces conseils, vous êtes prêt à lancer une campagne qui résonne avec votre communauté et atteint ses objectifs !""",
                'category': categories['conseils-et-guides'],
                'is_featured': True,
                'status': 'published',
                'views_count': 892,
            },
            {
                'title': "L'impact de la technologie Mobile Money sur la solidarité en Afrique",
                'slug': 'impact-technologie-mobile-money-solidarite-afrique',
                'excerpt': "Comment les solutions de paiement mobile transforment l'entraide et la solidarité à travers le continent africain.",
                'content': """La révolution du Mobile Money a fondamentalement changé la façon dont les Africains s'entraident et partagent leurs ressources.

**Une révolution silencieuse**

Il y a encore 10 ans, envoyer de l'argent d'un pays à un autre en Afrique était complexe et coûteux. Aujourd'hui, grâce à des solutions comme Wave, Orange Money et MTN Mobile Money, des millions de transactions sont effectuées chaque jour, simplement avec un téléphone.

**Impact sur la solidarité**

Cette facilité d'accès a démocratisé la philanthropie. Plus besoin d'être riche pour aider - même un petit montant peut faire la différence. Sur Soutrali, nous voyons des dons aussi petits que 500 FCFA qui, cumulés, changent des vies.

**Des chiffres impressionnants**

- 70% des dons sur Soutrali utilisent le Mobile Money
- Le montant moyen d'un don est de 5,000 FCFA
- 85% des donateurs n'ont jamais rencontré les bénéficiaires

**Témoignage**

Amadou, donateur régulier : "Avant, je voulais aider mais je ne savais pas comment. Maintenant, en quelques clics depuis mon téléphone, je peux soutenir un étudiant au Mali ou aider une maman au Togo. C'est incroyable."

**L'avenir de la solidarité**

Avec l'expansion continue du Mobile Money et des plateformes comme Soutrali, nous construisons un écosystème de solidarité panafricaine où chacun peut contribuer au bien-être collectif.

La technologie ne remplace pas le cœur humain - elle l'amplifie.""",
                'category': categories['impact-social'],
                'is_featured': False,
                'status': 'published',
                'views_count': 654,
            },
            {
                'title': 'Soutrali célèbre 10,000 campagnes financées avec succès',
                'slug': 'soutrali-celebre-10000-campagnes-financees-succes',
                'excerpt': 'Un jalon historique atteint : 10,000 projets ont été entièrement financés grâce à votre générosité.',
                'content': """Aujourd'hui marque un moment historique pour Soutrali et notre communauté !

**Un cap symbolique**

Nous venons de franchir le cap des 10,000 campagnes intégralement financées depuis le lancement de la plateforme. C'est 10,000 histoires de vie changées, 10,000 rêves réalisés, 10,000 preuves que la solidarité africaine est vivante et forte.

**Les chiffres qui parlent**

- 10,000 campagnes réussies
- Plus de 15 milliards de FCFA collectés
- 500,000+ donateurs actifs
- Présence dans 25 pays africains
- Taux de réussite moyen de 73%

**Types de projets financés**

- 35% - Frais médicaux
- 25% - Éducation et bourses
- 20% - Urgences et catastrophes
- 15% - Projets communautaires
- 5% - Entrepreneuriat

**Histoires marquantes**

Parmi ces 10,000 campagnes, certaines nous ont particulièrement touchés :
- La construction d'une école dans un village isolé du Burkina Faso
- Le financement de 50 bourses universitaires pour jeunes filles au Sénégal
- L'aide d'urgence après les inondations au Niger
- Le soutien à 200 micro-entrepreneurs au Rwanda

**Merci à vous tous**

Ce succès est le vôtre. Chaque donateur, chaque organisateur, chaque personne qui a partagé une campagne a contribué à ce résultat extraordinaire.

**Et ce n'est que le début**

Nous continuons d'innover pour mieux vous servir :
- Nouvelles options de paiement
- Interface améliorée
- Support multilingue étendu
- Partenariats avec des ONG locales

Ensemble, continuons à bâtir une Afrique solidaire et prospère.

Merci d'être Soutrali. 🌍❤️""",
                'category': categories['actualites-soutrali'],
                'is_featured': True,
                'status': 'published',
                'views_count': 2103,
            },
            {
                'title': "De l'école primaire à l'université : Le parcours inspirant de Fatou",
                'slug': 'ecole-primaire-universite-parcours-inspirant-fatou',
                'excerpt': "Fatou a bénéficié d'une bourse financée par la communauté Soutrali. Aujourd'hui diplômée, elle aide d'autres jeunes à poursuivre leurs rêves.",
                'content': """Il y a 5 ans, Fatou était une brillante élève de CM2 au Togo. Première de sa classe, elle rêvait de devenir médecin. Mais sa famille n'avait pas les moyens de financer ses études secondaires.

**Le début d'une aventure**

Sa maîtresse, Madame Kofi, a entendu parler de Soutrali et a décidé de lancer une campagne pour financer les frais de scolarité de Fatou. L'objectif : 1,5 million de FCFA pour 6 ans de collège et lycée.

**Un élan de solidarité**

La communauté a répondu présente. Des enseignants, des parents d'élèves, mais aussi des inconnus touchés par l'histoire de Fatou ont contribué. En 2 mois, l'objectif était atteint.

**Le parcours**

Fatou n'a pas déçu. Elle a excellé au collège, puis au lycée, obtenant son baccalauréat avec mention Très Bien. Elle a ensuite intégré la faculté de médecine grâce à une nouvelle campagne Soutrali.

**Aujourd'hui**

Fatou vient d'obtenir son diplôme de docteur en médecine. Mais l'histoire ne s'arrête pas là. Profondément reconnaissante, elle a décidé de redonner à la communauté.

Elle a créé un fonds de bourses via Soutrali qui aide maintenant 10 jeunes filles à poursuivre leurs études chaque année. Elle contribue également financièrement à d'autres campagnes éducatives.

**Son message**

"Soutrali ne m'a pas seulement aidée financièrement. La plateforme m'a appris la valeur de la solidarité. Quelqu'un a cru en moi quand je n'avais rien. Aujourd'hui, c'est mon tour de croire en d'autres. C'est un cercle vertueux qui doit continuer."

**L'effet multiplicateur**

L'histoire de Fatou illustre parfaitement l'impact à long terme de nos actions. Un don aujourd'hui peut créer des générations de changement positif.

Chaque campagne que vous soutenez est une graine plantée. Qui sait quel arbre magnifique elle deviendra ?""",
                'category': categories['education-et-formation'],
                'is_featured': False,
                'status': 'published',
                'views_count': 1567,
            },
            {
                'title': 'Guide complet : Comment utiliser Mobile Money sur Soutrali',
                'slug': 'guide-complet-utiliser-mobile-money-soutrali',
                'excerpt': 'Tout ce que vous devez savoir pour faire un don ou recevoir des fonds via Mobile Money sur notre plateforme.',
                'content': """Le Mobile Money simplifie les transactions sur Soutrali. Voici un guide complet pour utiliser ce service efficacement.

**Pourquoi Mobile Money ?**

- Rapide et sécurisé
- Pas besoin de carte bancaire
- Disponible 24/7
- Confirmation instantanée
- Faibles frais de transaction

**Les opérateurs supportés**

Soutrali accepte :
- Wave
- Orange Money
- MTN Mobile Money

**Pour faire un don**

1. Choisissez la campagne que vous souhaitez soutenir
2. Cliquez sur "Faire un don"
3. Entrez le montant
4. Sélectionnez votre opérateur Mobile Money
5. Entrez votre numéro de téléphone
6. Validez la transaction sur votre téléphone
7. Recevez la confirmation par SMS

**Pour recevoir des fonds**

Si vous êtes organisateur de campagne :

1. Créez votre compte Soutrali
2. Complétez votre profil KYC (vérification d'identité)
3. Lancez votre campagne
4. Indiquez vos coordonnées Mobile Money
5. Les fonds sont transférés automatiquement une fois l'objectif atteint

**Frais de transaction**

- Dons : 0 frais pour le donateur
- Retraits : 7% de frais de plateforme (couvrent l'hébergement, la sécurité, etc.)

**Sécurité**

Toutes les transactions sont :
- Cryptées de bout en bout
- Conformes aux normes BCEAO
- Tracées et vérifiables
- Protégées contre la fraude

**En cas de problème**

Notre support est disponible :
- Par email : support@soutrali.com
- Par WhatsApp : +221 XX XXX XXXX
- Chat en ligne sur le site

**Conseils pratiques**

- Vérifiez toujours le numéro avant de valider
- Gardez vos confirmations SMS
- Utilisez un code PIN fort
- Ne partagez jamais vos codes avec qui que ce soit

**Questions fréquentes**

Q: Combien de temps prend un transfert ?
R: Instantané dans 95% des cas, maximum 24h.

Q: Y a-t-il un montant minimum/maximum ?
R: Minimum 500 FCFA, maximum selon votre opérateur.

Q: Puis-je annuler un don ?
R: Oui, dans les 30 minutes suivant la transaction.

Avec Mobile Money et Soutrali, la solidarité est à portée de main !""",
                'category': categories['conseils-et-guides'],
                'is_featured': False,
                'status': 'published',
                'views_count': 743,
            },
        ]

        for post_data in posts_data:
            # Calculate a published date (recent posts)
            days_ago = len(posts_data) - posts_data.index(post_data)
            published_at = timezone.now() - timedelta(days=days_ago * 5)

            post, created = BlogPost.objects.get_or_create(
                slug=post_data['slug'],
                defaults={
                    **post_data,
                    'author': author,
                    'published_at': published_at,
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f'Created blog post: {post.title}'))
            else:
                self.stdout.write(f'Blog post already exists: {post.title}')

        self.stdout.write(self.style.SUCCESS('\n✅ Blog data loaded successfully!'))
        self.stdout.write(f'Created {len(categories_data)} categories and {len(posts_data)} blog posts')
