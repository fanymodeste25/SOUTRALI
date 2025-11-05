@echo off
chcp 65001 >nul
REM ============================================
REM Stop All Services - Bilingual
REM Arrêt de tous les services - Bilingue
REM ============================================

:language_select
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

if "%lang_choice%"=="1" goto english
if "%lang_choice%"=="2" goto french

echo Invalid / Invalide
timeout /t 2 >nul
goto language_select

:english
cls
echo.
echo ========================================
echo   Stop Soutrali Services
echo ========================================
echo.

echo [INFO] Stopping all Django processes...
taskkill /FI "WINDOWTITLE eq Soutrali - Backend Django*" /F >nul 2>&1
if not errorlevel 1 (
    echo [OK] Django backend stopped.
) else (
    echo [INFO] No Django backend running.
)

echo [INFO] Stopping all Celery processes...
taskkill /FI "WINDOWTITLE eq Soutrali - Celery Worker*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Soutrali - Celery Beat*" /F >nul 2>&1
if not errorlevel 1 (
    echo [OK] Celery stopped.
) else (
    echo [INFO] No Celery running.
)

echo [INFO] Stopping React frontend...
taskkill /FI "WINDOWTITLE eq Soutrali - Frontend React*" /F >nul 2>&1
if not errorlevel 1 (
    echo [OK] React frontend stopped.
) else (
    echo [INFO] No frontend running.
)

echo [INFO] Checking processes on port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo [INFO] Stopping process %%a...
    taskkill /PID %%a /F >nul 2>&1
)

echo [INFO] Checking processes on port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo [INFO] Stopping process %%a...
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo [OK] All services have been stopped.
echo.
pause
exit /b 0

:french
cls
echo.
echo ========================================
echo   Arrêt des services Soutrali
echo ========================================
echo.

echo [INFO] Arrêt de tous les processus Django...
taskkill /FI "WINDOWTITLE eq Soutrali - Backend Django*" /F >nul 2>&1
if not errorlevel 1 (
    echo [OK] Backend Django arrêté.
) else (
    echo [INFO] Aucun backend Django en cours.
)

echo [INFO] Arrêt de tous les processus Celery...
taskkill /FI "WINDOWTITLE eq Soutrali - Celery Worker*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Soutrali - Celery Beat*" /F >nul 2>&1
if not errorlevel 1 (
    echo [OK] Celery arrêté.
) else (
    echo [INFO] Aucun Celery en cours.
)

echo [INFO] Arrêt du frontend React...
taskkill /FI "WINDOWTITLE eq Soutrali - Frontend React*" /F >nul 2>&1
if not errorlevel 1 (
    echo [OK] Frontend React arrêté.
) else (
    echo [INFO] Aucun frontend en cours.
)

echo [INFO] Vérification des processus sur le port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo [INFO] Arrêt du processus %%a...
    taskkill /PID %%a /F >nul 2>&1
)

echo [INFO] Vérification des processus sur le port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo [INFO] Arrêt du processus %%a...
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo [OK] Tous les services ont été arrêtés.
echo.
pause
exit /b 0
