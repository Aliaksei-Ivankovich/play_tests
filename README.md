# 🎭 Playwright Test Project

Проект автоматизированного **E2E тестирования** веб-приложений на основе [Playwright](https://playwright.dev) + [TypeScript](https://www.typescriptlang.org).

> 📖 Это руководство написано для людей без глубокого знания JavaScript/TypeScript.
> Каждый термин объяснён простыми словами.

---

## 📋 Содержание

- [Что такое Playwright и зачем он нужен](#что-такое-playwright-и-зачем-он-нужен)
- [Технологии](#технологии)
- [Структура проекта](#структура-проекта)
- [Установка с нуля](#установка-с-нуля)
- [Настройка окружения](#настройка-окружения)
- [Запуск тестов](#запуск-тестов)
- [Тесты alfabit.org — авиабилеты](#тесты-alfabitorg--авиабилеты)
- [Как устроен тест](#как-устроен-тест)
- [Написание первого теста](#написание-первого-теста)
- [Паттерн Page Object Model](#паттерн-page-object-model)
- [Полезные команды Playwright](#полезные-команды-playwright)
- [Что делать когда тест упал](#что-делать-когда-тест-упал)
- [CI/CD — автозапуск на GitHub](#cicd--автозапуск-на-github)
- [Репозиторий на GitHub](#репозиторий-на-github)
- [Частые вопросы](#частые-вопросы)

---

## Что такое Playwright и зачем он нужен?

**Playwright** — это инструмент, который управляет браузером вместо человека.

Представьте, что вам нужно каждый день проверять: открывается ли сайт, работает ли форма входа, правильно ли отображаются данные. Делать это вручную — долго и скучно. Playwright делает это автоматически.

```
Человек вручную:                   Playwright автоматически:
─────────────────────────          ─────────────────────────
1. Открыть браузер                 1. Открыть браузер ✅
2. Перейти на сайт         →       2. Перейти на сайт ✅
3. Ввести логин и пароль           3. Ввести логин и пароль ✅
4. Нажать «Войти»                  4. Нажать «Войти» ✅
5. Проверить, что вошли            5. Проверить результат ✅
                                   Время: 3 секунды. Каждый раз.
```

**Playwright умеет:**
- Работать в Chrome, Firefox и Safari одновременно
- Тестировать мобильные версии сайтов
- Делать скриншоты и видеозаписи
- Перехватывать сетевые запросы
- Запускаться в «невидимом» режиме (без GUI) на серверах

---

## 🛠 Технологии

| Технология | Для чего нужна |
|---|---|
| **[Node.js](https://nodejs.org)** | Среда запуска — «движок», на котором всё работает. Как Java для Java-программ |
| **[npm](https://npmjs.com)** | Менеджер пакетов — устанавливает библиотеки. Как «магазин приложений» для Node.js |
| **[TypeScript](https://www.typescriptlang.org)** | Язык написания тестов. Это JavaScript с подсказками типов — меньше ошибок |
| **[Playwright](https://playwright.dev)** | Фреймворк тестирования — управляет браузером и проверяет результаты |
| **[dotenv](https://github.com/motdotla/dotenv)** | Загружает настройки из файла `.env` |

---

## 📁 Структура проекта

```
play_tests/
│
├── 📁 .github/
│   └── 📁 workflows/
│       ├── playwright.yml              # Автозапуск тестов на GitHub
│       └── README.md                   # Описание CI/CD
│
├── 📁 pages/                           # Page Object Models — описание страниц
│   ├── BasePage.ts                     # Общие методы для всех страниц
│   ├── AviaSearchPage.ts               # Страница поиска авиабилетов alfabit.org
│   ├── AviaResultsPage.ts              # Страница результатов поиска
│   ├── example.LoginPage.ts            # Пример POM страницы входа
│   ├── index.ts                        # Список экспортов
│   └── README.md                       # Описание паттерна POM
│
├── 📁 tests/                           # Все тесты
│   ├── 📁 e2e/                         # E2E тесты
│   │   ├── avia-search.spec.ts         # Тесты формы поиска авиабилетов ✅
│   │   ├── avia-results.spec.ts        # Тесты страницы результатов поиска ✅
│   │   ├── example.basic.spec.ts       # Базовые примеры Playwright
│   │   ├── example.login.spec.ts       # Шаблон тестов авторизации
│   │   └── README.md                   # Как писать тесты
│   │
│   ├── 📁 fixtures/                    # Заготовки для тестов
│   │   ├── base.fixtures.ts            # Фикстуры: aviaSearchPage, aviaResultsPage, apiClient
│   │   └── README.md                   # Что такое фикстуры
│   │
│   └── README.md                       # Обзор папки tests/
│
├── 📁 utils/                           # Вспомогательные инструменты
│   ├── helpers.ts                      # Мелкие функции-помощники
│   ├── api.ts                          # HTTP клиент для API запросов
│   ├── index.ts                        # Список экспортов
│   └── README.md                       # Описание утилит
│
├── 📁 test-data/                       # Тестовые данные (JSON файлы)
│   ├── avia-search.json                # Маршруты, города и параметры для авиатестов
│   ├── example.users.json              # Пример данных пользователей
│   └── README.md                       # Как работать с тестовыми данными
│
├── .env                                # Локальные переменные окружения (не в git!)
├── .env.example                        # Шаблон переменных окружения
├── .gitignore                          # Что НЕ загружать на GitHub
├── package.json                        # Список зависимостей и команды запуска
├── playwright.config.ts                # Настройки Playwright
├── tsconfig.json                       # Настройки TypeScript
└── README.md                           # Этот файл
```

> 📌 В каждой папке есть свой `README.md` с подробным описанием

---

## 🚀 Установка с нуля

### Что нужно установить перед началом

#### 1. Node.js

Playwright работает на Node.js. Проверьте, установлен ли он:
```bash
node --version
```

Если команда не найдена — скачайте Node.js с [nodejs.org](https://nodejs.org) (выбирайте **LTS** версию).

#### 2. Клонировать репозиторий

```bash
git clone https://github.com/Aliaksei-Ivankovich/play_tests.git
cd play_tests
```

> **Что такое `git clone`?** Это скачивание копии проекта с GitHub на ваш компьютер.

#### 3. Установить зависимости

```bash
npm install
```

> **Что происходит?** npm читает файл `package.json`, видит список нужных библиотек и скачивает их в папку `node_modules/`. Эта папка может занимать сотни МБ — это нормально.

#### 4. Установить браузеры

```bash
npx playwright install
```

> **Что происходит?** Playwright скачивает свои версии Chrome, Firefox и Safari. Это нужно, чтобы тесты работали одинаково на любом компьютере.

---

## ⚙️ Настройка окружения

Тестам нужно знать, **какой сайт тестировать** и какие данные использовать. Эти настройки хранятся в файле `.env`.

### Шаг 1: Создать `.env` файл

```bash
cp .env.example .env
```

> Это копирует файл-пример. Теперь у вас есть `.env` для заполнения.

### Шаг 2: Заполнить `.env` своими значениями

Откройте файл `.env` и при необходимости замените значения. Для запуска текущих тестов (alfabit.org) файл уже настроен корректно:

```env
# URL сайта, который тестируем (уже настроен для alfabit.org)
BASE_URL=https://alfabit.org

# URL API (если отличается)
API_URL=https://api.alfabit.org
```

> Если вы захотите тестировать другой сайт — просто замените `BASE_URL`.

### ⚠️ Важно!

`.env` файл **никогда не попадает на GitHub** (он в `.gitignore`). Это правильно — в нём могут быть пароли. Каждый разработчик создаёт свой `.env` локально.

---

## ▶️ Запуск тестов

### Основные команды

| Команда | Что делает |
|---|---|
| `npm test` | Запустить все тесты во всех браузерах |
| `npm run test:chromium` | Только в Chrome |
| `npm run test:firefox` | Только в Firefox |
| `npm run test:webkit` | Только в Safari |
| `npm run test:mobile` | На эмуляции мобильных устройств |
| `npm run test:headed` | Запустить с **видимым** браузером (можно наблюдать) |
| `npm run test:ui` | Открыть визуальный интерфейс управления тестами |
| `npm run test:debug` | Режим отладки — тест останавливается на каждой строке |
| `npm run test:report` | Открыть HTML-отчёт последнего запуска |
| `npm run codegen` | Записать тест — браузер откроется, вы кликаете, код пишется сам |

### Запустить конкретный тест или файл

```bash
# Один конкретный файл
npx playwright test tests/e2e/avia-search.spec.ts

# Только в Chrome
npx playwright test tests/e2e/avia-search.spec.ts --project=chromium

# Тест по части названия (используйте текст без кавычек «»)
npx playwright test -g "URL страницы корректный"

# Все тесты с тегом @smoke
npx playwright test --grep @smoke
```

> ⚠️ **Важно про флаг `-g`:** он ищет текст внутри названия теста через регулярное выражение. Если в названии теста есть кавычки `«»` или скобки `()` — включать их в поиск не нужно, достаточно любой уникальной части текста.

### 👁 Запустить один тест с видимым браузером

Флаг `--headed` открывает браузер на экране — можно наблюдать за каждым шагом в реальном времени.

```bash
# Конкретный файл с видимым браузером
npx playwright test tests/e2e/avia-search.spec.ts --headed

# Один тест по части названия + видимый браузер
npx playwright test tests/e2e/avia-search.spec.ts -g "URL страницы корректный" --headed

# Один тест + только Chrome + видимый браузер (самый быстрый вариант)
npx playwright test tests/e2e/avia-search.spec.ts -g "все элементы формы" --headed --project=chromium

# Тест из другого файла по части названия + видимый браузер
npx playwright test tests/e2e/avia-results.spec.ts -g "поиск через популярное направление" --headed --project=chromium
```

> 💡 **Совет:** всегда указывайте конкретный файл перед `-g` — так Playwright не будет перебирать все файлы проекта.

> 💡 **Совет:** добавьте `--project=chromium` чтобы не ждать Firefox и Safari — быстрее увидите результат.

Если нужно **остановиться на каждом шаге** и смотреть что происходит — используйте режим отладки:

```bash
npx playwright test tests/e2e/avia-search.spec.ts --debug
```

Откроется браузер с панелью управления — можно нажимать «следующий шаг» и видеть выделенный элемент.

### Режим UI — самый удобный для начала

```bash
npm run test:ui
```

Откроется визуальный интерфейс, где можно:
- Видеть список всех тестов
- Запускать их по одному кнопкой
- Видеть скриншоты каждого шага
- Смотреть видеозапись теста

---

## ✈️ Тесты alfabit.org — авиабилеты

В проекте реализованы реальные тесты для сайта **[alfabit.org/ru/travel/avia](https://alfabit.org/ru/travel/avia)** — поиск авиабилетов за криптовалюту.

### Что тестируется

#### `tests/e2e/avia-search.spec.ts` — форма поиска (21 тест)

| Группа | Что проверяем |
|---|---|
| Загрузка страницы | Заголовок, URL, вкладки навигации |
| Форма поиска | Видимость полей, код аэропорта по умолчанию, поле даты |
| Кнопка «Найти» | Заблокирована без маршрута, активна после выбора |
| Популярные направления | Отображение городов, клик → редирект на результаты |
| Параметры URL | `from=MOW`, `to=TBS`, `class=e` после выбора направления |
| Dropdown пассажиров | Классы перелёта, категории пассажиров, переключение класса |

#### `tests/e2e/avia-results.spec.ts` — результаты поиска (23 теста)

| Группа | Что проверяем |
|---|---|
| URL и параметры | `from`, `to`, `adults`, `class`, `roundtrip` |
| Загрузка результатов | Хотя бы один рейс найден, заголовок маршрута |
| Карточка рейса | Авиакомпания, время вылета/прилёта, цена в USDT, кнопка «Выбрать», длительность |
| Фильтры | «С багажом», «Прямые», «Дневные», «Ночные» — видимость и кликабельность |
| Полный E2E | Форма → клик на направление → результаты |

### Быстрый запуск тестов alfabit.org

```bash
# Форма поиска
npx playwright test tests/e2e/avia-search.spec.ts --project=chromium

# Результаты поиска
npx playwright test tests/e2e/avia-results.spec.ts --project=chromium

# Все тесты с видимым браузером
npx playwright test tests/e2e/avia-search.spec.ts tests/e2e/avia-results.spec.ts --headed --project=chromium
```

### Тестовые данные

Данные для тестов хранятся в `test-data/avia-search.json`:
- Маршруты: MOW→TBS (Москва–Тбилиси), MOW→BAK (Москва–Баку)
- Списки популярных направлений и классов перелётов
- URL паттерны для проверки

### Page Object Models

| Файл | Описание |
|---|---|
| `pages/AviaSearchPage.ts` | Форма поиска: поля, автокомплит, пассажиры, кнопка «Найти» |
| `pages/AviaResultsPage.ts` | Результаты: карточки рейсов, фильтры, данные о рейсе |

---

## 🔍 Как устроен тест

Разберём анатомию тестового файла по шагам:

```typescript
// 📦 ИМПОРТЫ — подключаем нужные инструменты
import { test, expect } from '../fixtures/base.fixtures';
//       ^^^^   ^^^^^^
//       test   — функция для создания теста
//       expect — функция для проверки результата

// 📂 ГРУППА ТЕСТОВ — объединяет связанные тесты
test.describe('Вход в личный кабинет', () => {

  // 🔄 ХУКИ — код, который запускается автоматически
  test.beforeEach(async ({ page }) => {
    // Этот код выполняется ПЕРЕД КАЖДЫМ тестом в группе
    await page.goto('/login'); // открываем страницу входа
  });

  // ✅ ОДИН ТЕСТ
  test('успешный вход с верными данными', async ({ page }) => {
    //                                    ^^^^^^^^^^^^^^^^^^^^
    //              { page } — это вкладка браузера. Всё взаимодействие через неё.

    // ДЕЙСТВИЕ: вводим данные
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Пароль').fill('password123');
    await page.getByRole('button', { name: 'Войти' }).click();

    // ПРОВЕРКА: убеждаемся что вошли
    await expect(page).toHaveURL('/dashboard');
    //     ^^^^^^ — если это условие НЕ выполнится, тест упадёт с ошибкой
  });

});
```

### Что означает `async` / `await`?

Работа с браузером занимает время. `async`/`await` говорит программе: «подожди, пока это действие завершится, и только потом иди дальше».

```typescript
// ❌ Без await — код не ждёт загрузки страницы
page.goto('/login');
page.click('button'); // ошибка! страница ещё не загрузилась

// ✅ С await — код ждёт каждый шаг
await page.goto('/login');  // ждём загрузки
await page.click('button'); // только потом кликаем
```

---

## ✍️ Написание первого теста

### Задача: написать тест «сайт открывается и показывает правильный заголовок»

#### Шаг 1: Создайте файл `tests/e2e/homepage.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Главная страница', () => {

  test('сайт открывается', async ({ page }) => {
    // Открываем сайт (BASE_URL берётся из .env)
    await page.goto('/');

    // Проверяем заголовок вкладки
    await expect(page).toHaveTitle(/Мой Сайт/);
  });

  test('кнопка «Войти» видна', async ({ page }) => {
    await page.goto('/');

    // Ищем кнопку по тексту
    const loginButton = page.getByRole('button', { name: 'Войти' });

    // Проверяем, что она видна
    await expect(loginButton).toBeVisible();
  });

});
```

#### Шаг 2: Запустите тест

```bash
npx playwright test tests/e2e/homepage.spec.ts --headed
```

Флаг `--headed` открывает видимый браузер — можно наблюдать за выполнением.

#### Шаг 3: Посмотрите отчёт

```bash
npm run test:report
```

---

## 📐 Паттерн Page Object Model

Когда тестов становится много, код начинает повторяться. Паттерн **Page Object Model (POM)** решает эту проблему.

### Суть

Каждая **страница** приложения описывается в отдельном классе в папке `pages/`.
Тесты **используют** эти классы, а не работают напрямую с локаторами.

### Сравнение подходов

```typescript
// ❌ БЕЗ POM — локаторы разбросаны по тестам
test('вход', async ({ page }) => {
  await page.locator('#email').fill('test@test.com');     // дублируется
  await page.locator('#password').fill('pass');           // дублируется
  await page.locator('[data-testid="login-btn"]').click();// дублируется
});

test('другой тест с логином', async ({ page }) => {
  await page.locator('#email').fill('admin@test.com');    // дублируется!
  await page.locator('#password').fill('admin');          // дублируется!
  await page.locator('[data-testid="login-btn"]').click();// дублируется!
});
```

```typescript
// ✅ С POM — чисто и без повторов
// pages/LoginPage.ts описывает страницу один раз
// В тестах просто вызываем метод:

test('вход', async ({ loginPage }) => {
  await loginPage.login('test@test.com', 'pass'); // коротко и понятно
});

test('другой тест с логином', async ({ loginPage }) => {
  await loginPage.login('admin@test.com', 'admin'); // один метод, нет повторов
});
```

### Как создать Page Object для новой страницы

1. Создайте файл `pages/МояСтраница.ts`:

```typescript
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class МояСтраница extends BasePage {
  // Локаторы элементов
  private readonly заголовок: Locator;
  private readonly кнопка: Locator;

  constructor(page: Page) {
    super(page);
    // getByRole — лучший способ найти элемент (доступность + устойчивость)
    this.заголовок = page.getByRole('heading', { level: 1 });
    this.кнопка = page.getByRole('button', { name: 'Отправить' });
  }

  // Методы — действия на странице
  async goto(): Promise<void> {
    await this.navigate('/мой-путь');
  }

  async нажатьКнопку(): Promise<void> {
    await this.кнопка.click();
  }

  async проверитьЗаголовок(текст: string): Promise<void> {
    await expect(this.заголовок).toHaveText(текст);
  }
}
```

2. Добавьте экспорт в `pages/index.ts`:

```typescript
export { МояСтраница } from './МояСтраница';
```

3. Используйте в тесте:

```typescript
import { МояСтраница } from '../../pages';

test('проверка заголовка', async ({ page }) => {
  const myPage = new МояСтраница(page);
  await myPage.goto();
  await myPage.проверитьЗаголовок('Добро пожаловать');
});
```

---

## 🔎 Полезные команды Playwright

### Как найти элемент на странице

```typescript
// По роли (рекомендуется!)
page.getByRole('button', { name: 'Войти' })
page.getByRole('link', { name: 'Регистрация' })
page.getByRole('heading', { name: 'Заголовок' })
page.getByRole('textbox', { name: 'Поиск' })

// По тексту
page.getByText('Добро пожаловать')
page.getByText('Сохранить', { exact: true }) // точное совпадение

// По подписи поля
page.getByLabel('Email')
page.getByLabel('Пароль')

// По атрибуту data-testid (разработчики специально добавляют для тестов)
page.getByTestId('submit-button')

// По placeholder
page.getByPlaceholder('Введите email...')

// По CSS (не рекомендуется, хрупко)
page.locator('.btn-primary')
page.locator('#email')
```

### Действия с элементами

```typescript
await locator.click()                    // клик
await locator.fill('текст')              // ввести текст (очищает поле)
await locator.type('текст')              // печатать посимвольно
await locator.clear()                    // очистить поле
await locator.selectOption('значение')   // выбрать в select
await locator.check()                    // отметить чекбокс
await locator.uncheck()                  // снять отметку чекбокса
await locator.hover()                    // навести мышь
await locator.press('Enter')             // нажать клавишу
await locator.scrollIntoViewIfNeeded()   // прокрутить до элемента
```

### Проверки (`expect`)

```typescript
await expect(locator).toBeVisible()            // элемент виден
await expect(locator).toBeHidden()             // элемент скрыт
await expect(locator).toBeEnabled()            // элемент активен
await expect(locator).toBeDisabled()           // элемент заблокирован
await expect(locator).toHaveText('текст')      // содержит текст
await expect(locator).toContainText('часть')   // содержит часть текста
await expect(locator).toHaveValue('значение')  // поле имеет значение
await expect(locator).toHaveCount(3)           // найдено 3 элемента
await expect(page).toHaveURL('/путь')          // текущий URL
await expect(page).toHaveTitle('заголовок')   // заголовок вкладки
```

### Кодогенератор — пишет тест за вас!

```bash
npm run codegen
```

Откроется браузер. Вы кликаете по сайту — Playwright пишет код.
Это отличный способ быстро создать основу теста.

---

## 🩺 Что делать когда тест упал?

### 1. Читайте сообщение об ошибке

```
Error: Тест "успешный вход" упал
  Строка: await expect(page).toHaveURL('/dashboard');
  Получено: "http://localhost/login"
  Ожидалось: URL содержащий "/dashboard"
```

Ошибка говорит: «мы ожидали попасть на `/dashboard`, но остались на `/login`» — значит вход не произошёл.

### 2. Откройте HTML отчёт

```bash
npm run test:report
```

В отчёте для каждого упавшего теста есть:
- 📸 **Скриншот** — что было на экране в момент ошибки
- 🎥 **Видеозапись** — весь тест от начала до падения
- 🔍 **Trace** — подробная запись каждого действия с DOM-снимками

### 3. Запустите тест в режиме отладки

```bash
npx playwright test tests/e2e/avia-search.spec.ts --debug
```

Откроется браузер с панелью управления — можно идти по шагам и смотреть что происходит.

### 4. Запустите с видимым браузером

```bash
npx playwright test tests/e2e/avia-search.spec.ts --headed --project=chromium
```

---

## 🔄 CI/CD — автозапуск на GitHub

После того как вы опубликуете проект на GitHub, тесты будут запускаться **автоматически** при каждом `git push`.

Настройка уже сделана в `.github/workflows/playwright.yml`.

### Как это выглядит в GitHub

1. Вы делаете `git push`
2. На GitHub во вкладке **Actions** появляется новый запуск
3. Тесты запускаются параллельно в 4 потоках
4. По завершении — в артефактах доступен HTML-отчёт

> Подробнее смотрите README в папке `.github/workflows/`

---

## 🐙 Репозиторий на GitHub

Проект уже опубликован и доступен по адресу:

👉 **[github.com/Aliaksei-Ivankovich/play_tests](https://github.com/Aliaksei-Ivankovich/play_tests)**

### Как отправить изменения

```bash
git add .
git commit -m "описание изменений"
git push
```

После `git push` во вкладке **Actions** автоматически запустится CI-пайплайн.

### Как поделиться проектом

Отправьте коллеге ссылку на репозиторий. Для запуска у него на компьютере:

```bash
git clone https://github.com/Aliaksei-Ivankovich/play_tests.git
cd play_tests
npm install
npx playwright install
cp .env.example .env   # файл .env уже настроен для alfabit.org
npm test
```

### Секреты для CI/CD

Перейдите: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Секрет | Значение |
|---|---|
| `BASE_URL` | `https://alfabit.org` |
| `API_URL` | `https://api.alfabit.org` |

---

## ❓ Частые вопросы

**Q: Браузер не открывается при запуске тестов?**
> По умолчанию тесты запускаются в «невидимом» режиме (headless). Добавьте `--headed` чтобы видеть браузер.

**Q: Тест работает у меня, но падает в CI?**
> Скорее всего проблема с `BASE_URL`. Убедитесь что секрет `BASE_URL` добавлен в настройках GitHub репозитория.

**Q: Как сфокусировать тест, чтобы запускался только он?**
> Добавьте `.only` к тесту: `test.only('мой тест', ...)`. Но не забудьте убрать перед `git push`!

**Q: Как пропустить тест?**
> Добавьте `.skip`: `test.skip('мой тест', ...)`. Тест не запустится, но будет виден в отчёте как пропущенный.

**Q: Как добавить новый браузер?**
> Откройте `playwright.config.ts` и добавьте проект в раздел `projects`. Список доступных устройств: `npx playwright devices`.

**Q: Где хранятся скриншоты и видео упавших тестов?**
> В папке `test-results/`. Она не попадает в git (прописана в `.gitignore`), но доступна в артефактах GitHub Actions после запуска CI.

**Q: Как запустить тест в браузере конкретной версии?**
> Playwright скачивает и использует собственные версии браузеров — это гарантирует стабильность. Изменить версию браузера можно в `playwright.config.ts`.
