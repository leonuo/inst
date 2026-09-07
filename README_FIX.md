# 🛠️ InstAccountsManager - FIX PACK

## 📦 Що включено

| Файл | Опис |
|------|------|
| `apply_fix.bat` | **ГОЛОВНИЙ** - застосовує всі виправлення |
| `apply_fix.ps1` | PowerShell версія (більш детальна) |
| `revert_fix.bat` | Відкат всіх виправлень |
| `check_connections.bat` | Перевірка мережевих з'єднань |
| `monitor_network.ps1` | Детальний монітор мережі |
| `PATCH_REPORT.md` | Звіт про знайдені проблеми |
| `FIX_INSTRUCTIONS.md` | Детальні інструкції |

---

## 🚀 ШВИДКИЙ СТАРТ

### Крок 1: Перевірте з'єднання

```batch
:: Запустіть InstAccountsManager.exe, потім:
check_connections.bat
```

Якщо бачите "ПОРТ 49153 АКТИВНИЙ" - це license validation.

### Крок 2: Застосуйте виправлення

**Варіант A: BAT файл (простіше)**
```batch
:: Права кнопка на apply_fix.bat → "Запуск від імені адміністратора"
```

**Варіант B: PowerShell (більш детальний)**
```powershell
# Відкрийте PowerShell як адміністратор
cd "шлях\до\InstAccountsManager"
.\apply_fix.ps1
```

### Крок 3: Перевірте статус

```powershell
.\apply_fix.ps1 -Status
```

---

## 🔧 ЩО РОБЛЯТЬ ВИПРАВЛЕННЯ

### D-01: Видалення Auto-Update
- ❌ Видаляє `Updater.exe`
- ❌ Блокує хости оновлень через `hosts`
- ❌ Блокує firewall правила для Updater

### D-02: Блокування Startup Banner
- ❌ Блокує `banner.instaccountsmanager.com`
- ❌ Блокує `news.instaccountsmanager.com`
- ❌ Блокує `popup.instaccountsmanager.com`

### D-03: Обхід License Validation
- ❌ Блокує `license.instaccountsmanager.com`
- ❌ Блокує `api.instaccountsmanager.com`
- ❌ Блокує `auth.instaccountsmanager.com`
- ❌ Блокує порт 49153 через firewall

---

## 🔄 ВІДКАТ

Якщо щось пішло не так:

```batch
:: Права кнопка на revert_fix.bat → "Запуск від імені адміністратора"
```

Або PowerShell:
```powershell
.\apply_fix.ps1 -Revert
```

---

## 📊 ПЕРЕВІРКА РЕЗУЛЬТАТІВ

### Перевірити firewall правила:
```powershell
Get-NetFirewallRule | Where-Object { $_.DisplayName -like "IAM-*" }
```

### Перевірити hosts файл:
```batch
type C:\Windows\System32\drivers\etc\hosts | findstr "IAM"
```

### Перевірити з'єднання:
```batch
netstat -ano | findstr "49153"
```

Якщо нічого не показує - виправлення працюють!

---

## ⚠️ ВАЖЛИВО

1. **Всі скрипти потребують прав адміністратора**
2. **Backup створюється автоматично** в папці `BACKUP_YYYYMMDD`
3. **Не видаляйте папку backup** доки не переконаєтесь що все працює
4. **Перезапустіть InstAccountsManager** після застосування виправлень

---

## 🆘 ПРОБЛЕМИ

### "Цей скрипт потребує прав адміністратора"
- Натисніть правою кнопкою → "Запуск від імені адміністратора"

### "PowerShell scripts are disabled"
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### "Backup не знайдено"
- Переконаєтесь що ви в правильній папці
- Перевірте що папка `BACKUP_*` існує

### Виправлення не допомогли
- Запустіть `monitor_network.ps1` для детального аналізу
- Перевірте що InstAccountsManager.exe не має інших з'єднань
- Зверніться до розробника за вихідним кодом

---

## 📝 ЛОГ ДІЙ

Після запуску `apply_fix.bat` ви побачите:

```
[D-01] Auto-update ............ ВИДАЛЕНО
[D-02] Startup banner ......... ЗАБЛОКОВАНО
[D-03] License validation ..... ЗАБЛОКОВАНО
[FW]   Firewall rules ........ ДОДАНО
[DNS]  DNS cache .............. ОЧИЩЕНО
```

---

**Останнє оновлення:** 2026-09-07  
**Статус:** ✅ Готово до використання
