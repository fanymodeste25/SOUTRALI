@echo off
chcp 65001 >nul
REM ============================================
REM Soutrali Launch Script - Bilingual
REM Script de lancement Soutrali - Bilingue
REM ============================================

:language_select
cls
echo.
echo ========================================
echo   SOUTRALI - Language Selection
echo   SOUTRALI - Sélection de Langue
echo ========================================
echo.
echo Please select your language / Veuillez choisir votre langue:
echo.
echo [1] English
echo [2] Français
echo.
set /p lang_choice="Enter your choice / Entrez votre choix (1 ou 2): "

if "%lang_choice%"=="1" goto english
if "%lang_choice%"=="2" goto french

echo Invalid choice / Choix invalide
timeout /t 2 >nul
goto language_select

:english
cls
echo.
echo ========================================
echo   SOUTRALI - Project Launch
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "backend\manage.py" (
    echo [ERROR] manage.py file not found.
    echo Make sure to run this script from the SOUTRALI project root.
    pause
    exit /b 1
)

REM Update code to latest version
echo [INFO] Updating to latest version...
git fetch origin >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Unable to fetch updates (may not be a git repository).
    echo Continuing with current version...
) else (
    for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%i
    git pull origin %CURRENT_BRANCH% >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] Unable to pull latest changes.
        echo Continuing with current version...
    ) else (
        echo [OK] Code updated to latest version.
    )
)
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo [INFO] Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo [ERROR] Unable to create virtual environment.
        echo Check that Python is installed correctly.
        pause
        exit /b 1
    )
    echo [OK] Virtual environment created successfully.
    echo.
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat
echo [OK] Virtual environment activated.
echo.

REM Check if dependencies are installed
python -c "import django" 2>nul
if errorlevel 1 (
    echo [INFO] Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Unable to install dependencies.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully.
    echo.
)

REM Check if .env exists, otherwise create it
if not exist ".env" (
    echo [INFO] Creating .env file from .env.example...
    copy .env.example .env
    echo [OK] .env file created.
    echo.
    echo [WARNING] Please configure your environment variables in .env
    echo.
)

REM Check PostgreSQL connection
echo [INFO] Checking PostgreSQL connection...
set PGPASSWORD=soutrali_pass
psql -U soutrali_user -d soutrali_db -h localhost -c "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Unable to connect to database.
    echo.
    echo Would you like to configure the database now? (Y/N)
    set /p setup_db=
    if /i "%setup_db%"=="Y" (
        call setup_database.bat en
    ) else (
        echo [INFO] Please configure PostgreSQL manually.
        echo See docs/DATABASE_SETUP.md for more information.
        echo.
        pause
        exit /b 1
    )
)
set PGPASSWORD=
echo [OK] PostgreSQL connection successful.
echo.

REM Navigate to backend directory
cd backend

REM Apply migrations
echo [INFO] Applying database migrations...
python manage.py migrate --noinput
if errorlevel 1 (
    echo [ERROR] Migrations failed.
    pause
    exit /b 1
)
echo [OK] Migrations applied successfully.
echo.

REM Collect static files
echo [INFO] Collecting static files...
python manage.py collectstatic --noinput --clear
echo [OK] Static files collected.
echo.

REM Check if superuser exists
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); print('exists' if User.objects.filter(is_superuser=True).exists() else 'none')" > temp_check.txt 2>&1
findstr /C:"exists" temp_check.txt >nul
if errorlevel 1 (
    echo [INFO] No superuser found.
    echo Would you like to create a superuser now? (Y/N)
    set /p create_superuser=
    if /i "%create_superuser%"=="Y" (
        python manage.py createsuperuser
    )
)
del temp_check.txt 2>nul
echo.

REM Start Django server
echo ========================================
echo   Django Server Started!
echo ========================================
echo.
echo Backend API : http://localhost:8000
echo Admin Panel : http://localhost:8000/admin
echo API Docs    : http://localhost:8000/api/docs
echo.
echo Press CTRL+C to stop the server.
echo.

python manage.py runserver
cd ..
pause
exit /b 0

:french
cls
echo.
echo ========================================
echo   SOUTRALI - Lancement du Projet
echo ========================================
echo.

