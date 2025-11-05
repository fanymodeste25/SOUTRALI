# Guide de Démarrage Rapide - Windows

Ce guide explique comment utiliser les scripts batch pour lancer facilement le projet Soutrali sur Windows.

## 📋 Prérequis

Avant d'utiliser les scripts, assurez-vous d'avoir installé :

1. **Python 3.11+** : [Télécharger Python](https://www.python.org/downloads/)
2. **PostgreSQL 14+** : [Télécharger PostgreSQL](https://www.postgresql.org/download/windows/)
3. **Node.js 18+** : [Télécharger Node.js](https://nodejs.org/) (optionnel, pour le frontend)
4. **Redis** : [Télécharger Redis pour Windows](https://github.com/microsoftarchive/redis/releases) (optionnel, pour Celery)

## 🚀 Scripts Disponibles

### 1. `setup_database.bat` - Configuration de la base de données

**Usage** : Double-cliquez sur le fichier ou exécutez dans CMD/PowerShell

```cmd
setup_database.bat
```

**Ce script fait** :
- ✅ Crée l'utilisateur PostgreSQL `soutrali_user` avec le mot de passe `soutrali_pass`
- ✅ Crée la base de données `soutrali_db`
- ✅ Configure les permissions appropriées
- ✅ Teste la connexion à la base de données

**Quand l'utiliser** :
- Première fois que vous configurez le projet
- Si vous avez des problèmes de connexion à la base de données

---

### 2. `start.bat` - Lancer le backend uniquement

**Usage** : Double-cliquez sur le fichier ou exécutez dans CMD/PowerShell

```cmd
start.bat
```

**Ce script fait** :
- ✅ Crée l'environnement virtuel Python si nécessaire
- ✅ Active l'environnement virtuel
- ✅ Installe les dépendances Python si nécessaire
- ✅ Copie `.env.example` vers `.env` si `.env` n'existe pas
- ✅ Vérifie la connexion PostgreSQL
- ✅ Applique les migrations de base de données
- ✅ Collecte les fichiers statiques
- ✅ Propose de créer un superuser si nécessaire
- ✅ Lance le serveur Django sur http://localhost:8000

**Quand l'utiliser** :
- Pour développement backend uniquement
- Pour tester l'API
- Si vous n'avez pas besoin du frontend React

**Accès après lancement** :
- API Backend : http://localhost:8000
- Admin Django : http://localhost:8000/admin
- Documentation API : http://localhost:8000/api/docs

---

### 3. `start_full.bat` - Lancer l'application complète

**Usage** : Double-cliquez sur le fichier ou exécutez dans CMD/PowerShell

```cmd
start_full.bat
```

**Ce script fait** :
- ✅ Tout ce que fait `start.bat`
- ✅ Lance le backend Django dans une nouvelle fenêtre
- ✅ Lance Celery Worker (si Redis est disponible)
- ✅ Lance Celery Beat (si Redis est disponible)
- ✅ Installe les dépendances frontend si nécessaire
- ✅ Lance le frontend React dans une nouvelle fenêtre
- ✅ Ouvre automatiquement le navigateur

**Quand l'utiliser** :
- Pour développement complet (frontend + backend)
- Pour tester l'application complète
- Pour démonstration

**Accès après lancement** :
- Frontend : http://localhost:5173
- Backend API : http://localhost:8000
- Admin Django : http://localhost:8000/admin
- Documentation API : http://localhost:8000/api/docs

---

### 4. `stop_all.bat` - Arrêter tous les services

**Usage** : Double-cliquez sur le fichier ou exécutez dans CMD/PowerShell

```cmd
stop_all.bat
```

**Ce script fait** :
- ✅ Arrête tous les processus Django
- ✅ Arrête tous les processus Celery
- ✅ Arrête tous les processus React/Vite
- ✅ Libère les ports 8000 et 5173

**Quand l'utiliser** :
- Pour arrêter proprement tous les services
- Si vous avez des erreurs de port déjà utilisé
- Avant de fermer votre session de travail

---

## 🎯 Workflows Recommandés

### Première Installation

```cmd
1. Cloner le repository
   git clone https://github.com/fanymodeste25/SOUTRALI.git
   cd SOUTRALI

2. Configurer la base de données
   Double-clic sur: setup_database.bat

3. Lancer l'application complète
   Double-clic sur: start_full.bat
```

### Développement Backend Uniquement

```cmd
Double-clic sur: start.bat
```

### Développement Full-Stack

```cmd
Double-clic sur: start_full.bat
```

### Arrêter Tous les Services

```cmd
Double-clic sur: stop_all.bat
```

---

## 🔧 Configuration Avancée

### Variables d'Environnement

Après le premier lancement, éditez le fichier `.env` à la racine du projet :

```env
# Django
SECRET_KEY=votre-cle-secrete
DEBUG=True

# Base de données
DATABASE_URL=postgresql://soutrali_user:soutrali_pass@localhost:5432/soutrali_db

# Redis (optionnel)
REDIS_URL=redis://localhost:6379/0

# Mobile Money (pour production)
WAVE_API_KEY=votre-cle-wave
ORANGE_API_KEY=votre-cle-orange
MTN_API_KEY=votre-cle-mtn
```

### Ports Personnalisés

Pour changer les ports par défaut, éditez les scripts :

**Backend (défaut: 8000)** - dans `start.bat` ou `start_full.bat` :
```batch
python manage.py runserver 0.0.0.0:9000
```

**Frontend (défaut: 5173)** - dans `frontend/vite.config.ts` :
```typescript
export default defineConfig({
  server: {
    port: 3000
  }
})
```

---

## ❓ Dépannage

### Erreur : "psql n'est pas reconnu"

**Solution** : Ajoutez PostgreSQL au PATH Windows

1. Ouvrez Paramètres Windows → Système → À propos → Paramètres système avancés
2. Cliquez sur "Variables d'environnement"
3. Dans "Variables système", trouvez "Path" et cliquez "Modifier"
4. Ajoutez : `C:\Program Files\PostgreSQL\14\bin`
5. Redémarrez CMD/PowerShell

### Erreur : "Port 8000 déjà utilisé"

**Solution** : Arrêtez les processus existants

```cmd
stop_all.bat
```

Ou manuellement :
```cmd
netstat -ano | findstr :8000
taskkill /PID [PID_NUMBER] /F
```

### Erreur : "authentification échouée"

**Solution** : Reconfigurez la base de données

```cmd
setup_database.bat
```

Ou manuellement dans psql :
```sql
ALTER USER soutrali_user WITH PASSWORD 'soutrali_pass';
```

### Erreur : "Redis connection failed"

**Solutions** :

1. **Installer Redis** :
   - Téléchargez depuis [Redis pour Windows](https://github.com/microsoftarchive/redis/releases)
   - Ou utilisez WSL : `wsl sudo service redis-server start`

2. **Ou désactiver Redis** :
   - Commentez les lignes Redis dans `.env`
   - Le projet fonctionnera sans cache ni Celery

### Erreur : "Module 'django' not found"

**Solution** : Réinstallez les dépendances

```cmd
venv\Scripts\activate
pip install -r requirements.txt
```

### Le frontend ne se lance pas

**Solution** : Vérifiez Node.js et npm

```cmd
node --version
npm --version

cd frontend
npm install
npm run dev
```

---

## 📚 Ressources Supplémentaires

- [Documentation complète](../README.md)
- [Configuration PostgreSQL](DATABASE_SETUP.md)
- [Guide de développement](../CONTRIBUTING.md)
- [Documentation API](http://localhost:8000/api/docs) (après lancement)

---

## 💡 Astuces

### Lancer en mode développement avec rechargement automatique

Le script `start.bat` lance déjà Django avec `runserver`, qui recharge automatiquement.
Le frontend React/Vite recharge aussi automatiquement avec HMR (Hot Module Replacement).

### Voir les logs en temps réel

Les scripts ouvrent des fenêtres CMD séparées pour chaque service.
Vous pouvez voir les logs dans chaque fenêtre.

### Lancer uniquement Celery

```cmd
venv\Scripts\activate
cd backend
celery -A soutrali worker -l info
```

### Créer un superuser manuellement

```cmd
venv\Scripts\activate
cd backend
python manage.py createsuperuser
```

### Réinitialiser la base de données

```cmd
# Supprimer la base de données
psql -U postgres -c "DROP DATABASE soutrali_db;"
psql -U postgres -c "DROP USER soutrali_user;"

# Reconfigurer
setup_database.bat

# Réappliquer les migrations
start.bat
```

---

## 🎉 C'est tout !

Vous êtes maintenant prêt à développer avec Soutrali sur Windows !

Pour toute question ou problème, consultez :
- [Issues GitHub](https://github.com/fanymodeste25/SOUTRALI/issues)
- [Documentation complète](../README.md)
- [Guide PostgreSQL](DATABASE_SETUP.md)
