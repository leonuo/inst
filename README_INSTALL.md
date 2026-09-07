# 📥 Інструкції по встановленню InstAccountsManager (Fixed Version)

## ⚠️ ВАЖЛИВО: Перед встановленням

Цей репозиторій містить **скрипти виправлення** для InstAccountsManager, але **НЕ містить оригінальні бінарні файли** (.exe, .dll).

Вам потрібно **спочатку завантажити оригінальні файли** з GitHub:
👉 https://github.com/leonuo/InstAccountsManager

---

## 🚀 Швидке встановлення

### Крок 1: Завантажте оригінальні файли

1. Відкрийте https://github.com/leonuo/InstAccountsManager
2. Натисніть **"Code"** → **"Download ZIP"**
3. Розпакуйте архів

### Крок 2: Скопіюйте скрипти виправлення

Скопіюйте ці файли в папку з розпакованим InstAccountsManager:

```
✅ install.bat              (головний інсталятор)
✅ apply_fix.bat            (альтернативний скрипт виправлення)
✅ revert_fix.bat           (відкат змін)
✅ README_INSTALL.md        (ця інструкція)
```

### Крок 3: Запустіть інсталятор

```
Права кнопка на install.bat → "Запуск від імені адміністратора"
```

Інсталятор автоматично:
- ✅ Видалить `Updater.exe` (D-01)
- ✅ Заблокує startup banner (D-02)
- ✅ Заблокує license validation (D-03)
- ✅ Очистить DNS кеш
- ✅ Створить ярлик на робочому столі

### Крок 4: Запустіть програму

Після встановлення запустіть `InstAccountsManager.exe` або використайте ярлик на робочому столі.

---

## 📁 Структура файлів

### Обов'язкові файли (з оригінального репозиторію):

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

### Конфігураційні файли:

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
❌ Application_Exceptions.txt ← Логи помилок
❌ IMAP.txt                 ← IMAP конфігурація
❌ LastChanges.txt          ← Історія змін
❌ Proxies.txt              ← Проксі (якщо не використовуєте)
❌ Proxies_For_Check.txt    ← Проксі для перевірки
❌ SmsActivateMailTransactionIDs.txt ← SMS активи
❌ UserAgents.txt           ← User agents
❌ UserAgentsAPI.txt        ← API user agents
❌ log2.txt                ← Логи
❌ serverLog.txt           ← Server логи
❌ Perfect                 ← Backup файл
❌ __-__                   ← Невідомий файл
```

---

## 🔧 Що роблять виправлення

### D-01: Видалення Auto-Update
**Що робить:**
- Видаляє `Updater.exe`
- Блокує хости оновлень через `hosts` файл

**Чому потрібно:**
- Updater.exe викликає зависання
- Автоматичні оновлення ламають систему

### D-02: Блокування Startup Banner
**Що робить:**
- Блокує `banner.instaccountsmanager.com`
- Блокує `news.instaccountsmanager.com`
- Блокує `popup.instaccountsmanager.com`

**Чому потрібно:**
- Банер блокує запуск програми
- Викликає помилки при старті

### D-03: Обхід License Validation
**Що робить:**
- Блокує `license.instaccountsmanager.com`
- Блокує `api.instaccountsmanager.com`
- Блокує `auth.instaccountsmanager.com`
- Блокує порт 49153 через firewall

**Чому потрібно:**
- License validation блокує роботу
- Heartbeat mechanism викликає зависання

---

## 🔄 Відкат змін

Якщо щось пішло не так:

```
Права кнопка на revert_fix.bat → "Запуск від імені адміністратора"
```

Відкат:
- Відновить `hosts` файл
- Відновить `Updater.exe` (якщо є backup)
- Видалить firewall правила

---

## ❓ Часті питання

### Q: Де взяти оригінальні файли?
**A:** Завантажте з https://github.com/leonuo/InstAccountsManager

### Q: Чи потрібно видаляти всі файли з "Можна видалити"?
**A:** Ні, це опціонально. Видаляйте тільки якщо хочете звільнити місце.

### Q: Чи працюватиме програма без ліцензії?
**A:** Так, після застосування виправлень license validation блокується.

### Q: Чи можу я оновлювати програму?
**A:** Ні, Updater.exe видалено. Якщо потрібно оновлення - завантажте нову версію вручну.

### Q: Що робити якщо програма не запускається?
**A:** 
1. Перевірте чи всі .dll файли на місці
2. Запустіть від імені адміністратора
3. Перевірте antivirus (може блокувати)
4. Спробуйте `revert_fix.bat` і потім знову `install.bat`

---

## 📊 Статус файлів

| Файл | Статус | Примітка |
|------|--------|----------|
| InstAccountsManager.exe | ✅ Потрібен | З оригінального репозиторію |
| Updater.exe | ❌ Видалено | D-01 |
| *.dll файли | ✅ Потрібні | З оригінального репозиторію |
| *.exe драйвери | ✅ Потрібні | З оригінального репозиторію |
| cfg/, DataBases/ | ✅ Потрібні | З оригінального репозиторію |
| Логи, txt файли | ⚠️ Опціонально | Можна видалити |

---

## 🆘 Підтримка

Якщо виникли проблеми:

1. Перевірте чи всі файли з оригінального репозиторію на місці
2. Запустіть `install.bat` від імені адміністратора
3. Перевірте firewall та antivirus
4. Спробуйте `revert_fix.bat` для відкату

---

**Останнє оновлення:** 2026-09-07  
**Версія:** 3.4.4.6 (Fixed)  
**Статус:** ✅ Готово до встановлення
