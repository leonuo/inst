#Requires -RunAsAdministrator
# InstAccountsManager - PowerShell Fix Script
# Блокування license validation через firewall

param(
    [switch]$Revert,
    [switch]$Status
)

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host ("=" * 70) -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor Cyan
    Write-Host ""
}

function Write-OK {
    param([string]$Message)
    Write-Host "[OK] " -ForegroundColor Green -NoNewline
    Write-Host $Message
}

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] " -ForegroundColor Yellow -NoNewline
    Write-Host $Message
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] " -ForegroundColor Red -NoNewline
    Write-Host $Message
}

# Перевірка прав адміністратора
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Error "Цей скрипт потребує прав адміністратора!"
    Write-Host "Запустіть PowerShell як адміністратор і спробуйте знову."
    exit 1
}

Write-OK "Права адміністратора підтверджено"

# ============================================================
# РЕЖИМ СТАТУСУ
# ============================================================
if ($Status) {
    Write-Header "СТАТУС ЗАХИСТУ InstAccountsManager"
    
    Write-Host "Firewall правила:" -ForegroundColor White
    $rules = Get-NetFirewallRule | Where-Object { $_.DisplayName -like "IAM-*" }
    if ($rules) {
        foreach ($rule in $rules) {
            Write-Host "  [+] " -ForegroundColor Green -NoNewline
            Write-Host "$($rule.DisplayName) - $($rule.Action)"
        }
    } else {
        Write-Host "  [-] Немає активних правил IAM" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "hosts файл:" -ForegroundColor White
    $hostsContent = Get-Content "C:\Windows\System32\drivers\etc\hosts"
    $iamBlocks = $hostsContent | Select-String "IAM-"
    if ($iamBlocks) {
        Write-Host "  [+] Блоки IAM знайдено в hosts" -ForegroundColor Green
        foreach ($block in $iamBlocks) {
            Write-Host "      $($block.Line.Trim())" -ForegroundColor Gray
        }
    } else {
        Write-Host "  [-] Немає блоків IAM в hosts" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Файли:" -ForegroundColor White
    if (Test-Path "$ScriptDir\Updater.exe") {
        Write-Host "  [+] Updater.exe присутній" -ForegroundColor Yellow
    } else {
        Write-Host "  [-] Updater.exe видалено" -ForegroundColor Green
    }
    
    exit 0
}

# ============================================================
# РЕЖИМ ВІДКАТУ
# ============================================================
if ($Revert) {
    Write-Header "ВІДКАТ ВСІХ ВИПРАВЛЕНЬ"
    
    # Видалення firewall правил
    Write-Info "Видалення firewall правил..."
    Get-NetFirewallRule | Where-Object { $_.DisplayName -like "IAM-*" } | Remove-NetFirewallRule
    Write-OK "Firewall правила видалено"
    
    # Відновлення hosts
    Write-Info "Відновлення hosts файлу..."
    $hostsPath = "C:\Windows\System32\drivers\etc\hosts"
    $hostsContent = Get-Content $hostsPath
    $newContent = @()
    $skip = $false
    foreach ($line in $hostsContent) {
        if ($line -match "IAM-.*-BLOCK START") {
            $skip = $true
            continue
        }
        if ($line -match "IAM-.*-BLOCK END") {
            $skip = $false
            continue
        }
        if (-not $skip) {
            $newContent += $line
        }
    }
    $newContent | Set-Content $hostsPath
    Write-OK "hosts файл відновлено"
    
    # Очищення DNS
    ipconfig /flushdns | Out-Null
    Write-OK "DNS кеш очищено"
    
    Write-Header "ВІДКАТ ЗАВЕРШЕНО"
    exit 0
}

# ============================================================
# РЕЖИМ ЗАСТОСУВАННЯ ВИПРАВЛЕНЬ
# ============================================================
Write-Header "ЗАСТОСУВАННЯ ВСІХ ВИПРАВЛЕНЬ"

# Крок 1: Firewall правила для блокування license heartbeat
Write-Info "Створення firewall правил..."

# Блокування порту 49153 (license heartbeat)
$existingRule = Get-NetFirewallRule -DisplayName "IAM-Block-License-Port" -ErrorAction SilentlyContinue
if ($existingRule) {
    Remove-NetFirewallRule -DisplayName "IAM-Block-License-Port"
}

New-NetFirewallRule -DisplayName "IAM-Block-License-Port" `
    -Direction Outbound `
    -Action Block `
    -Protocol TCP `
    -RemotePort 49153 `
    -Profile Any `
    -Enabled True | Out-Null

Write-OK "Порт 49153 (license heartbeat) заблоковано"

# Блокування всіх вихідних з'єднань для InstAccountsManager.exe
$exePath = Join-Path $ScriptDir "InstAccountsManager.exe"
if (Test-Path $exePath) {
    $existingRule = Get-NetFirewallRule -DisplayName "IAM-Block-Exe-License" -ErrorAction SilentlyContinue
    if ($existingRule) {
        Remove-NetFirewallRule -DisplayName "IAM-Block-Exe-License"
    }
    
    # Дозволяємо тільки локальні з'єднання
    New-NetFirewallRule -DisplayName "IAM-Allow-Local" `
        -Direction Outbound `
        -Action Allow `
        -Program $exePath `
        -RemoteAddress LocalSubnet `
        -Enabled True | Out-Null
    
    Write-OK "InstAccountsManager.exe: дозволено тільки локальні з'єднання"
}

# Крок 2: Блокування Updater.exe
if (Test-Path "$ScriptDir\Updater.exe") {
    Write-Info "Блокування Updater.exe..."
    
    $existingRule = Get-NetFirewallRule -DisplayName "IAM-Block-Updater" -ErrorAction SilentlyContinue
    if ($existingRule) {
        Remove-NetFirewallRule -DisplayName "IAM-Block-Updater"
    }
    
    New-NetFirewallRule -DisplayName "IAM-Block-Updater" `
        -Direction Outbound `
        -Action Block `
        -Program "$ScriptDir\Updater.exe" `
        -Enabled True | Out-Null
    
    Write-OK "Updater.exe заблоковано через firewall"
}

# Крок 3: Модифікація hosts файлу
Write-Info "Модифікація hosts файлу..."
$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$hostsContent = Get-Content $hostsPath

# Перевірка чи вже є наші блоки
$hasBannerBlock = $hostsContent | Select-String "IAM-BANNER-BLOCK"
$hasLicenseBlock = $hostsContent | Select-String "IAM-LICENSE-BLOCK"

$newLines = @()

if (-not $hasBannerBlock) {
    $newLines += ""
    $newLines += "# === IAM-BANNER-BLOCK START ==="
    $newLines += "127.0.0.1    banner.instaccountsmanager.com"
    $newLines += "127.0.0.1    news.instaccountsmanager.com"
    $newLines += "127.0.0.1    popup.instaccountsmanager.com"
    $newLines += "127.0.0.1    update.instaccountsmanager.com"
    $newLines += "# === IAM-BANNER-BLOCK END ==="
    Write-OK "Banner хости заблоковано"
}

if (-not $hasLicenseBlock) {
    $newLines += ""
    $newLines += "# === IAM-LICENSE-BLOCK START ==="
    $newLines += "127.0.0.1    license.instaccountsmanager.com"
    $newLines += "127.0.0.1    api.instaccountsmanager.com"
    $newLines += "127.0.0.1    auth.instaccountsmanager.com"
    $newLines += "127.0.0.1    validate.instaccountsmanager.com"
    $newLines += "127.0.0.1    server.instaccountsmanager.com"
    $newLines += "127.0.0.1    account.instaccountsmanager.com"
    $newLines += "# === IAM-LICENSE-BLOCK END ==="
    Write-OK "License сервер заблоковано"
}

if ($newLines.Count -gt 0) {
    $hostsContent += $newLines
    $hostsContent | Set-Content $hostsPath
} else {
    Write-Info "Блоки вже присутні в hosts файлі"
}

# Крок 4: Очищення DNS кешу
Write-Info "Очищення DNS кешу..."
ipconfig /flushdns | Out-Null
Write-OK "DNS кеш очищено"

# Фінальний звіт
Write-Header "ВСІ ВИПРАВЛЕННЯ ЗАСТОСОВАНО"

Write-Host "Застосовані виправлення:" -ForegroundColor White
Write-Host "  [D-01] Auto-update ............ ЗАБЛОКОВАНО" -ForegroundColor Green
Write-Host "  [D-02] Startup banner ......... ЗАБЛОКОВАНО" -ForegroundColor Green
Write-Host "  [D-03] License validation ..... ЗАБЛОКОВАНО" -ForegroundColor Green
Write-Host "  [FW]   Firewall rules ........ ДОДАНО" -ForegroundColor Green
Write-Host "  [DNS]  DNS cache .............. ОЧИЩЕНО" -ForegroundColor Green

Write-Host ""
Write-Host "Для перевірки статусу запустіть:" -ForegroundColor Yellow
Write-Host "  .\apply_fix.ps1 -Status" -ForegroundColor Cyan

Write-Host ""
Write-Host "Для відкату всіх змін запустіть:" -ForegroundColor Yellow
Write-Host "  .\apply_fix.ps1 -Revert" -ForegroundColor Cyan

Write-Host ""
