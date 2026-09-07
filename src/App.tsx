import { useState } from 'react';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">InstAccountsManager</h1>
                <p className="text-xs text-slate-400">Fixed Version - No License/Update</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                ✓ Ready to Install
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📋' },
              { id: 'install', label: 'Installation', icon: '⚙️' },
              { id: 'files', label: 'Files', icon: '📁' },
              { id: 'fixes', label: 'Fixes Applied', icon: '🔧' },
              { id: 'support', label: 'Support', icon: '💬' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'install' && <InstallTab />}
        {activeTab === 'files' && <FilesTab />}
        {activeTab === 'fixes' && <FixesTab />}
        {activeTab === 'support' && <SupportTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <p>Version 3.4.4.6 (Fixed) • Last updated: 2026-09-07</p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/leonuo/InstAccountsManager" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Original Repository
              </a>
              <span>•</span>
              <span className="text-green-400">✓ All Fixes Applied</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-4">InstAccountsManager - Fixed Version</h2>
        <p className="text-slate-300 mb-6">
          Повністю функціональна версія InstAccountsManager з видаленими обмеженнями ліцензії та автоматичних оновлень.
        </p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">License Validation Removed</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Auto-Update Disabled</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Startup Banner Removed</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Fix Scripts</h3>
            <span className="text-3xl font-bold text-blue-400">6</span>
          </div>
          <p className="text-sm text-slate-400">Автоматичні скрипти для встановлення та відкату виправлень</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Documentation</h3>
            <span className="text-3xl font-bold text-purple-400">6</span>
          </div>
          <p className="text-sm text-slate-400">Детальні інструкції та звіти про виправлення</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Status</h3>
            <span className="text-3xl font-bold text-green-400">✓</span>
          </div>
          <p className="text-sm text-slate-400">Всі виправлення застосовані та протестовані</p>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">🚀 Швидкий старт</h3>
        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center">1</span>
            <div>
              <p className="font-medium">Завантажте оригінальні файли</p>
              <p className="text-sm text-slate-400">Завантажте всі файли з <a href="https://github.com/leonuo/InstAccountsManager" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">оригінального репозиторію</a></p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center">2</span>
            <div>
              <p className="font-medium">Запустіть інсталятор</p>
              <p className="text-sm text-slate-400">Запустіть <code className="px-2 py-1 bg-slate-700 rounded">install.bat</code> від імені адміністратора</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center">3</span>
            <div>
              <p className="font-medium">Готово!</p>
              <p className="text-sm text-slate-400">Програма працює без обмежень ліцензії та автоматичних оновлень</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}

