@echo off
chcp 65001 >nul
REM ============================================
REM Full Application Launch - Bilingual
REM Lancement complet de l'application - Bilingue
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
echo   SOUTRALI - Full Launch
echo ========================================
echo.

if not exist "backend\manage.py" (
    echo [ERROR] Please run this script from the project root.
    pause
    exit /b 1
)

echo This script will launch:
echo   1. Backend Django (port 8000)
echo   2. Frontend React (port 5173)
echo   3. Redis (if available)
echo   4. Celery Worker (if Redis available)
echo.
echo Press any key to continue or CTRL+C to cancel...
pause >nul

set LOG_DIR=logs
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

echo [INFO] Checking Redis...
redis-cli ping >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Redis is not running or not installed.
    echo.
    echo To install Redis on Windows:
    echo 1. Download from https://github.com/microsoftarchive/redis/releases
    echo 2. Or use WSL: wsl sudo service redis-server start
    echo.
    echo Continue without Redis? (Y/N)
    echo (Celery and cache won't work)
    set /p continue_without_redis=
    if /i not "%continue_without_redis%"=="Y" (
        exit /b 1
    )
    set REDIS_AVAILABLE=0
) else (
    echo [OK] Redis is active.
    set REDIS_AVAILABLE=1
)
echo.

echo [INFO] Launching Django backend...
start "Soutrali - Backend Django" cmd /k "cd /d %CD% && venv\Scripts\activate && cd backend && python manage.py runserver"
timeout /t 3 >nul
echo [OK] Backend launched on http://localhost:8000
echo.

if %REDIS_AVAILABLE%==1 (
    echo [INFO] Launching Celery Worker...
    start "Soutrali - Celery Worker" cmd /k "cd /d %CD% && venv\Scripts\activate && cd backend && celery -A soutrali worker -l info"
    timeout /t 2 >nul
    echo [OK] Celery Worker launched.
    echo.

    echo [INFO] Launching Celery Beat...
    start "Soutrali - Celery Beat" cmd /k "cd /d %CD% && venv\Scripts\activate && cd backend && celery -A soutrali beat -l info"
    timeout /t 2 >nul
    echo [OK] Celery Beat launched.
    echo.
)

echo [INFO] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Node.js is not installed.
    echo Download from https://nodejs.org/
    echo.
    echo Frontend won't be launched.
    goto :skip_frontend_en
)
echo [OK] Node.js found.
echo.

if not exist "frontend\package.json" (
    echo [WARNING] Frontend directory not found.
    goto :skip_frontend_en
)

if not exist "frontend\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo [OK] Frontend dependencies installed.
    echo.
)

echo [INFO] Launching React frontend...
start "Soutrali - Frontend React" cmd /k "cd /d %CD%\frontend && npm run dev"
timeout /t 3 >nul
echo [OK] Frontend launched on http://localhost:5173
echo.

:skip_frontend_en
echo.
echo ========================================
echo   All services are running!
echo ========================================
echo.
echo Active services:
echo   [1] Backend API     : http://localhost:8000
echo   [2] Admin Panel     : http://localhost:8000/admin
echo   [3] API Docs        : http://localhost:8000/api/docs
if not errorlevel 1 (
    echo   [4] Frontend        : http://localhost:5173
)
if %REDIS_AVAILABLE%==1 (
    echo   [5] Celery Worker   : Active
    echo   [6] Celery Beat     : Active
)
echo.
echo To stop all services, close all CMD windows.
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:5173

echo.
echo Services running...
echo Press any key to exit (services will continue in background).
pause >nul
exit /b 0

:french
cls
echo.
echo ========================================
echo   SOUTRALI - Lancement Complet
echo ========================================
echo.

if not exist "backend\manage.py" (
    echo [ERREUR] Veuillez exécuter ce script depuis la racine du projet.
    pause
    exit /b 1
)

