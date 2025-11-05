# Configuration de la Base de Données PostgreSQL

Ce guide vous aide à configurer PostgreSQL pour le projet Soutrali.

## Informations de Connexion

Les identifiants par défaut pour le développement sont :

- **Nom de la base de données** : `soutrali_db`
- **Utilisateur** : `soutrali_user`
- **Mot de passe** : `soutrali_pass`
- **Host** : `localhost`
- **Port** : `5432`

> ⚠️ **IMPORTANT** : Ces identifiants sont pour le développement local uniquement.
> En production, utilisez des mots de passe forts et sécurisés !

## Installation de PostgreSQL

### Sur Windows

1. Téléchargez PostgreSQL depuis [postgresql.org](https://www.postgresql.org/download/windows/)
2. Installez PostgreSQL (notez bien le mot de passe du superuser `postgres`)
3. Ajoutez PostgreSQL au PATH (normalement fait automatiquement)

### Sur macOS

```bash
brew install postgresql@14
brew services start postgresql@14
```

### Sur Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Configuration de la Base de Données

### Méthode 1 : Avec l'utilisateur postgres (Recommandé pour Windows)

```powershell
# 1. Ouvrir PowerShell ou CMD et se connecter à PostgreSQL
psql -U postgres

# 2. Dans la console psql, exécuter :
CREATE USER soutrali_user WITH PASSWORD 'soutrali_pass';
CREATE DATABASE soutrali_db OWNER soutrali_user;
GRANT ALL PRIVILEGES ON DATABASE soutrali_db TO soutrali_user;
ALTER USER soutrali_user CREATEDB;

# 3. Quitter psql
\q
```

### Méthode 2 : Avec createdb/createuser (Linux/macOS)

```bash
# Se connecter en tant que postgres
sudo -u postgres psql

# Ou utiliser les commandes directement
sudo -u postgres createuser soutrali_user -P
# Entrer le mot de passe : soutrali_pass

sudo -u postgres createdb soutrali_db -O soutrali_user
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE soutrali_db TO soutrali_user;"
```

## Configuration du Projet

1. **Copier le fichier d'environnement** :
   ```bash
   # À la racine du projet SOUTRALI/
   cp .env.example .env
   ```

2. **Vérifier le fichier .env** :
   Le fichier `.env` doit contenir :
   ```env
   DATABASE_URL=postgresql://soutrali_user:soutrali_pass@localhost:5432/soutrali_db
   ```

3. **Appliquer les migrations** :
   ```bash
   cd backend
   python manage.py migrate
   ```

4. **Créer un superuser Django** :
   ```bash
   python manage.py createsuperuser
   ```

## Vérification de la Connexion

### Tester la connexion à PostgreSQL :

```powershell
# Windows PowerShell
psql -U soutrali_user -d soutrali_db -h localhost

# Si la connexion réussit, vous verrez :
# soutrali_db=>
```

### Tester depuis Django :

```bash
cd backend
python manage.py dbshell
```

## Problèmes Courants

### Erreur : "authentification par mot de passe échouée"

**Solution 1** : Vérifier le fichier `pg_hba.conf`

1. Trouver le fichier : `C:\Program Files\PostgreSQL\14\data\pg_hba.conf` (Windows)
2. Modifier la ligne pour `localhost` :
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            md5
   # IPv6 local connections:
   host    all             all             ::1/128                 md5
   ```
3. Redémarrer PostgreSQL :
   ```powershell
   # Windows (en tant qu'administrateur)
   net stop postgresql-x64-14
   net start postgresql-x64-14
   ```

**Solution 2** : Réinitialiser le mot de passe

```sql
-- Se connecter en tant que postgres
psql -U postgres

-- Réinitialiser le mot de passe
ALTER USER soutrali_user WITH PASSWORD 'soutrali_pass';
\q
```

### Erreur : "database soutrali_db does not exist"

```bash
# Créer la base de données
psql -U postgres -c "CREATE DATABASE soutrali_db OWNER soutrali_user;"
```

### Erreur : "role soutrali_user does not exist"

```bash
# Créer l'utilisateur
psql -U postgres -c "CREATE USER soutrali_user WITH PASSWORD 'soutrali_pass';"
```

### Port 5432 déjà utilisé

```powershell
# Vérifier quel processus utilise le port
netstat -ano | findstr :5432

# Arrêter PostgreSQL et le redémarrer
net stop postgresql-x64-14
net start postgresql-x64-14
```

## Configuration pour la Production

Pour la production, utilisez des identifiants sécurisés :

```env
# Générer un mot de passe fort
DATABASE_URL=postgresql://soutrali_prod_user:VOTRE_MOT_DE_PASSE_FORT@host:5432/soutrali_prod_db
```

### Bonnes pratiques :

- ✅ Utiliser des mots de passe de 20+ caractères
- ✅ Combiner majuscules, minuscules, chiffres et symboles
- ✅ Ne jamais commiter le fichier `.env` dans Git
- ✅ Utiliser des services comme AWS RDS, Heroku Postgres, etc.
- ✅ Activer SSL pour les connexions à distance
- ✅ Limiter les connexions par IP
- ✅ Faire des sauvegardes régulières

## Backups

### Créer un backup :

```bash
pg_dump -U soutrali_user soutrali_db > backup.sql
```

### Restaurer un backup :

```bash
psql -U soutrali_user soutrali_db < backup.sql
```

## Support

Pour plus d'aide :
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Documentation Django avec PostgreSQL](https://docs.djangoproject.com/en/5.0/ref/databases/#postgresql-notes)
- Ouvrir une issue sur le [GitHub du projet](https://github.com/fanymodeste25/SOUTRALI/issues)
