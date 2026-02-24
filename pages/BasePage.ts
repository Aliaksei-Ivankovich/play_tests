import { Page, Locator } from '@playwright/test';

/**
 * Базовый класс для всех Page Object Models.
 * Содержит общие методы навигации и взаимодействия со страницей.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Перейти на указанный URL
   */
  async navigate(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Получить заголовок страницы
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Получить текущий URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Ждать загрузки страницы
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Сделать скриншот страницы
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }

  /**
   * Прокрутить к элементу
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }
}
