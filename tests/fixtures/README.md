# 🔧 tests/fixtures — Фикстуры (заготовки для тестов)

## Что такое фикстура?

**Фикстура** — это готовый «инструмент» или «среда», которая автоматически создаётся перед тестом и автоматически убирается после него.

### Аналогия из жизни

Представьте повара на кухне:
- Фикстура — это уже **очищенные и нарезанные овощи**, которые лежат в тарелочках перед началом готовки
- Без фикстур повару нужно каждый раз самому мыть, чистить и нарезать всё с нуля

В тестировании это то же самое: фикстура даёт тесту уже готовые объекты (открытые страницы, подключённый API-клиент и т.д.)

---

## Почему не писать всё прямо в тестах?

```typescript
// ❌ БЕЗ фикстур — копипаст в каждом тесте
test('тест 1', async ({ page, request }) => {
  const loginPage = new LoginPage(page);   // ← повтор
  const api = new ApiClient(request);       // ← повтор
  // ... тест
});

test('тест 2', async ({ page, request }) => {
  const loginPage = new LoginPage(page);   // ← повтор
  const api = new ApiClient(request);       // ← повтор
  // ... тест
});
```

```typescript
// ✅ С фикстурами — чисто и без повторов
test('тест 1', async ({ loginPage, apiClient }) => {
  // loginPage и apiClient готовы автоматически!
});

test('тест 2', async ({ loginPage, apiClient }) => {
  // Так же! Никакого копипаста
});
```

---

## Файлы в этой папке

| Файл | Описание |
|---|---|
| `base.fixtures.ts` | Базовые фикстуры: `loginPage`, `apiClient` |

---

## Как работает `base.fixtures.ts`?

```typescript
// Вместо обычного import { test } from '@playwright/test'
// мы используем РАСШИРЕННЫЙ test с нашими фикстурами:
import { test, expect } from '../fixtures/base.fixtures';

// Теперь в тесте доступны:
// { page }       — стандартная вкладка браузера (от Playwright)
// { loginPage }  — наша фикстура: готовый объект LoginPage
// { apiClient }  — наша фикстура: готовый API-клиент
```

---

## Как добавить новую фикстуру?

Откройте `base.fixtures.ts` и добавьте вашу фикстуру:

```typescript
// 1. Объявите тип
type TestFixtures = {
  loginPage: LoginPage;
  apiClient: ApiClient;
  myNewPage: MyNewPage;  // ← добавляем
};

// 2. Реализуйте фикстуру
export const test = base.extend<TestFixtures>({
  // ... существующие фикстуры ...

  // Новая фикстура
  myNewPage: async ({ page }, use) => {
    const myPage = new MyNewPage(page);
    await myPage.goto();    // можно подготовить состояние
    await use(myPage);      // передаём в тест
    // здесь можно добавить очистку после теста
  },
});
```

---

## Зачем `await use(...)` ?

Это ключевой момент работы фикстур:

```
Код ДО use(...)   →   выполняется ПЕРЕД тестом (setup / подготовка)
      use(...)    →   запускается сам тест
Код ПОСЛЕ use()   →   выполняется ПОСЛЕ теста (teardown / уборка)
```

```typescript
myFixture: async ({ page }, use) => {
  console.log('1. Подготовка перед тестом');
  const obj = new MyPage(page);

  await use(obj);  // ← здесь выполняется тест

  console.log('3. Уборка после теста');
  // например: удалить тестового пользователя из БД
},
```
