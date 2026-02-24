import { test, expect } from '../fixtures/base.fixtures';
import users from '../../test-data/example.users.json';

/**
 * Пример тестов для страницы входа.
 * Адаптируйте тесты под своё приложение.
 */
test.describe('Аутентификация пользователя', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('страница входа отображается корректно', async ({ loginPage }) => {
    await loginPage.expectPageVisible();
    expect(await loginPage.getTitle()).toBeTruthy();
  });

  test('успешный вход с валидными данными', async ({ loginPage, page }) => {
    await loginPage.login(users.validUser.email, users.validUser.password);

    // После входа должен произойти редирект на главную страницу
    await page.waitForURL('**/dashboard', { timeout: 10_000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('ошибка при входе с неверным паролем', async ({ loginPage }) => {
    await loginPage.login(users.invalidUser.email, users.invalidUser.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
    expect(error.toLowerCase()).toMatch(/неверн|invalid|incorrect/i);
  });

  test('ошибка при входе с пустым email', async ({ loginPage }) => {
    await loginPage.login('', users.validUser.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
  });

  test('ошибка при входе с пустым паролем', async ({ loginPage }) => {
    await loginPage.login(users.validUser.email, '');

    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
  });
});
