import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages';
import { ApiClient } from '../../utils';

/**
 * Расширенные фикстуры для тестов.
 * Добавляют готовые объекты страниц и API клиент в каждый тест.
 */
type TestFixtures = {
  loginPage: LoginPage;
  apiClient: ApiClient;
};

/**
 * Расширяем базовый test с нашими фикстурами
 */
export const test = base.extend<TestFixtures>({
  // Фикстура для страницы входа
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Фикстура для API клиента
  apiClient: async ({ request }, use) => {
    const apiClient = new ApiClient(request);
    await use(apiClient);
  },
});

export { expect };
