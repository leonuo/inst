#Requires -RunAsAdministrator
# InstAccountsManager - Network Monitor
# Моніторинг мережевих з'єднань додатку

param(
    [int]$Duration = 60,  # Тривалість моніторингу в секундах
    [string]$ProcessName = "InstAccountsManager"
)

$ErrorActionPreference = "Continue"

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host ("=" * 70) -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor Cyan
    Write-Host ""
}

Write-Header "МОНІТОР МЕРЕЖЕВОЇ АКТИВНОСТІ InstAccountsManager"

Write-Host "Тривалість: $Duration секунд" -ForegroundColor Yellow
Write-Host "Процес: $ProcessName" -ForegroundColor Yellow
Write-Host ""
Write-Host "Натисніть Ctrl+C для дострокового завершення" -ForegroundColor Gray
Write-Host ""

$startTime = Get-Date
$connections = @{}
$attemptCount = 0

Write-Host "Початок моніторингу..." -ForegroundColor Green
Write-Host ""

try {
    while (((Get-Date) - $startTime).TotalSeconds -lt $Duration) {
        # Отримуємо активні з'єднання
        $netStats = Get-NetTCPConnection -State Established, SynSent, CloseWait -ErrorAction SilentlyContinue |
            Where-Object { $_.OwningProcess -ne 0 }
        
        # Фільтруємо по імені процесу
        $processes = Get-Process -Name "*$ProcessName*" -ErrorAction SilentlyContinue
        
        foreach ($proc in $processes) {
            $procConnections = $netStats | Where-Object { $_.OwningProcess -eq $proc.Id }
            
            foreach ($conn in $procConnections) {
                $key = "$($conn.RemoteAddress):$($conn.RemotePort)"
                
                if (-not $connections.ContainsKey($key)) {
                    $connections[$key] = @{
                        Count = 0
                        FirstSeen = Get-Date
                        LastSeen = Get-Date
                        State = $conn.State
                        LocalPort = $conn.LocalPort
                    }
                    
                    $attemptCount++
                    
                    # Визначаємо тип з'єднання
                    $connType = "UNKNOWN"
                    $color = "White"
                    
                    if ($conn.RemotePort -eq 49153) {
                        $connType = "LICENSE HEARTBEAT"
                        $color = "Red"
                    }
                    elseif ($conn.RemotePort -eq 443) {
                        $connType = "HTTPS"
                        $color = "Yellow"
                    }
                    elseif ($conn.RemotePort -eq 80) {
                        $connType = "HTTP"
                        $color = "Yellow"
                    }
                    elseif ($conn.RemoteAddress -match "^127\.") {
                        $connType = "LOCAL"
                        $color = "Green"
                    }
                    elseif ($conn.RemoteAddress -match "instagram|facebook|cdninstagram") {
                        $connType = "INSTAGRAM"
                        $color = "Cyan"
                    }
                    
                    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] " -ForegroundColor Gray -NoNewline
                    Write-Host "NEW " -ForegroundColor $color -NoNewline
                    Write-Host "$connType " -ForegroundColor $color -NoNewline
                    Write-Host "→ $($conn.RemoteAddress):$($conn.RemotePort)" -ForegroundColor White
                }
                else {
                    $connections[$key].Count++
                    $connections[$key].LastSeen = Get-Date
                }
            }
        }
        
        Start-Sleep -Milliseconds 500
    }
}
catch [System.OperationCanceledException] {
    Write-Host ""
    Write-Host "Моніторинг зупинено користувачем" -ForegroundColor Yellow
}

# Фінальний звіт
Write-Header "РЕЗУЛЬТАТИ МОНІТОРИНГУ"

Write-Host "Тривалість: $(((Get-Date) - $startTime).TotalSeconds).ToString('F1') секунд" -ForegroundColor White
Write-Host "Всього унікальних з'єднань: $($connections.Count)" -ForegroundColor White
Write-Host ""

if ($connections.Count -gt 0) {
    Write-Host "Деталі з'єднань:" -ForegroundColor White
    Write-Host ""
    
    foreach ($key in $connections.Keys | Sort-Object) {
        $conn = $connections[$key]
        $duration = ($conn.LastSeen - $conn.FirstSeen).TotalSeconds
        
        # Визначаємо тип
        $connType = "UNKNOWN"
        $color = "White"
        $port = ($key -split ":")[-1]
        
        if ($port -eq "49153") {
            $connType = "LICENSE HEARTBEAT"
            $color = "Red"
        }
        elseif ($port -eq "443") {
            $connType = "HTTPS"
            $color = "Yellow"
        }
        elseif ($port -eq "80") {
            $connType = "HTTP"
            $color = "Yellow"
        }
        elseif ($key -match "127\.") {
            $connType = "LOCAL"
            $color = "Green"
        }
        
        Write-Host "  [$connType] " -ForegroundColor $color -NoNewline
        Write-Host "$key" -ForegroundColor White
        Write-Host "    Кількість: $($conn.Count) | Тривалість: $($duration.ToString('F1'))s" -ForegroundColor Gray
    }
    
    # Перевірка чи є підозрілі з'єднання
    Write-Host ""
    Write-Host "Аналіз:" -ForegroundColor White
    
    $hasLicenseHeartbeat = $connections.Keys | Where-Object { $_ -match ":49153$" }
    if ($hasLicenseHeartbeat) {
        Write-Host "  [!] Виявлено LICENSE HEARTBEAT (порт 49153)" -ForegroundColor Red
        Write-Host "      Це підтверджує наявність license validation" -ForegroundColor Yellow
        Write-Host "      Застосуйте apply_fix.bat для блокування" -ForegroundColor Yellow
    }
    else {
        Write-Host "  [OK] License heartbeat не виявлено" -ForegroundColor Green
    }
}
else {
    Write-Host "З'єднань не виявлено" -ForegroundColor Yellow
    Write-Host "Можливо процес не запущений або всі з'єднання заблоковані" -ForegroundColor Gray
}

Write-Host ""
Write-Header "МОНІТОРИНГ ЗАВЕРШЕНО"