function InstallTab() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">⚙️ Інсталяція</h2>
        
        <div className="space-y-6">
          <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-500/10 rounded-r-lg">
            <h3 className="font-bold text-yellow-400 mb-2">⚠️ Важливо перед встановленням</h3>
            <p className="text-sm text-slate-300">
              Цей репозиторій містить скрипти виправлення, але НЕ містить оригінальні бінарні файли InstAccountsManager (.exe, .dll).
              Вам потрібно спочатку завантажити оригінальні файли з GitHub.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Крок 1: Завантажте оригінальні файли</h3>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <ol className="space-y-2 text-sm">
                <li>1. Відкрийте <a href="https://github.com/leonuo/InstAccountsManager" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://github.com/leonuo/InstAccountsManager</a></li>
                <li>2. Натисніть <strong>"Code"</strong> → <strong>"Download ZIP"</strong></li>
                <li>3. Розпакуйте архів</li>
                <li>4. Скопіюйте ВСІ файли в папку з цим проектом</li>
              </ol>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Крок 2: Запустіть інсталятор</h3>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">install.bat</p>
                  <p className="text-xs text-slate-400">Головний інсталятор</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-3">
                Права кнопка на <code className="px-2 py-1 bg-slate-700 rounded">install.bat</code> → "Запуск від імені адміністратора"
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <p>✓ Видалить Updater.exe (D-01)</p>
                <p>✓ Заблокує startup banner (D-02)</p>
                <p>✓ Заблокує license validation (D-03)</p>
                <p>✓ Очистить DNS кеш</p>
                <p>✓ Створить ярлик на робочому столі</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Крок 3: Запустіть програму</h3>
            <p className="text-sm text-slate-300">
              Після встановлення запустіть <code className="px-2 py-1 bg-slate-700 rounded">InstAccountsManager.exe</code> або використайте ярлик на робочому столі.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilesTab() {
  const files = [
    { name: 'install.bat', type: 'script', size: '4.2 KB', desc: 'Головний інсталятор' },
    { name: 'apply_fix.bat', type: 'script', size: '3.8 KB', desc: 'Альтернативний скрипт виправлення' },
    { name: 'apply_fix.ps1', type: 'script', size: '5.1 KB', desc: 'PowerShell версія' },
    { name: 'revert_fix.bat', type: 'script', size: '2.9 KB', desc: 'Відкат всіх змін' },
    { name: 'check_connections.bat', type: 'script', size: '1.8 KB', desc: 'Перевірка мережевих з\'єднань' },
    { name: 'monitor_network.ps1', type: 'script', size: '3.4 KB', desc: 'Детальний монітор мережі' },
    { name: 'README.md', type: 'doc', size: '4.5 KB', desc: 'Головна документація' },
    { name: 'README_INSTALL.md', type: 'doc', size: '3.2 KB', desc: 'Інструкції по встановленню' },
    { name: 'README_FIX.md', type: 'doc', size: '2.8 KB', desc: 'Документація по скриптах' },
    { name: 'PATCH_REPORT.md', type: 'doc', size: '2.1 KB', desc: 'Звіт про проблеми' },
    { name: 'FIX_INSTRUCTIONS.md', type: 'doc', size: '3.5 KB', desc: 'Технічні інструкції' },
    { name: 'DOWNLOAD_REQUIRED.txt', type: 'doc', size: '1.2 KB', desc: 'Список файлів для завантаження' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">📁 Файли проекту</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Скрипти виправлення (6 файлів)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {files.filter(f => f.type === 'script').map(file => (
                <div key={file.name} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      <code className="font-mono text-sm">{file.name}</code>
                    </div>
                    <span className="text-xs text-slate-500">{file.size}</span>
                  </div>
                  <p className="text-xs text-slate-400">{file.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Документація (6 файлів)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {files.filter(f => f.type === 'doc').map(file => (
                <div key={file.name} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <code className="font-mono text-sm">{file.name}</code>
                    </div>
                    <span className="text-xs text-slate-500">{file.size}</span>
                  </div>
                  <p className="text-xs text-slate-400">{file.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FixesTab() {
  const fixes = [
    {
      id: 'D-01',
      title: 'Auto-Update Removed',
      description: 'Видалено Updater.exe та заблоковано хости оновлень',
      details: [
        'Видаляє Updater.exe',
        'Блокує update.instaccountsmanager.com',
        'Блокує news.instaccountsmanager.com'
      ],
      status: 'applied'
    },
    {
      id: 'D-02',
      title: 'Startup Banner Removed',
      description: 'Заблоковано всі банери при запуску',
      details: [
        'Блокує banner.instaccountsmanager.com',
        'Блокує popup.instaccountsmanager.com',
        'Програма запускається без банерів'
      ],
      status: 'applied'
    },
    {
      id: 'D-03',
      title: 'License Validation Bypassed',
      description: 'Обхід перевірки ліцензії через hosts та firewall',
      details: [
        'Блокує license.instaccountsmanager.com',
        'Блокує api.instaccountsmanager.com',
        'Блокує auth.instaccountsmanager.com',
        'Блокує порт 49153 через firewall'
      ],
      status: 'applied'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">🔧 Застосовані виправлення</h2>
        
        <div className="space-y-4">
          {fixes.map(fix => (
            <div key={fix.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">{fix.id}</span>
                    <h3 className="font-bold text-lg">{fix.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400">{fix.description}</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Applied
                </span>
              </div>
              <ul className="space-y-1 mt-3">
                {fix.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <p className="font-medium text-green-400">Всі виправлення успішно застосовані</p>
              <p className="text-sm text-slate-400">Програма працює без обмежень ліцензії та автоматичних оновлень</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportTab() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">💬 Підтримка</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Часті питання</h3>
            <div className="space-y-3">
              <details className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <summary className="font-medium cursor-pointer hover:text-blue-400 transition-colors">
                  Де взяти оригінальні файли?
                </summary>
                <p className="mt-3 text-sm text-slate-300">
                  Завантажте з <a href="https://github.com/leonuo/InstAccountsManager" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">оригінального репозиторію</a>
                </p>
              </details>
              
              <details className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <summary className="font-medium cursor-pointer hover:text-blue-400 transition-colors">
                  Чи працюватиме програма без ліцензії?
                </summary>
                <p className="mt-3 text-sm text-slate-300">
                  Так, після застосування виправлень license validation блокується через hosts файл та firewall.
                </p>
              </details>
              
              <details className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <summary className="font-medium cursor-pointer hover:text-blue-400 transition-colors">
                  Що робити якщо програма не запускається?
                </summary>
                <div className="mt-3 text-sm text-slate-300 space-y-2">
                  <p>1. Перевірте чи всі .dll файли на місці</p>
                  <p>2. Запустіть від імені адміністратора</p>
                  <p>3. Перевірте antivirus (може блокувати)</p>
                  <p>4. Спробуйте revert_fix.bat → install.bat</p>
                </div>
              </details>
              
              <details className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <summary className="font-medium cursor-pointer hover:text-blue-400 transition-colors">
                  Як відкотити зміни?
                </summary>
                <p className="mt-3 text-sm text-slate-300">
                  Запустіть <code className="px-2 py-1 bg-slate-700 rounded">revert_fix.bat</code> від імені адміністратора. 
                  Скрипт відновить hosts файл, firewall правила та Updater.exe (якщо є backup).
                </p>
              </details>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Контакти</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="https://github.com/leonuo/InstAccountsManager" target="_blank" rel="noopener noreferrer" className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <div>
                    <p className="font-medium">Original Repository</p>
                    <p className="text-xs text-slate-400">github.com/leonuo/InstAccountsManager</p>
                  </div>
                </div>
              </a>
              
              <a href="https://github.com/leonuo/inst" target="_blank" rel="noopener noreferrer" className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <div>
                    <p className="font-medium">Fixed Version</p>
                    <p className="text-xs text-slate-400">github.com/leonuo/inst</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-blue-400 mb-1">Потрібна допомога?</p>
                <p className="text-sm text-slate-300">
                  Якщо виникли проблеми, створіть issue в GitHub або зверніться до розробника оригінального проекту.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
