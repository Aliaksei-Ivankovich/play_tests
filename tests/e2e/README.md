# 🔬 tests/e2e — End-to-End тесты

## Что такое E2E тест?

**E2E (End-to-End)** — тест, который проверяет приложение целиком, как это делает живой пользователь:

```
Открыть браузер → перейти на сайт → нажать кнопку → ввести текст → проверить результат
```

Playwright управляет браузером автоматически и делает всё то же самое, что делал бы человек, но гораздо быстрее и без ошибок.

---

## Структура тестового файла

```typescript
import { test, expect } from '../fixtures/base.fixtures';

// test.describe — группа связанных тестов (как папка)
test.describe('Название группы тестов', () => {

  // test.beforeEach — выполняется ПЕРЕД каждым тестом в группе
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // test — один конкретный тест
  test('что именно проверяем', async ({ page }) => {
    // действия...
    // проверка...
    await expect(page).toHaveTitle('Мой сайт');
  });

});
```

---

## Анатомия одного теста

```typescript
test('пользователь видит сообщение приветствия', async ({ page }) => {
  //                                               ^^^^^^^^^^^^
  //                   { page } — это браузерная вкладка, с которой мы работаем

  // 1. ДЕЙСТВИЕ — что делаем
  await page.goto('/dashboard');
  //    ^^^^^ await — обязательно! Каждое действие требует ожидания

  // 2. ПРОВЕРКА — что ожидаем увидеть
  await expect(page.getByText('Добро пожаловать')).toBeVisible();
  //     ^^^^^^ expect — проверяем, что элемент существует и виден
});
```

---

## Файлы в этой папке

| Файл | Описание |
|---|---|
| `example.spec.ts` | Работающие примеры тестов. Хорошая точка старта для изучения |
| `login.spec.ts` | Шаблон тестов аутентификации. Адаптируйте под своё приложение |

---

## Как создать новый тест?

### Шаг 1: Создайте файл

Имя файла должно оканчиваться на `.spec.ts`, например: `registration.spec.ts`

### Шаг 2: Напишите тест

```typescript
import { test, expect } from '../fixtures/base.fixtures';

test.describe('Регистрация нового пользователя', () => {

  test('успешная регистрация с валидными данными', async ({ page }) => {
    // Переходим на страницу регистрации
    await page.goto('/register');

    // Заполняем форму
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Пароль').fill('MyPassword123!');

    // Нажимаем кнопку
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

    // Проверяем результат
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Добро пожаловать!')).toBeVisible();
  });

});
```

### Шаг 3: Запустите только этот тест

```bash
npx playwright test tests/e2e/registration.spec.ts
```

---

## Полезные методы для проверок (`expect`)

| Проверка | Что делает |
|---|---|
| `expect(locator).toBeVisible()` | Элемент виден на странице |
| `expect(locator).toHaveText('текст')` | Элемент содержит текст |
| `expect(locator).toHaveValue('значение')` | Поле ввода имеет значение |
| `expect(locator).toBeEnabled()` | Элемент активен (не заблокирован) |
| `expect(locator).toBeDisabled()` | Элемент заблокирован |
| `expect(page).toHaveURL('/путь')` | Текущий URL содержит путь |
| `expect(page).toHaveTitle('заголовок')` | Заголовок вкладки браузера |

---

## Как найти элемент на странице?

Playwright предлагает несколько способов. Лучший — по роли или тексту (устойчивее всего):

```typescript
// ✅ Рекомендуется
page.getByRole('button', { name: 'Войти' })   // по роли и тексту
page.getByLabel('Email')                        // по подписи поля
page.getByText('Добро пожаловать')              // по видимому тексту
page.getByTestId('submit-btn')                  // по атрибуту data-testid

// ⚠️ Допустимо
page.locator('#email')                          // по ID
page.locator('.btn-primary')                    // по CSS классу (хрупко!)
```

> **Совет:** Используйте `npx playwright codegen` — запустится браузер, и Playwright сам будет писать код по вашим кликам!