REM Vérifier si on est dans le bon répertoire
if not exist "backend\manage.py" (
    echo [ERREUR] Le fichier manage.py n'a pas été trouvé.
    echo Assurez-vous d'exécuter ce script depuis la racine du projet SOUTRALI.
    pause
    exit /b 1
)

REM Mettre à jour vers la dernière version
echo [INFO] Mise à jour vers la dernière version...
git fetch origin >nul 2>&1
if errorlevel 1 (
    echo [ATTENTION] Impossible de récupérer les mises à jour (peut ne pas être un dépôt git).
    echo Continuation avec la version actuelle...
) else (
    for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%i
    git pull origin %CURRENT_BRANCH% >nul 2>&1
    if errorlevel 1 (
        echo [ATTENTION] Impossible de récupérer les dernières modifications.
        echo Continuation avec la version actuelle...
    ) else (
        echo [OK] Code mis à jour vers la dernière version.
    )
)
echo.

REM Vérifier si l'environnement virtuel existe
if not exist "venv\Scripts\activate.bat" (
    echo [INFO] Création de l'environnement virtuel...
    python -m venv venv
    if errorlevel 1 (
        echo [ERREUR] Impossible de créer l'environnement virtuel.
        echo Vérifiez que Python est installé correctement.
        pause
        exit /b 1
    )
    echo [OK] Environnement virtuel créé avec succès.
    echo.
)

REM Activer l'environnement virtuel
echo [INFO] Activation de l'environnement virtuel...
call venv\Scripts\activate.bat
echo [OK] Environnement virtuel activé.
echo.

REM Vérifier si les dépendances sont installées
python -c "import django" 2>nul
if errorlevel 1 (
    echo [INFO] Installation des dépendances...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERREUR] Impossible d'installer les dépendances.
        pause
        exit /b 1
    )
    echo [OK] Dépendances installées avec succès.
    echo.
)

REM Vérifier si .env existe, sinon le créer
if not exist ".env" (
    echo [INFO] Création du fichier .env depuis .env.example...
    copy .env.example .env
    echo [OK] Fichier .env créé.
    echo.
    echo [ATTENTION] Veuillez configurer vos variables d'environnement dans .env
    echo.
)

REM Vérifier la connexion PostgreSQL
echo [INFO] Vérification de la connexion PostgreSQL...
set PGPASSWORD=soutrali_pass
psql -U soutrali_user -d soutrali_db -h localhost -c "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo [ATTENTION] Impossible de se connecter à la base de données.
    echo.
    echo Voulez-vous configurer la base de données maintenant ? (O/N)
    set /p setup_db=
    if /i "%setup_db%"=="O" (
        call setup_database.bat fr
    ) else (
        echo [INFO] Veuillez configurer PostgreSQL manuellement.
        echo Consultez docs/DATABASE_SETUP.md pour plus d'informations.
        echo.
        pause
        exit /b 1
    )
)
set PGPASSWORD=
echo [OK] Connexion à PostgreSQL réussie.
echo.

REM Aller dans le répertoire backend
cd backend

REM Appliquer les migrations
echo [INFO] Application des migrations de la base de données...
python manage.py migrate --noinput
if errorlevel 1 (
    echo [ERREUR] Les migrations ont échoué.
    pause
    exit /b 1
)
echo [OK] Migrations appliquées avec succès.
echo.

REM Collecter les fichiers statiques
echo [INFO] Collecte des fichiers statiques...
python manage.py collectstatic --noinput --clear
echo [OK] Fichiers statiques collectés.
echo.

REM Vérifier si un superuser existe
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); print('exists' if User.objects.filter(is_superuser=True).exists() else 'none')" > temp_check.txt 2>&1
findstr /C:"exists" temp_check.txt >nul
if errorlevel 1 (
    echo [INFO] Aucun superuser trouvé.
    echo Voulez-vous créer un superuser maintenant ? (O/N)
    set /p create_superuser=
    if /i "%create_superuser%"=="O" (
        python manage.py createsuperuser
    )
)
del temp_check.txt 2>nul
echo.

REM Lancer le serveur Django
echo ========================================
echo   Serveur Django démarré !
echo ========================================
echo.
echo Backend API : http://localhost:8000
echo Admin Panel : http://localhost:8000/admin
echo API Docs    : http://localhost:8000/api/docs
echo.
echo Appuyez sur CTRL+C pour arrêter le serveur.
echo.

python manage.py runserver
cd ..
pause
exit /b 0
