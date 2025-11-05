@echo off
REM ============================================
REM Script de lancement complet (Backend + Frontend + Services)
REM ============================================

echo.
echo ========================================
echo   SOUTRALI - Lancement Complet
echo ========================================
echo.

REM Vérifier si on est dans le bon répertoire
if not exist "backend\manage.py" (
    echo [ERREUR] Veuillez executer ce script depuis la racine du projet.
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

REM Créer un fichier de log
set LOG_DIR=logs
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

REM Vérifier Redis
echo [INFO] Verification de Redis...
redis-cli ping >nul 2>&1
if errorlevel 1 (
    echo [ATTENTION] Redis n'est pas lance ou n'est pas installe.
    echo.
    echo Pour installer Redis sur Windows :
    echo 1. Telechargez depuis https://github.com/microsoftarchive/redis/releases
    echo 2. Ou utilisez WSL : wsl sudo service redis-server start
    echo.
    echo Voulez-vous continuer sans Redis ? (O/N)
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

REM Lancer le backend Django
echo [INFO] Lancement du backend Django...
start "Soutrali - Backend Django" cmd /k "cd /d %CD% && venv\Scripts\activate && cd backend && python manage.py runserver"
timeout /t 3 >nul
echo [OK] Backend lance sur http://localhost:8000
echo.

REM Lancer Celery Worker si Redis est disponible
if %REDIS_AVAILABLE%==1 (
    echo [INFO] Lancement de Celery Worker...
    start "Soutrali - Celery Worker" cmd /k "cd /d %CD% && venv\Scripts\activate && cd backend && celery -A soutrali worker -l info"
    timeout /t 2 >nul
    echo [OK] Celery Worker lance.
    echo.

    echo [INFO] Lancement de Celery Beat...
    start "Soutrali - Celery Beat" cmd /k "cd /d %CD% && venv\Scripts\activate && cd backend && celery -A soutrali beat -l info"
    timeout /t 2 >nul
    echo [OK] Celery Beat lance.
    echo.
)

REM Vérifier si Node.js est installé
echo [INFO] Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ATTENTION] Node.js n'est pas installe.
    echo Telechargez-le depuis https://nodejs.org/
    echo.
    echo Le frontend ne sera pas lance.
    goto :skip_frontend
)
echo [OK] Node.js trouve.
echo.

REM Vérifier si le frontend existe
if not exist "frontend\package.json" (
    echo [ATTENTION] Le dossier frontend est introuvable.
    goto :skip_frontend
)

REM Installer les dépendances frontend si nécessaire
if not exist "frontend\node_modules" (
    echo [INFO] Installation des dependances frontend...
    cd frontend
    call npm install
    cd ..
    echo [OK] Dependances frontend installees.
    echo.
)

REM Lancer le frontend
echo [INFO] Lancement du frontend React...
start "Soutrali - Frontend React" cmd /k "cd /d %CD%\frontend && npm run dev"
timeout /t 3 >nul
echo [OK] Frontend lance sur http://localhost:5173
echo.

:skip_frontend

echo.
echo ========================================
echo   Tous les services sont lances !
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
echo Pour arreter tous les services, fermez toutes les fenetres CMD.
echo.
echo Appuyez sur une touche pour ouvrir le navigateur...
pause >nul

REM Ouvrir le navigateur
start http://localhost:5173

echo.
echo Services en cours d'execution...
echo Appuyez sur une touche pour quitter (les services continueront en arriere-plan).
pause >nul
