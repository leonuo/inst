@echo off
echo ========================================
echo  InstAccountsManager Investigation Dossier
echo ========================================
echo.

:: Перевірка Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ПОМИЛКА] Node.js не знайдено!
    echo.
    echo Встановіть Node.js з https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Перевірка версії Node.js
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [INFO] Node.js версія: %NODE_VERSION%
echo.

:: Перевірка наявності node_modules
if not exist "node_modules\" (
    echo [INFO] Встановлення залежностей...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ПОМИЛКА] Помилка встановлення залежностей!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Залежності встановлено
    echo.
)

:: Запуск dev сервера
echo [INFO] Запуск dev сервера на http://localhost:3000
echo.
echo Натисніть Ctrl+C для зупинки
echo.
call npm run dev
