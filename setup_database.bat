@echo off
chcp 65001 >nul
REM ============================================
REM PostgreSQL Setup Script - Bilingual
REM Script de configuration PostgreSQL - Bilingue
REM ============================================

REM Check if language parameter is passed
set SCRIPT_LANG=%1
if "%SCRIPT_LANG%"=="" (
    :lang_select
    cls
    echo.
    echo ========================================
    echo   Language Selection / Sélection de Langue
    echo ========================================
    echo.
    echo [1] English
    echo [2] Français
    echo.
    set /p lang_choice="Choose / Choisir (1 ou 2): "

    if "%lang_choice%"=="1" set SCRIPT_LANG=en
    if "%lang_choice%"=="2" set SCRIPT_LANG=fr

    if "%SCRIPT_LANG%"=="" (
        echo Invalid / Invalide
        timeout /t 2 >nul
        goto lang_select
    )
)

if "%SCRIPT_LANG%"=="en" goto english
if "%SCRIPT_LANG%"=="fr" goto french

:english
cls
echo.
echo ========================================
echo   PostgreSQL Configuration
echo ========================================
echo.

echo [INFO] This script will configure the PostgreSQL database.
echo.
echo Default credentials:
echo   - Database : soutrali_db
echo   - User     : soutrali_user
echo   - Password : soutrali_pass
echo.

REM Check if psql is available
psql --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] PostgreSQL is not installed or psql is not in PATH.
    echo.
    echo Please install PostgreSQL from:
    echo https://www.postgresql.org/download/windows/
    echo.
    echo After installation, add PostgreSQL to PATH:
    echo Example: C:\Program Files\PostgreSQL\14\bin
    echo.
    pause
    exit /b 1
)

echo [INFO] PostgreSQL found:
psql --version
echo.

echo [INFO] Enter the password for the 'postgres' user (superuser)
echo (Password set during PostgreSQL installation)
echo.

REM Create temporary SQL file
echo CREATE USER soutrali_user WITH PASSWORD 'soutrali_pass'; > temp_setup.sql
echo CREATE DATABASE soutrali_db OWNER soutrali_user; >> temp_setup.sql
echo GRANT ALL PRIVILEGES ON DATABASE soutrali_db TO soutrali_user; >> temp_setup.sql
echo ALTER USER soutrali_user CREATEDB; >> temp_setup.sql

REM Execute SQL script
psql -U postgres -f temp_setup.sql

if errorlevel 1 (
    echo.
    echo [WARNING] Some commands may have failed.
    echo This may be normal if the user or database already exists.
    echo.
) else (
    echo.
    echo [OK] Database configured successfully!
    echo.
)

REM Clean up temporary file
del temp_setup.sql 2>nul

REM Test connection
echo [INFO] Testing connection...
echo.
set PGPASSWORD=soutrali_pass
psql -U soutrali_user -d soutrali_db -h localhost -c "SELECT version();"

if errorlevel 1 (
    echo.
    echo [ERROR] Unable to connect to database.
    echo.
    echo Check pg_hba.conf file:
    echo C:\Program Files\PostgreSQL\14\data\pg_hba.conf
    echo.
    echo Add or modify this line:
    echo host    all             all             127.0.0.1/32            md5
    echo.
    echo Then restart PostgreSQL:
    echo net stop postgresql-x64-14
    echo net start postgresql-x64-14
    echo.
) else (
    echo.
    echo [OK] Connection successful!
    echo.
    echo Database : soutrali_db
    echo User     : soutrali_user
    echo Password : soutrali_pass
    echo.
)

set PGPASSWORD=
pause
exit /b 0

:french
cls
echo.
echo ========================================
echo   Configuration PostgreSQL
echo ========================================
echo.

echo [INFO] Ce script va configurer la base de données PostgreSQL.
echo.
echo Identifiants par défaut :
echo   - Base de données : soutrali_db
echo   - Utilisateur     : soutrali_user
echo   - Mot de passe    : soutrali_pass
echo.

REM Vérifier si psql est disponible
psql --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] PostgreSQL n'est pas installé ou psql n'est pas dans le PATH.
    echo.
    echo Veuillez installer PostgreSQL depuis :
    echo https://www.postgresql.org/download/windows/
    echo.
    echo Après l'installation, ajoutez PostgreSQL au PATH :
    echo Exemple: C:\Program Files\PostgreSQL\14\bin
    echo.
    pause
    exit /b 1
)

echo [INFO] PostgreSQL trouvé :
psql --version
echo.

echo [INFO] Entrez le mot de passe de l'utilisateur 'postgres' (superuser)
echo (Le mot de passe défini lors de l'installation de PostgreSQL)
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
    echo [ATTENTION] Certaines commandes ont peut-être échoué.
    echo Cela peut être normal si l'utilisateur ou la base existe déjà.
    echo.
) else (
    echo.
    echo [OK] Base de données configurée avec succès !
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
    echo [ERREUR] Impossible de se connecter à la base de données.
    echo.
    echo Vérifiez le fichier pg_hba.conf :
    echo C:\Program Files\PostgreSQL\14\data\pg_hba.conf
    echo.
    echo Ajoutez ou modifiez cette ligne :
    echo host    all             all             127.0.0.1/32            md5
    echo.
    echo Puis redémarrez PostgreSQL :
    echo net stop postgresql-x64-14
    echo net start postgresql-x64-14
    echo.
) else (
    echo.
    echo [OK] Connexion réussie !
    echo.
    echo Base de données : soutrali_db
    echo Utilisateur     : soutrali_user
    echo Mot de passe    : soutrali_pass
    echo.
)

set PGPASSWORD=
pause
exit /b 0
