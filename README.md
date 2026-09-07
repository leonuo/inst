# InstAccountsManager Investigation Dossier

Веб-досьє з результатами розслідування InstAccountsManager.

## 🚀 Швидкий старт

### Вимоги
- **Node.js** версії 18 або вище
- **npm** версії 8 або више

### Встановлення залежностей

```bash
npm install
```

### Запуск у режимі розробки

```bash
npm run dev
```

Програма відкриється на **http://localhost:3000**

### Створення продакшн-білду

```bash
npm run build
```

Готові файли будуть у папці `dist/`

### Перегляд продакшн-білду локально

```bash
npm run preview
```

## 📋 Доступні команди

| Команда | Опис |
|---------|------|
| `npm run dev` | Запуск dev сервера з hot reload (порт 3000) |
| `npm run build` | Створення оптимізованого продакшн-білду |
| `npm run preview` | Перегляд продакшн-білду локально |
| `npm run typecheck` | Перевірка TypeScript типів |

## 📁 Структура проєкту

```
├── src/
│   ├── components/
│   │   ├── ConsoleFeed.tsx      # Консольний фід подій
│   │   ├── FlowDiagram.tsx      # Діаграма потоків
│   │   └── ui.tsx               # UI компоненти
│   ├── data/
│   │   └── dossier.ts           # Дані досьє
│   ├── App.tsx                  # Головний компонент
│   ├── index.css                # Стилі (Tailwind)
│   └── main.tsx                 # Точка входу
├── index.html                   # HTML шаблон
├── package.json                 # Залежності та скрипти
├── tsconfig.json                # TypeScript конфігурація
└── vite.config.js               # Vite конфігурація
```

## 🔧 Технології

- **React 18** - UI бібліотека
- **TypeScript** - Типізація
- **Vite** - Build інструмент
- **Tailwind CSS 4** - Стилі
- **Framer Motion** - Анімації
- **Lucide React** - Іконки
- **Recharts** - Графіки

## 📊 Розмір білду

- **JavaScript**: ~202 kB (gzip: ~65 kB)
- **CSS**: ~36 kB (gzip: ~8 kB)
- **HTML**: ~1 kB

## 🎯 Що це?

Це веб-сторінка з результатами розслідування InstAccountsManager, яка містить:

- Архітектурний аналіз
- Матрицю функцій
- Реєстр root causes
- План відлагодження
- Інтерактивну діаграму потоків

## 📝 Примітки

- Всі зміни застосовані локально
- Для синхронізації з GitHub потрібно виконати `git push`
- Програма не містить блокувань від ліцензування
- Всі функціональні компоненти працюють коректно
