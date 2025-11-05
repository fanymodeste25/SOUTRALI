@echo off
REM ============================================
REM Script de configuration PostgreSQL
REM ============================================

echo.
echo ========================================
echo   Configuration PostgreSQL
echo ========================================
echo.

echo [INFO] Ce script va configurer la base de donnees PostgreSQL.
echo.
echo Identifiants par defaut :
echo   - Base de donnees : soutrali_db
echo   - Utilisateur     : soutrali_user
echo   - Mot de passe    : soutrali_pass
echo.

REM Vérifier si psql est disponible
psql --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] PostgreSQL n'est pas installe ou psql n'est pas dans le PATH.
    echo.
    echo Veuillez installer PostgreSQL depuis :
    echo https://www.postgresql.org/download/windows/
    echo.
    echo Apres l'installation, ajoutez PostgreSQL au PATH :
    echo Exemple: C:\Program Files\PostgreSQL\14\bin
    echo.
    pause
    exit /b 1
)

echo [INFO] PostgreSQL trouve :
psql --version
echo.

echo [INFO] Entrez le mot de passe de l'utilisateur 'postgres' (superuser)
echo (Le mot de passe defini lors de l'installation de PostgreSQL)
echo.

REM Créer un fichier SQL temporaire
echo CREATE USER soutrali_user WITH PASSWORD 'soutrali_pass'; > temp_setup.sql
echo CREATE DATABASE soutrali_db OWNER soutrali_user; >> temp_setup.sql
echo GRANT ALL PRIVILEGES ON DATABASE soutrali_db TO soutrali_user; >> temp_setup.sql
echo ALTER USER soutrali_user CREATEDB; >> temp_setup.sql

REM Exécuter le script SQL
psql -U postgres -f temp_setup.sql

if errorlevel 1 (
    echo.
    echo [ATTENTION] Certaines commandes ont peut-etre echoue.
    echo Cela peut etre normal si l'utilisateur ou la base existe deja.
    echo.
) else (
    echo.
    echo [OK] Base de donnees configuree avec succes !
    echo.
)

REM Nettoyer le fichier temporaire
del temp_setup.sql 2>nul

REM Tester la connexion
echo [INFO] Test de la connexion...
echo.
set PGPASSWORD=soutrali_pass
psql -U soutrali_user -d soutrali_db -h localhost -c "SELECT version();"

if errorlevel 1 (
    echo.
    echo [ERREUR] Impossible de se connecter a la base de donnees.
    echo.
    echo Verifiez les parametres dans le fichier pg_hba.conf :
    echo C:\Program Files\PostgreSQL\14\data\pg_hba.conf
    echo.
    echo Ajoutez ou modifiez cette ligne :
    echo host    all             all             127.0.0.1/32            md5
    echo.
    echo Puis redemarrez PostgreSQL :
    echo net stop postgresql-x64-14
    echo net start postgresql-x64-14
    echo.
) else (
    echo.
    echo [OK] Connexion reussie !
    echo.
    echo Base de donnees : soutrali_db
    echo Utilisateur     : soutrali_user
    echo Mot de passe    : soutrali_pass
    echo.
)

set PGPASSWORD=

pause
