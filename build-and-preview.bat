@echo off
echo ========================================
echo  Build ^& Preview Production
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

:: Перевірка наявності node_modules
if not exist "node_modules\" (
    echo [INFO] Встановлення залежностей...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ПОМИЛКА] Помилка встановлення залежностей!
        pause
        exit /b 1
    )
    echo.
)

:: Створення білду
echo [INFO] Створення продакшн-білду...
echo.
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ПОМИЛКА] Помилка створення білду!
    pause
    exit /b 1
)

echo.
echo [OK] Білд створено в папці dist/
echo.

:: Запуск preview
echo [INFO] Запуск preview сервера...
echo.
echo Відкрийте http://localhost:3000
echo.
echo Натисніть Ctrl+C для зупинки
echo.
call npm run preview
