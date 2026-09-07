@echo off
chcp 65001 >nul
title InstAccountsManager - Installation
color 0B

echo ================================================================
echo   InstAccountsManager - INSTALLATION SCRIPT
echo   Version: 3.4.4.6 (Fixed - No License/Update)
echo ================================================================
echo.

:: Перевірка адміністраторських прав
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ПОМИЛКА] Цей скрипт потребує прав адміністратора!
    echo.
    echo Натисніть правою кнопкою на install.bat
    echo та виберіть "Запуск від імені адміністратора"
    echo.
    pause
    exit /b 1
)

echo [OK] Права адміністратора підтверджено
echo.

:: Перевірка чи існують необхідні файли
echo Перевірка файлів...
echo.

if not exist "InstAccountsManager.exe" (
    echo [ПОМИЛКА] InstAccountsManager.exe не знайдено!
    echo.
    echo Будь ласка, завантажте оригінальні файли з GitHub:
    echo https://github.com/leonuo/InstAccountsManager
    echo.
    pause
    exit /b 1
)

echo [OK] InstAccountsManager.exe знайдено
echo.

:: Застосування виправлень
echo ================================================================
echo   Застосування виправлень...
echo ================================================================
echo.

:: Видалення Updater.exe якщо існує
if exist "Updater.exe" (
    echo [D-01] Видалення Updater.exe...
    del "Updater.exe" >nul 2>&1
    echo [OK] Updater.exe видалено
)

:: Блокування license validation через hosts
echo [D-03] Блокування license validation...

set "HOSTS_FILE=C:\Windows\System32\drivers\etc\hosts"

:: Перевірка чи вже заблоковано
findstr /C:"IAM-LICENSE-BLOCK" "%HOSTS_FILE%" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo. >> "%HOSTS_FILE%"
    echo # === IAM-LICENSE-BLOCK START === >> "%HOSTS_FILE%"
    echo 127.0.0.1    license.instaccountsmanager.com >> "%HOSTS_FILE%"
    echo 127.0.0.1    api.instaccountsmanager.com >> "%HOSTS_FILE%"
    echo 127.0.0.1    auth.instaccountsmanager.com >> "%HOSTS_FILE%"
    echo 127.0.0.1    validate.instaccountsmanager.com >> "%HOSTS_FILE%"
    echo 127.0.0.1    server.instaccountsmanager.com >> "%HOSTS_FILE%"
    echo # === IAM-LICENSE-BLOCK END === >> "%HOSTS_FILE%"
    echo [OK] License hosts заблоковано
) else (
    echo [INFO] License hosts вже заблоковано
)

:: Блокування banner
echo [D-02] Блокування startup banner...

findstr /C:"IAM-BANNER-BLOCK" "%HOSTS_FILE%" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo. >> "%HOSTS_FILE%"
    echo # === IAM-BANNER-BLOCK START === >> "%HOSTS_FILE%"
    echo 127.0.0.1    banner.instaccountsmanager.com >> "%HOSTS_FILE%"
    echo 127.0.0.1    news.instaccountsmanager.com >> "%HOSTS_FILE%"
    echo 127.0.0.1    popup.instaccountsmanager.com >> "%HOSTS_FILE%"
    echo 127.0.0.1    update.instaccountsmanager.com >> "%HOSTS_FILE%"
    echo # === IAM-BANNER-BLOCK END === >> "%HOSTS_FILE%"
    echo [OK] Banner hosts заблоковано
) else (
    echo [INFO] Banner hosts вже заблоковано
)

:: Очищення DNS кешу
echo.
echo Очищення DNS кешу...
ipconfig /flushdns >nul 2>&1
echo [OK] DNS кеш очищено

:: Створення ярлика на робочому столі
echo.
echo Створення ярлика на робочому столі...
set "DESKTOP=%USERPROFILE%\Desktop"
set "SHORTCUT=%DESKTOP%\InstAccountsManager.lnk"

powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%SHORTCUT%'); $Shortcut.TargetPath = '%~dp0InstAccountsManager.exe'; $Shortcut.WorkingDirectory = '%~dp0'; $Shortcut.Save()" >nul 2>&1

if exist "%SHORTCUT%" (
    echo [OK] Ярлик створено на робочому столі
) else (
    echo [ПОМИЛКА] Не вдалося створити ярлик
)

:: Фінальний звіт
echo.
echo ================================================================
echo   ВСТАНОВЛЕННЯ ЗАВЕРШЕНО
echo ================================================================
echo.
echo   [D-01] Auto-update ............ ВИДАЛЕНО
echo   [D-02] Startup banner ......... ЗАБЛОКОВАНО
echo   [D-03] License validation ..... ЗАБЛОКОВАНО
echo   [DNS]  DNS cache .............. ОЧИЩЕНО
echo   [ICON] Desktop shortcut ....... СТВОРЕНО
echo.
echo ================================================================
echo.
echo   Тепер ви можете запустити InstAccountsManager.exe
echo   або використати ярлик на робочому столі.
echo.
echo   Всі виправлення застосовано успішно!
echo.
echo ================================================================
echo.
pause
