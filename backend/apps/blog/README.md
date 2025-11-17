# Blog App - Soutrali

Application de blog pour la plateforme Soutrali avec gestion des catégories et des articles.

## 📋 Fonctionnalités

- **Catégories de blog** : Organisation des articles par thématique
- **Articles de blog** : Création, édition et publication d'articles
- **Statuts** : Brouillon, Publié, Archivé
- **Articles à la une** : Mise en avant d'articles importants
- **Compteur de vues** : Suivi automatique des vues
- **Temps de lecture** : Calcul automatique du temps de lecture estimé
- **API REST complète** : Endpoints pour toutes les opérations CRUD

## 🚀 Installation et Configuration

### 1. Exécuter les migrations

```bash
cd backend
python manage.py migrate
```

### 2. Charger les données de démonstration

Pour charger des catégories et des articles de blog pré-configurés :

```bash
python manage.py load_blog_data
```

Cette commande créera :
- 5 catégories de blog
- 6 articles de blog avec du contenu réaliste
- Attribution automatique à un utilisateur admin/staff

### 3. Créer un superutilisateur (si nécessaire)

```bash
python manage.py createsuperuser
```

### 4. Accéder à l'admin Django

Visitez `http://localhost:8000/admin/` et connectez-vous pour gérer les articles de blog.

## 📚 API Endpoints

### Catégories

- `GET /api/blog/categories/` - Liste toutes les catégories
- `GET /api/blog/categories/{slug}/` - Détail d'une catégorie

### Articles

- `GET /api/blog/posts/` - Liste tous les articles publiés
- `GET /api/blog/posts/{slug}/` - Détail d'un article
- `GET /api/blog/posts/featured/` - Articles à la une (max 5)
- `GET /api/blog/posts/recent/` - Articles récents (max 10)
- `GET /api/blog/posts/category/{category_slug}/` - Articles par catégorie

### Paramètres de filtrage

- `?search=mot-clé` - Recherche dans le titre, excerpt et contenu
- `?category=id` - Filtrer par catégorie
- `?is_featured=true` - Uniquement les articles à la une
- `?status=published` - Filtrer par statut
- `?page=2` - Pagination (20 articles par page)

### Exemples

```bash
# Tous les articles
curl http://localhost:8000/api/blog/posts/

# Recherche
curl http://localhost:8000/api/blog/posts/?search=solidarité

# Articles d'une catégorie
curl http://localhost:8000/api/blog/posts/?category=1

# Articles à la une
curl http://localhost:8000/api/blog/posts/featured/
```

## 🎨 Modèles de données

### BlogCategory

```python
- name: CharField (max 100)
- slug: SlugField (auto-généré)
- description: TextField
- created_at: DateTimeField
- updated_at: DateTimeField
```

### BlogPost

```python
- title: CharField (max 255)
- slug: SlugField (auto-généré)
- excerpt: TextField (max 500)
- content: TextField
- featured_image: ImageField (optionnel)
- author: ForeignKey(User)
- category: ForeignKey(BlogCategory)
- status: CharField (draft/published/archived)
- is_featured: BooleanField
- views_count: PositiveIntegerField
- published_at: DateTimeField
- created_at: DateTimeField
- updated_at: DateTimeField
```

## 🔧 Commandes de gestion

### Charger les données de démonstration

```bash
python manage.py load_blog_data
```

Cette commande est **idempotente** : vous pouvez l'exécuter plusieurs fois sans créer de doublons.

### Créer les catégories uniquement

Si vous souhaitez créer vos propres articles mais utiliser les catégories pré-configurées :

```bash
python manage.py loaddata blog_categories
```

## 📝 Créer un article via l'admin

1. Accédez à `http://localhost:8000/admin/blog/blogpost/`
2. Cliquez sur "Ajouter un article"
3. Remplissez les champs :
   - Titre (le slug sera auto-généré)
   - Excerpt (résumé court)
   - Contenu (texte complet)
   - Image à la une (optionnel)
   - Catégorie
   - Statut (draft/published)
   - Article à la une (cocher si oui)
   - Date de publication
4. Enregistrez

## 🌍 Environnements

### Développement (SQLite/PostgreSQL local)

```bash
# Charger les données de test
python manage.py load_blog_data
```

### Production (PostgreSQL)

```bash
# Exécuter uniquement les migrations
python manage.py migrate

# Créer les catégories et articles via l'admin Django
# ou charger les données si approprié
python manage.py load_blog_data
```

## 🔒 Permissions

- **Lecture** : Publique pour les articles publiés
- **Création/Modification** : Authentification requise (staff/admin)
- **Suppression** : Admin uniquement

## 📊 Données de démonstration incluses

### Catégories

1. **Histoires Inspirantes** - Histoires de réussite de la communauté
2. **Impact Social** - Impact des contributions
3. **Conseils et Guides** - Guides pour les organisateurs
4. **Actualités Soutrali** - Nouvelles de la plateforme
5. **Éducation et Formation** - Articles sur l'éducation

### Articles

1. Comment Soutrali a transformé la vie de Marie à Dakar
2. 10 conseils pour réussir votre campagne
3. L'impact de la technologie Mobile Money
4. Soutrali célèbre 10,000 campagnes financées
5. Le parcours inspirant de Fatou
6. Guide complet Mobile Money

## 🐛 Dépannage

### Erreur "No users found"

```bash
# Créez d'abord un superutilisateur
python manage.py createsuperuser

# Puis chargez les données
python manage.py load_blog_data
```

### Les images ne s'affichent pas

Vérifiez vos paramètres `MEDIA_URL` et `MEDIA_ROOT` dans `settings.py`.

En développement, ajoutez à `urls.py` :

```python
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## 📖 Documentation API complète

Visitez `http://localhost:8000/api/docs/` pour la documentation Swagger interactive.

## 🤝 Contribution

Pour ajouter de nouvelles catégories ou modifier les articles de démonstration, éditez :
- `apps/blog/management/commands/load_blog_data.py`

## 📧 Support

Pour toute question, contactez l'équipe de développement Soutrali.
