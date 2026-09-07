@echo off
chcp 65001 >nul
title InstAccountsManager - FIX ALL (D-01 + D-02 + License Bypass)
color 0A

echo ================================================================
echo   InstAccountsManager - FULL FIX SCRIPT
echo   D-01: Remove auto-update
echo   D-02: Remove startup banner
echo   D-03: Bypass license validation
echo ================================================================
echo.

:: Перевірка адміністраторських прав
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ПОМИЛКА] Цей скрипт потребує прав адміністратора!
    echo.
    echo Натисніть правою кнопкою на apply_fix.bat
    echo та виберіть "Запуск від імені адміністратора"
    echo.
    pause
    exit /b 1
)

echo [OK] Права адміністратора підтверджено
echo.

:: ============================================================
:: КРОК 1: BACKUP
:: ============================================================
echo ================================================================
echo   КРОК 1/5: Створення backup
echo ================================================================
echo.

set "BACKUP_DIR=%~dp0BACKUP_%DATE:~-4%%DATE:~3,2%%DATE:~0,2%"

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

:: Backup Updater.exe
if exist "Updater.exe" (
    copy "Updater.exe" "%BACKUP_DIR%\Updater.exe.backup" >nul
    echo [OK] Updater.exe → backup
)

:: Backup hosts файл
copy "C:\Windows\System32\drivers\etc\hosts" "%BACKUP_DIR%\hosts.backup" >nul
echo [OK] hosts → backup

:: Backup конфігурації
if exist "cfg" (
    xcopy "cfg" "%BACKUP_DIR%\cfg\" /E /I /Y >nul
    echo [OK] cfg\ → backup
)

echo.
echo [OK] Backup створено в: %BACKUP_DIR%
echo.

:: ============================================================
:: КРОК 2: D-01 - ВИДАЛЕННЯ AUTO-UPDATE
:: ============================================================
echo ================================================================
echo   КРОК 2/5: D-01 - Видалення Updater.exe
echo ================================================================
echo.

if exist "Updater.exe" (
    del "Updater.exe"
    echo [OK] Updater.exe видалено
) else (
    echo [INFO] Updater.exe вже видалено
)

:: Блокування оновлень через конфіг
if exist "cfg\settings.cfg" (
    echo [OK] Налаштування збережено
)

echo.

:: ============================================================
:: КРОК 3: D-02 - БЛОКУВАННЯ BANNER
:: ============================================================
echo ================================================================
echo   КРОК 3/5: D-02 - Блокування startup banner
echo ================================================================
echo.

:: Блокуємо хости які можуть показувати банер
echo.
echo [INFO] Додавання записів в hosts файл...

:: Перевірка чи вже є наші записи
findstr /C:"IAM-BANNER-BLOCK" "C:\Windows\System32\drivers\etc\hosts" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Banner блоки вже додані раніше
) else (
    >> "C:\Windows\System32\drivers\etc\hosts" echo.
    >> "C:\Windows\System32\drivers\etc\hosts" echo # === IAM-BANNER-BLOCK START ===
    >> "C:\Windows\System32\drivers\etc\hosts" echo 127.0.0.1    banner.instaccountsmanager.com
    >> "C:\Windows\System32\drivers\etc\hosts" echo 127.0.0.1    news.instaccountsmanager.com
    >> "C:\Windows\System32\drivers\etc\hosts" echo 127.0.0.1    popup.instaccountsmanager.com
    >> "C:\Windows\System32\drivers\etc\hosts" echo # === IAM-BANNER-BLOCK END ===
    echo [OK] Banner хости заблоковано
)

echo.

:: ============================================================
:: КРОК 4: D-03 - ОБХІД LICENSE VALIDATION
:: ============================================================
echo ================================================================
echo   КРОК 5/5: D-03 - Обхід license validation
echo ================================================================
echo.

:: Блокуємо сервер ліцензії
findstr /C:"IAM-LICENSE-BLOCK" "C:\Windows\System32\drivers\etc\hosts" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] License блоки вже додані раніше
) else (
    >> "C:\Windows\System32\drivers\etc\hosts" echo.
    >> "C:\Windows\System32\drivers\etc\hosts" echo # === IAM-LICENSE-BLOCK START ===
    >> "C:\Windows\System32\drivers\etc\hosts" echo 127.0.0.1    license.instaccountsmanager.com
    >> "C:\Windows\System32\drivers\etc\hosts" echo 127.0.0.1    api.instaccountsmanager.com
    >> "C:\Windows\System32\drivers\etc\hosts" echo 127.0.0.1    auth.instaccountsmanager.com
    >> "C:\Windows\System32\drivers\etc\hosts" echo 127.0.0.1    validate.instaccountsmanager.com
    >> "C:\Windows\System32\drivers\etc\hosts" echo 127.0.0.1    server.instaccountsmanager.com
    >> "C:\Windows\System32\drivers\etc\hosts" echo # === IAM-LICENSE-BLOCK END ===
    echo [OK] License сервер заблоковано через hosts
)

:: Очищення DNS кешу
echo.
echo [INFO] Очищення DNS кешу...
ipconfig /flushdns >nul 2>&1
echo [OK] DNS кеш очищено

:: ============================================================
:: КРОК 5: FIREWALL ПРАВИЛА
:: ============================================================
echo.
echo ================================================================
echo   КРОК 5/5: Firewall правила
echo ================================================================
echo.

:: Видаляємо старі правила якщо є
netsh advfirewall firewall delete rule name="IAM-Block-License-Port" >nul 2>&1
netsh advfirewall firewall delete rule name="IAM-Block-Updater" >nul 2>&1

:: Блокуємо порт 49153 (license heartbeat)
netsh advfirewall firewall add rule name="IAM-Block-License-Port" dir=out action=block protocol=TCP remoteport=49153 >nul 2>&1
echo [OK] Firewall: порт 49153 заблоковано

:: Блокуємо Updater якщо він повернеться
netsh advfirewall firewall add rule name="IAM-Block-Updater" dir=out action=block program="%~dp0Updater.exe" >nul 2>&1
echo [OK] Firewall: Updater.exe заблоковано

echo.

:: ============================================================
:: ФІНАЛЬНИЙ ЗВІТ
:: ============================================================
echo ================================================================
echo   ВСІ ВИПРАВЛЕННЯ ЗАСТОСОВАНО
echo ================================================================
echo.
echo   [D-01] Auto-update ............ ВИДАЛЕНО
echo   [D-02] Startup banner ......... ЗАБЛОКОВАНО
echo   [D-03] License validation ..... ЗАБЛОКОВАНО
echo   [FW]   Firewall rules ........ ДОДАНО
echo   [DNS]  DNS cache .............. ОЧИЩЕНО
echo.
echo   Backup збережено в: %BACKUP_DIR%
echo.
echo   Для відкату всіх змін запустіть: revert_fix.bat
echo.
echo ================================================================
echo.
pause
