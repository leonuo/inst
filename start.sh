#!/bin/bash

echo "========================================"
echo " InstAccountsManager Investigation Dossier"
echo "========================================"
echo ""

# Перевірка Node.js
if ! command -v node &> /dev/null; then
    echo "[ПОМИЛКА] Node.js не знайдено!"
    echo ""
    echo "Встановіть Node.js з https://nodejs.org/"
    echo ""
    exit 1
fi

# Перевірка версії Node.js
NODE_VERSION=$(node -v)
echo "[INFO] Node.js версія: $NODE_VERSION"
echo ""

# Перевірка наявності node_modules
if [ ! -d "node_modules" ]; then
    echo "[INFO] Встановлення залежностей..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo "[ПОМИЛКА] Помилка встановлення залежностей!"
        exit 1
    fi
    echo ""
    echo "[OK] Залежності встановлено"
    echo ""
fi

# Запуск dev сервера
echo "[INFO] Запуск dev сервера на http://localhost:3000"
echo ""
echo "Натисніть Ctrl+C для зупинки"
echo ""
npm run dev
