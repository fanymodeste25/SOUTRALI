@echo off
REM ============================================
REM Script d'arrêt de tous les services
REM ============================================

echo.
echo ========================================
echo   Arret des services Soutrali
echo ========================================
echo.

echo [INFO] Arret de tous les processus Django...
taskkill /FI "WINDOWTITLE eq Soutrali - Backend Django*" /F >nul 2>&1
if not errorlevel 1 (
    echo [OK] Backend Django arrete.
) else (
    echo [INFO] Aucun backend Django en cours.
)

echo [INFO] Arret de tous les processus Celery...
taskkill /FI "WINDOWTITLE eq Soutrali - Celery Worker*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Soutrali - Celery Beat*" /F >nul 2>&1
if not errorlevel 1 (
    echo [OK] Celery arrete.
) else (
    echo [INFO] Aucun Celery en cours.
)

echo [INFO] Arret du frontend React...
taskkill /FI "WINDOWTITLE eq Soutrali - Frontend React*" /F >nul 2>&1
if not errorlevel 1 (
    echo [OK] Frontend React arrete.
) else (
    echo [INFO] Aucun frontend en cours.
)

REM Arrêter les processus Python qui tournent sur le port 8000
echo [INFO] Verification des processus sur le port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo [INFO] Arret du processus %%a...
    taskkill /PID %%a /F >nul 2>&1
)

REM Arrêter les processus Node qui tournent sur le port 5173
echo [INFO] Verification des processus sur le port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo [INFO] Arret du processus %%a...
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo [OK] Tous les services ont ete arretes.
echo.

pause
