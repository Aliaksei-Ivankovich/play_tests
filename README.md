# 🎭 Playwright Test Project

Проект автоматизированного E2E тестирования на основе **Playwright** + **TypeScript**.

## 📋 Содержание

- [Технологии](#технологии)
- [Структура проекта](#структура-проекта)
- [Установка](#установка)
- [Настройка окружения](#настройка-окружения)
- [Запуск тестов](#запуск-тестов)
- [Написание тестов](#написание-тестов)
- [CI/CD](#cicd)

---

## 🛠 Технологии

| Технология | Версия | Описание |
|---|---|---|
| [Playwright](https://playwright.dev) | ^1.50 | Фреймворк для E2E тестирования |
| [TypeScript](https://www.typescriptlang.org) | ^5.7 | Язык программирования |
| [Node.js](https://nodejs.org) | ≥ 18 | Среда выполнения |

---

## 📁 Структура проекта

```
play_tests/
├── .github/
│   └── workflows/
│       └── playwright.yml       # CI/CD пайплайн GitHub Actions
│
├── pages/                       # Page Object Models (POM)
│   ├── BasePage.ts              # Базовый класс для всех страниц
│   ├── LoginPage.ts             # Страница входа (пример)
│   └── index.ts                 # Экспорт всех POM
│
├── tests/
│   ├── e2e/                     # E2E тесты
│   │   ├── example.spec.ts      # Примеры базовых тестов
│   │   └── login.spec.ts        # Тесты входа (пример)
│   └── fixtures/
│       └── base.fixtures.ts     # Кастомные фикстуры
│
├── utils/                       # Вспомогательные утилиты
│   ├── api.ts                   # API клиент для тестов
│   ├── helpers.ts               # Общие вспомогательные функции
│   └── index.ts                 # Экспорт утилит
│
├── test-data/                   # Тестовые данные
│   └── users.json               # Данные пользователей
│
├── .env.example                 # Пример переменных окружения
├── .gitignore                   # Исключения для Git
├── package.json                 # Зависимости и скрипты
├── playwright.config.ts         # Конфигурация Playwright
├── tsconfig.json                # Конфигурация TypeScript
└── README.md                    # Документация
```

---

## 🚀 Установка

### 1. Клонировать репозиторий

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Установить браузеры Playwright

```bash
npx playwright install
```

---

## ⚙️ Настройка окружения

Скопируйте файл примера и заполните своими значениями:

```bash
cp .env.example .env
```

Отредактируйте `.env`:

```env
BASE_URL=https://your-app.com
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=your_password
```

> ⚠️ Никогда не добавляйте `.env` в git — он содержит секреты!

---

## ▶️ Запуск тестов

| Команда | Описание |
|---|---|
| `npm test` | Запустить все тесты |
| `npm run test:headed` | Запустить с видимым браузером |
| `npm run test:ui` | Запустить в интерактивном UI режиме |
| `npm run test:debug` | Запустить в режиме отладки |
| `npm run test:chromium` | Только в Chrome |
| `npm run test:firefox` | Только в Firefox |
| `npm run test:webkit` | Только в Safari |
| `npm run test:mobile` | На мобильных устройствах |
| `npm run test:report` | Открыть HTML-отчёт |
| `npm run codegen` | Записать тест с помощью кодогенератора |

### Примеры запуска конкретных тестов

```bash
# Запустить тест из конкретного файла
npx playwright test tests/e2e/login.spec.ts

# Запустить тест по названию
npx playwright test -g "успешный вход"

# Запустить с тегом
npx playwright test --grep @smoke
```

---

## ✍️ Написание тестов

### Паттерн Page Object Model (POM)

Создайте новый файл в `pages/`:

```typescript
// pages/MyPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  private readonly myButton: Locator;

  constructor(page: Page) {
    super(page);
    this.myButton = page.getByRole('button', { name: 'Click me' });
  }

  async goto(): Promise<void> {
    await this.navigate('/my-page');
  }

  async clickButton(): Promise<void> {
    await this.myButton.click();
  }
}
```

### Создание теста

```typescript
// tests/e2e/my-feature.spec.ts
import { test, expect } from '../fixtures/base.fixtures';

test.describe('Моя функциональность', () => {
  test('проверка кнопки', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button')).toBeVisible();
  });
});
```

### Использование фикстур

```typescript
// Подключить готовые фикстуры
import { test, expect } from '../fixtures/base.fixtures';

test('тест с фикстурами', async ({ loginPage, apiClient }) => {
  await loginPage.goto();
  // loginPage и apiClient уже созданы и готовы к использованию
});
```

---

## 🔄 CI/CD

Проект настроен для работы с **GitHub Actions**.

### Что происходит при пуше в `main` / `develop`:

1. Запускается матрица из 4 шардов параллельно
2. Устанавливаются браузеры
3. Запускаются все тесты
4. Отчёты объединяются и загружаются как артефакт

### Настройка секретов в GitHub

Перейдите: `Settings → Secrets and variables → Actions`

| Секрет | Описание |
|---|---|
| `BASE_URL` | URL тестируемого приложения |
| `API_URL` | URL API (если отличается) |

---

## 📊 Отчёты

После запуска тестов:

```bash
# Открыть HTML-отчёт
npm run test:report
```

Отчёты хранятся в:
- `playwright-report/` — HTML отчёт
- `test-results/` — JSON результаты и артефакты (скриншоты, видео)
