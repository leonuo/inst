@echo off
chcp 65001 >nul
title InstAccountsManager - REVERT ALL FIXES
color 0C

echo ================================================================
echo   InstAccountsManager - REVERT SCRIPT
echo   Відкат всіх виправлень
echo ================================================================
echo.

:: Перевірка адміністраторських прав
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ПОМИЛКА] Цей скрипт потребує прав адміністратора!
    echo.
    pause
    exit /b 1
)

echo [OK] Права адміністратора підтверджено
echo.

:: Знаходимо останній backup
set "BACKUP_DIR="
for /d %%D in ("%~dp0BACKUP_*") do set "BACKUP_DIR=%%D"

if "%BACKUP_DIR%"=="" (
    echo [ПОМИЛКА] Backup не знайдено!
    echo.
    pause
    exit /b 1
)

echo [OK] Backup знайдено: %BACKUP_DIR%
echo.

:: ============================================================
:: КРОК 1: ВІДНОВЛЕННЯ hosts ФАЙЛУ
:: ============================================================
echo ================================================================
echo   КРОК 1/3: Відновлення hosts файлу
echo ================================================================
echo.

if exist "%BACKUP_DIR%\hosts.backup" (
    copy "%BACKUP_DIR%\hosts.backup" "C:\Windows\System32\drivers\etc\hosts" /Y >nul
    echo [OK] hosts файл відновлено
) else (
    echo [ПОМИЛКА] hosts.backup не знайдено
)

:: Очищення DNS кешу
ipconfig /flushdns >nul 2>&1
echo [OK] DNS кеш очищено
echo.

:: ============================================================
:: КРОК 2: ВІДНОВЛЕННЯ Updater.exe
:: ============================================================
echo ================================================================
echo   КРОК 2/3: Відновлення Updater.exe
echo ================================================================
echo.

if exist "%BACKUP_DIR%\Updater.exe.backup" (
    copy "%BACKUP_DIR%\Updater.exe.backup" "%~dp0Updater.exe" /Y >nul
    echo [OK] Updater.exe відновлено
) else (
    echo [INFO] Updater.exe.backup не знайдено (можливо не існував)
)

echo.

:: ============================================================
:: КРОК 3: ВИДАЛЕННЯ FIREWALL ПРАВИЛ
:: ============================================================
echo ================================================================
echo   КРОК 3/3: Видалення firewall правил
echo ================================================================
echo.

netsh advfirewall firewall delete rule name="IAM-Block-License-Port" >nul 2>&1
echo [OK] Правило IAM-Block-License-Port видалено

netsh advfirewall firewall delete rule name="IAM-Block-Updater" >nul 2>&1
echo [OK] Правило IAM-Block-Updater видалено

echo.

:: ============================================================
:: ФІНАЛЬНИЙ ЗВІТ
:: ============================================================
echo ================================================================
echo   ВСІ ВИПРАВЛЕННЯ ВІДКАЧЕНО
echo ================================================================
echo.
echo   [hosts]    Файл відновлено
echo   [Updater]  Файл відновлено
echo   [Firewall] Правила видалено
echo   [DNS]      Кеш очищено
echo.
echo ================================================================
echo.
pause