echo Ce script va lancer :
echo   1. Backend Django (port 8000)
echo   2. Frontend React (port 5173)
echo   3. Redis (si disponible)
echo   4. Celery Worker (si Redis disponible)
echo.
echo Appuyez sur une touche pour continuer ou CTRL+C pour annuler...
pause >nul

set LOG_DIR=logs
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

echo [INFO] Vérification de Redis...
redis-cli ping >nul 2>&1
if errorlevel 1 (
    echo [ATTENTION] Redis n'est pas lancé ou n'est pas installé.
    echo.
    echo Pour installer Redis sur Windows :
    echo 1. Téléchargez depuis https://github.com/microsoftarchive/redis/releases
    echo 2. Ou utilisez WSL : wsl sudo service redis-server start
    echo.
    echo Continuer sans Redis ? (O/N)
    echo (Celery et le cache ne fonctionneront pas)
    set /p continue_without_redis=
    if /i not "%continue_without_redis%"=="O" (
        exit /b 1
    )
    set REDIS_AVAILABLE=0
) else (
    echo [OK] Redis est actif.
    set REDIS_AVAILABLE=1
)
echo.

echo [INFO] Lancement du backend Django...
start "Soutrali - Backend Django" cmd /k "cd /d %CD% && venv\Scripts\activate && cd backend && python manage.py runserver"
timeout /t 3 >nul
echo [OK] Backend lancé sur http://localhost:8000
echo.

if %REDIS_AVAILABLE%==1 (
    echo [INFO] Lancement de Celery Worker...
    start "Soutrali - Celery Worker" cmd /k "cd /d %CD% && venv\Scripts\activate && cd backend && celery -A soutrali worker -l info"
    timeout /t 2 >nul
    echo [OK] Celery Worker lancé.
    echo.

    echo [INFO] Lancement de Celery Beat...
    start "Soutrali - Celery Beat" cmd /k "cd /d %CD% && venv\Scripts\activate && cd backend && celery -A soutrali beat -l info"
    timeout /t 2 >nul
    echo [OK] Celery Beat lancé.
    echo.
)

echo [INFO] Vérification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ATTENTION] Node.js n'est pas installé.
    echo Téléchargez-le depuis https://nodejs.org/
    echo.
    echo Le frontend ne sera pas lancé.
    goto :skip_frontend_fr
)
echo [OK] Node.js trouvé.
echo.

if not exist "frontend\package.json" (
    echo [ATTENTION] Le dossier frontend est introuvable.
    goto :skip_frontend_fr
)

if not exist "frontend\node_modules" (
    echo [INFO] Installation des dépendances frontend...
    cd frontend
    call npm install
    cd ..
    echo [OK] Dépendances frontend installées.
    echo.
)

echo [INFO] Lancement du frontend React...
start "Soutrali - Frontend React" cmd /k "cd /d %CD%\frontend && npm run dev"
timeout /t 3 >nul
echo [OK] Frontend lancé sur http://localhost:5173
echo.

:skip_frontend_fr
echo.
echo ========================================
echo   Tous les services sont lancés !
echo ========================================
echo.
echo Services actifs :
echo   [1] Backend API     : http://localhost:8000
echo   [2] Admin Panel     : http://localhost:8000/admin
echo   [3] API Docs        : http://localhost:8000/api/docs
if not errorlevel 1 (
    echo   [4] Frontend        : http://localhost:5173
)
if %REDIS_AVAILABLE%==1 (
    echo   [5] Celery Worker   : Actif
    echo   [6] Celery Beat     : Actif
)
echo.
echo Pour arrêter tous les services, fermez toutes les fenêtres CMD.
echo.
echo Appuyez sur une touche pour ouvrir le navigateur...
pause >nul

start http://localhost:5173

echo.
echo Services en cours d'exécution...
echo Appuyez sur une touche pour quitter (les services continueront en arrière-plan).
pause >nul
exit /b 0
