# 📄 pages — Page Object Models (POM)

## Что это такое?

Эта папка содержит **Page Object Models** (сокращённо **POM**) — специальные классы, которые описывают страницы вашего веб-приложения.

---

## Зачем это нужно?

Представьте, что у вас есть кнопка «Войти» и 10 разных тестов, которые на неё нажимают.
Если разработчики изменят кнопку (например, поменяют текст с «Войти» на «Sign In»), вам придётся исправить **все 10 тестов**.

С паттерном POM вы описываете кнопку **один раз** в этой папке — и исправляете тоже **только в одном месте**.

```
Без POM:                          С POM:
─────────────────────────────     ─────────────────────────────
test1.spec.ts → кнопка «Войти»   test1.spec.ts ─┐
test2.spec.ts → кнопка «Войти»   test2.spec.ts  ├─→ LoginPage → кнопка «Войти»
test3.spec.ts → кнопка «Войти»   test3.spec.ts ─┘
```

---

## Структура папки

```
pages/
├── BasePage.ts     # Родительский класс — общие методы для ВСЕХ страниц
├── LoginPage.ts    # Страница входа (пример)
└── index.ts        # Файл-экспортёр (просто собирает всё в одном месте)
```

---

## Как устроен файл страницы?

Каждый файл в этой папке описывает **одну страницу** приложения и содержит:

1. **Локаторы** — «адреса» элементов на странице (кнопки, поля, ссылки)
2. **Методы** — действия, которые можно выполнить на этой странице

### Пример

```typescript
export class LoginPage extends BasePage {
  // 1. Локаторы — ЧТО находим на странице
  private readonly emailInput = page.getByTestId('email-input');
  private readonly loginButton = page.getByRole('button', { name: 'Войти' });

  // 2. Методы — ЧТО делаем на странице
  async login(email: string, password: string) {
    await this.emailInput.fill(email);     // вводим email
    await this.loginButton.click();        // нажимаем кнопку
  }
}
```

---

## Как добавить новую страницу?

1. Создайте файл `МояСтраница.ts` в этой папке
2. Унаследуйте класс от `BasePage`
3. Добавьте локаторы и методы
4. Зарегистрируйте экспорт в `index.ts`

### Шаблон новой страницы

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class МояСтраница extends BasePage {
  private readonly заголовок: Locator;

  constructor(page: Page) {
    super(page);
    this.заголовок = page.getByRole('heading', { level: 1 });
  }

  async goto(): Promise<void> {
    await this.navigate('/мой-путь');
  }
}
```

---

## BasePage — что в нём есть?

`BasePage.ts` — это родитель для всех страниц. В нём собраны методы, которые нужны везде:

| Метод | Что делает |
|---|---|
| `navigate(path)` | Переходит по указанному пути |
| `getTitle()` | Возвращает заголовок вкладки браузера |
| `getCurrentUrl()` | Возвращает текущий URL |
| `waitForPageLoad()` | Ждёт полной загрузки страницы |
| `takeScreenshot(name)` | Делает скриншот и сохраняет в файл |
| `scrollToElement(locator)` | Прокручивает страницу до элемента |
