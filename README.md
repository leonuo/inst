# 🛠️ InstAccountsManager - Fixed Version (No License/Update)

## 📌 Про цей репозиторій

Це **виправлена версія** InstAccountsManager з видаленими:
- ❌ License validation
- ❌ Auto-update (Updater.exe)
- ❌ Startup banner

**Оригінальний репозиторій:** https://github.com/leonuo/InstAccountsManager

---

## ⚠️ ВАЖЛИВО: Перед встановленням

Цей репозиторій містить **скрипти виправлення**, але **НЕ містить оригінальні бінарні файли**.

### 📥 Крок 1: Завантажте оригінальні файли

1. Відкрийте https://github.com/leonuo/InstAccountsManager
2. Натисніть **"Code"** → **"Download ZIP"**
3. Розпакуйте архів
4. Скопіюйте **ВСІ файли** в цю папку

### 🔧 Крок 2: Застосуйте виправлення

```
Права кнопка на install.bat → "Запуск від імені адміністратора"
```

Інсталятор автоматично:
- ✅ Видалить `Updater.exe`
- ✅ Заблокує startup banner
- ✅ Заблокує license validation
- ✅ Створить ярлик на робочому столі

### 🚀 Крок 3: Запустіть програму

Після встановлення запустіть `InstAccountsManager.exe` або використайте ярлик.

---

## 📦 Що включено в цей репозиторій

### Скрипти виправлення:
| Файл | Опис |
|------|------|
| `install.bat` | 🎯 **Головний інсталятор** - застосовує всі виправлення |
| `apply_fix.bat` | Альтернативний скрипт виправлення |
| `revert_fix.bat` | Відкат всіх змін |
| `check_connections.bat` | Перевірка мережевих з'єднань |
| `apply_fix.ps1` | PowerShell версія (детальна) |
| `monitor_network.ps1` | Монітор мережі |

### Документація:
| Файл | Опис |
|------|------|
| `README.md` | Цей файл - головна документація |
| `README_INSTALL.md` | Детальні інструкції по встановленню |
| `README_FIX.md` | Документація по скриптах виправлення |
| `PATCH_REPORT.md` | Звіт про знайдені проблеми |
| `FIX_INSTRUCTIONS.md` | Технічні інструкції |
| `DOWNLOAD_REQUIRED.txt` | Список файлів які потрібно завантажити |

---

## 🔧 Що роблять виправлення

### D-01: Видалення Auto-Update
- ❌ Видаляє `Updater.exe`
- ❌ Блокує хости оновлень через `hosts`
- **Результат:** Програма більше не намагається оновлюватися

### D-02: Блокування Startup Banner
- ❌ Блокує `banner.instaccountsmanager.com`
- ❌ Блокує `news.instaccountsmanager.com`
- ❌ Блокує `popup.instaccountsmanager.com`
- **Результат:** Програма запускається без банерів

### D-03: Обхід License Validation
- ❌ Блокує `license.instaccountsmanager.com`
- ❌ Блокує `api.instaccountsmanager.com`
- ❌ Блокує `auth.instaccountsmanager.com`
- ❌ Блокує порт 49153 через firewall
- **Результат:** Програма працює без license перевірок

---

## 📁 Структура файлів

### Файли які потрібно завантажити з оригінального репозиторію:

```
InstAccountsManager.exe     ← Головна програма
Antigate.dll                ← CAPTCHA solver
ChilkatDotNet45.dll         ← HTTP client
DotNetZip.dll               ← ZIP архівація
GMap.NET.Core.dll           ← Карти
GMap.NET.WindowsForms.dll   ← UI для карт
MailBee.NET.dll             ← Email клієнт
NAudio.dll                  ← Аудіо обробка
Newtonsoft.Json.dll         ← JSON парсер
Pector.dll                  ← Image processing
Rucaptcha.dll               ← CAPTCHA solver
System.Data.SQLite.dll      ← База даних
VipsBundle.dll              ← Image processing
WebDriver.dll               ← Browser automation
WebDriver.Support.dll       ← Browser automation support
xNet.dll                    ← Network library
chromedriver.exe            ← Chrome driver
ffmpeg.exe                  ← Video processing
ffprobe.exe                 ← Video probing
hevcenc.exe                 ← HEVC encoder
sqlite3.exe                 ← SQLite CLI
libglib-2.0-0.dll           ← GLib library
libgobject-2.0-0.dll        ← GObject library
libvips-42.dll              ← VIPS library
```

### Папки які потрібно завантажити:

```
cfg/                        ← Налаштування програми
DataBases/                  ← Бази даних
IG_PROFILES/                ← Профілі Instagram
PerfectBrowser/             ← Browser data
extension/                  ← Browser extension
fonts/                      ← Шрифти
images/                     ← Зображення
langs/                      ← Мовні файли
language/                   ← Мовні файли (alt)
audio/                      ← Аудіо файли
tasks/                      ← Завдання
tasksOrder/                 ← Порядок завдань
x64/                        ← 64-bit libraries
x86/                        ← 32-bit libraries
```

### Файли які МОЖНА видалити (не впливають на роботу):

```
❌ Updater.exe              ← Видаляється автоматично (D-01)
❌ Application_Exceptions.txt
❌ IMAP.txt
❌ LastChanges.txt
❌ Proxies.txt
❌ Proxies_For_Check.txt
❌ SmsActivateMailTransactionIDs.txt
❌ UserAgents.txt
❌ UserAgentsAPI.txt
❌ log2.txt
❌ serverLog.txt
❌ Perfect
❌ __-__
```

---

## 🔄 Відкат змін

Якщо щось пішло не так:

```
Права кнопка на revert_fix.bat → "Запуск від імені адміністратора"
```

Відкат:
- ✅ Відновить `hosts` файл
- ✅ Відновить `Updater.exe` (якщо є backup)
- ✅ Видалить firewall правила

---

## ❓ Часті питання

### Q: Де взяти оригінальні файли?
**A:** Завантажте з https://github.com/leonuo/InstAccountsManager

### Q: Чи працюватиме програма без ліцензії?
**A:** Так, після застосування виправлень license validation блокується.

### Q: Чи можу я оновлювати програму?
**A:** Ні, Updater.exe видалено. Завантажте нову версію вручну.

### Q: Що робити якщо програма не запускається?
**A:** 
1. Перевірте чи всі .dll файли на місці
2. Запустіть від імені адміністратора
3. Перевірте antivirus
4. Спробуйте `revert_fix.bat` → `install.bat`

---

## 📊 Статус

| Компонент | Статус |
|-----------|--------|
| Auto-update | ❌ ВИДАЛЕНО |
| Startup banner | ❌ ЗАБЛОКОВАНО |
| License validation | ❌ ЗАБЛОКОВАНО |
| Програма | ✅ ПРАЦЮЄ |

---

## 🆘 Підтримка

Якщо виникли проблеми:

1. Перевірте чи всі файли з оригінального репозиторію на місці
2. Запустіть `install.bat` від імені адміністратора
3. Перевірте firewall та antivirus
4. Спробуйте `revert_fix.bat` для відкату

---

**Версія:** 3.4.4.6 (Fixed)  
**Останнє оновлення:** 2026-09-07  
**Статус:** ✅ Готово до встановлення
