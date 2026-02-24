import { test, expect } from '@playwright/test';

/**
 * Примеры базовых тестов Playwright.
 * Этот файл демонстрирует основные возможности фреймворка.
 */
test.describe('Примеры базовых тестов', () => {
  test('открытие страницы и проверка заголовка', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('проверка наличия элемента на странице', async ({ page }) => {
    await page.goto('https://playwright.dev');

    const getStartedLink = page.getByRole('link', { name: 'Get started' });
    await expect(getStartedLink).toBeVisible();
  });

  test('переход по ссылке', async ({ page }) => {
    await page.goto('https://playwright.dev');

    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
  });

  test('заполнение формы и отправка', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');

    // Пример поиска
    const searchButton = page.getByRole('button', { name: /search/i });
    if (await searchButton.isVisible()) {
      await searchButton.click();
      await page.keyboard.type('assertions');
      await expect(page.getByRole('searchbox')).toHaveValue('assertions');
    }
  });

  test('снимок экрана страницы', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Скриншот сохранится автоматически при падении теста
    // Для явного сохранения используйте:
    // await page.screenshot({ path: 'screenshot.png' });
    await expect(page).toHaveTitle(/Playwright/);
  });
});
