@echo off
REM ============================================
REM Script de lancement de Soutrali
REM ============================================

echo.
echo ========================================
echo   SOUTRALI - Lancement du Projet
echo ========================================
echo.

REM Vérifier si on est dans le bon répertoire
if not exist "backend\manage.py" (
    echo [ERREUR] Le fichier manage.py n'a pas ete trouve.
    echo Assurez-vous d'executer ce script depuis la racine du projet SOUTRALI.
    pause
    exit /b 1
)

REM Vérifier si l'environnement virtuel existe
if not exist "venv\Scripts\activate.bat" (
    echo [INFO] Creation de l'environnement virtuel...
    python -m venv venv
    if errorlevel 1 (
        echo [ERREUR] Impossible de creer l'environnement virtuel.
        echo Verifiez que Python est installe correctement.
        pause
        exit /b 1
    )
    echo [OK] Environnement virtuel cree avec succes.
    echo.
)

REM Activer l'environnement virtuel
echo [INFO] Activation de l'environnement virtuel...
call venv\Scripts\activate.bat
echo [OK] Environnement virtuel active.
echo.

REM Vérifier si les dépendances sont installées
python -c "import django" 2>nul
if errorlevel 1 (
    echo [INFO] Installation des dependances...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERREUR] Impossible d'installer les dependances.
        pause
        exit /b 1
    )
    echo [OK] Dependances installees avec succes.
    echo.
)

REM Vérifier si .env existe, sinon le créer
if not exist ".env" (
    echo [INFO] Creation du fichier .env depuis .env.example...
    copy .env.example .env
    echo [OK] Fichier .env cree.
    echo.
    echo [ATTENTION] Veuillez configurer vos variables d'environnement dans .env
    echo.
)

REM Vérifier la connexion PostgreSQL
echo [INFO] Verification de la connexion PostgreSQL...
psql -U soutrali_user -d soutrali_db -h localhost -c "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo [ATTENTION] Impossible de se connecter a la base de donnees.
    echo.
    echo Voulez-vous configurer la base de donnees maintenant ? (O/N)
    set /p setup_db=
    if /i "%setup_db%"=="O" (
        call setup_database.bat
    ) else (
        echo [INFO] Veuillez configurer PostgreSQL manuellement.
        echo Consultez docs/DATABASE_SETUP.md pour plus d'informations.
        echo.
        pause
        exit /b 1
    )
)
echo [OK] Connexion a PostgreSQL reussie.
echo.

REM Aller dans le répertoire backend
cd backend

REM Appliquer les migrations
echo [INFO] Application des migrations de la base de donnees...
python manage.py migrate --noinput
if errorlevel 1 (
    echo [ERREUR] Les migrations ont echoue.
    pause
    exit /b 1
)
echo [OK] Migrations appliquees avec succes.
echo.

REM Collecter les fichiers statiques (sans confirmation)
echo [INFO] Collecte des fichiers statiques...
python manage.py collectstatic --noinput --clear
echo [OK] Fichiers statiques collectes.
echo.

REM Vérifier si un superuser existe
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); print('exists' if User.objects.filter(is_superuser=True).exists() else 'none')" > temp_superuser_check.txt 2>&1
findstr /C:"exists" temp_superuser_check.txt >nul
if errorlevel 1 (
    echo [INFO] Aucun superuser trouve.
    echo Voulez-vous creer un superuser maintenant ? (O/N)
    set /p create_superuser=
    if /i "%create_superuser%"=="O" (
        python manage.py createsuperuser
    )
)
del temp_superuser_check.txt 2>nul
echo.

REM Lancer le serveur Django
echo ========================================
echo   Serveur Django demarre !
echo ========================================
echo.
echo Backend API : http://localhost:8000
echo Admin Panel : http://localhost:8000/admin
echo API Docs    : http://localhost:8000/api/docs
echo.
echo Appuyez sur CTRL+C pour arreter le serveur.
echo.

python manage.py runserver

REM Retour au répertoire racine
cd ..

pause
