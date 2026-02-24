# 🛠 utils — Вспомогательные утилиты

## Что здесь хранится?

Папка `utils` содержит **вспомогательные функции** и **инструменты**, которые используются в тестах, но не являются самими тестами.

---

## Когда сюда что-то добавлять?

Если вы видите, что один и тот же кусок кода встречается в нескольких тестах — вынесите его сюда.

```
Правило: УВИДЕЛ ПОВТОР → ВЫНЕСИ В utils/
```

---

## Файлы в этой папке

### 📄 `helpers.ts` — общие вспомогательные функции

Набор мелких полезных функций для повседневных задач в тестах.

| Функция | Что делает | Пример |
|---|---|---|
| `randomString(length)` | Генерирует случайную строку | `randomString(8)` → `"x7k2mq9a"` |
| `randomEmail(domain)` | Генерирует уникальный email | `randomEmail()` → `"test_abc123@test.com"` |
| `sleep(ms)` | Ждёт указанное время в мс | `await sleep(2000)` — ждёт 2 секунды |
| `formatDate(date)` | Форматирует дату в `YYYY-MM-DD` | `formatDate()` → `"2026-02-24"` |
| `getLocalStorage(page, key)` | Читает значение из localStorage | `await getLocalStorage(page, 'token')` |
| `setLocalStorage(page, key, value)` | Записывает значение в localStorage | `await setLocalStorage(page, 'lang', 'ru')` |
| `setAuthCookie(page, token)` | Устанавливает cookie авторизации | `await setAuthCookie(page, 'abc123')` |

**Пример использования в тесте:**
```typescript
import { randomEmail, sleep } from '../../utils';

test('регистрация нового пользователя', async ({ page }) => {
  const email = randomEmail();  // каждый раз уникальный email
  await page.getByLabel('Email').fill(email);
  // ...
  await sleep(500); // небольшая пауза если нужна
});
```

---

### 📄 `api.ts` — API клиент

Класс `ApiClient` позволяет делать HTTP-запросы к бэкенду прямо из тестов.

**Зачем?** Иногда перед тестом нужно создать данные через API (быстрее, чем через UI), а после теста — удалить их.

```typescript
import { ApiClient } from '../../utils';

test('проверка данных профиля', async ({ apiClient, page }) => {
  // Создаём пользователя через API (быстро, без UI)
  const response = await apiClient.post('/api/users', {
    name: 'Тест Тестов',
    email: 'test@example.com'
  });
  const user = await response.json();

  // Теперь тестируем UI с этим пользователем
  await page.goto(`/users/${user.id}`);
  await expect(page.getByText('Тест Тестов')).toBeVisible();
});
```

**Доступные методы:**

| Метод | HTTP | Описание |
|---|---|---|
| `get(endpoint)` | GET | Получить данные |
| `post(endpoint, data)` | POST | Создать данные |
| `put(endpoint, data)` | PUT | Обновить данные |
| `delete(endpoint)` | DELETE | Удалить данные |
| `setToken(token)` | — | Установить токен авторизации |

---

### 📄 `index.ts` — точка входа

Этот файл просто **собирает и реэкспортирует** всё из папки.
Благодаря ему в тестах можно писать короткий импорт:

```typescript
// Вместо этого:
import { randomEmail } from '../../utils/helpers';
import { ApiClient } from '../../utils/api';

// Можно писать так:
import { randomEmail, ApiClient } from '../../utils';
```

---

## Как добавить новую утилиту?

1. Создайте функцию в подходящем файле (или создайте новый `.ts` файл)
2. Добавьте экспорт в `index.ts`

```typescript
// utils/index.ts
export * from './helpers';
export { ApiClient } from './api';
export * from './моя-новая-утилита';  // ← добавляем
```
