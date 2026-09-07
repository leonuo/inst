@echo off
chcp 65001 >nul
title InstAccountsManager - Network Monitor
color 0B

echo ================================================================
echo   InstAccountsManager - МОНІТОР МЕРЕЖІ
echo ================================================================
echo.
echo Цей скрипт покаже куди підключається InstAccountsManager
echo.
echo Натисніть будь-яку клавішу для запуску...
pause >nul

:: Перевірка чи запущений InstAccountsManager
tasklist /FI "IMAGENAME eq InstAccountsManager.exe" 2>NUL | find /I /N "InstAccountsManager.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo.
    echo [ПОМИЛКА] InstAccountsManager.exe не запущено!
    echo.
    echo Запустіть InstAccountsManager.exe і спробуйте знову.
    echo.
    pause
    exit /b 1
)

echo.
echo [OK] InstAccountsManager.exe знайдено
echo.
echo Початок моніторингу на 30 секунд...
echo.
echo ================================================================
echo.

:: Моніторинг з'єднань
for /L %%i in (1,1,60) do (
    netstat -ano | findstr "49153" >nul 2>&1
    if %ERRORLEVEL%==0 (
        echo [%(TIME:~0,8%] ПОРТ 49153 АКТИВНИЙ - License Heartbeat!
        netstat -ano | findstr "49153"
    )
    
    netstat -ano | findstr "InstAccountsManager" >nul 2>&1
    if %ERRORLEVEL%==0 (
        echo [%(TIME:~0,8%] З'єднання виявлено
    )
    
    timeout /t 1 /nobreak >nul
)

echo.
echo ================================================================
echo   МОНІТОРИНГ ЗАВЕРШЕНО
echo ================================================================
echo.
echo Якщо ви бачили "ПОРТ 49153 АКТИВНИЙ" - це license validation.
echo Запустіть apply_fix.bat для блокування.
echo.
pause
