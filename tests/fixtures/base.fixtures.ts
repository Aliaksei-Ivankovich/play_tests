import { test as base, expect } from '@playwright/test';
import { LoginPage, AviaSearchPage, AviaResultsPage } from '../../pages';
import { ApiClient } from '../../utils';

/**
 * Расширенные фикстуры для тестов.
 * Добавляют готовые объекты страниц и API клиент в каждый тест.
 */
type TestFixtures = {
  loginPage: LoginPage;
  aviaSearchPage: AviaSearchPage;
  aviaResultsPage: AviaResultsPage;
  apiClient: ApiClient;
};

/**
 * Расширяем базовый test с нашими фикстурами
 */
export const test = base.extend<TestFixtures>({
  // Фикстура для страницы входа (пример)
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Фикстура для страницы поиска авиабилетов
  aviaSearchPage: async ({ page }, use) => {
    const aviaSearchPage = new AviaSearchPage(page);
    await use(aviaSearchPage);
  },

  // Фикстура для страницы результатов поиска
  aviaResultsPage: async ({ page }, use) => {
    const aviaResultsPage = new AviaResultsPage(page);
    await use(aviaResultsPage);
  },

  // Фикстура для API клиента
  apiClient: async ({ request }, use) => {
    const apiClient = new ApiClient(request);
    await use(apiClient);
  },
});

export { expect };
