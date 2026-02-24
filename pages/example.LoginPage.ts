import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model для страницы входа.
 * Пример реализации - адаптируйте локаторы под ваше приложение.
 */
export class LoginPage extends BasePage {
  // Локаторы элементов страницы
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginButton = page.getByRole('button', { name: /войти|sign in|login/i });
    this.errorMessage = page.getByTestId('error-message');
    this.forgotPasswordLink = page.getByRole('link', { name: /забыли пароль|forgot password/i });
  }

  /**
   * Перейти на страницу входа
   */
  async goto(): Promise<void> {
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  /**
   * Выполнить вход с указанными учётными данными
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Получить текст сообщения об ошибке
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return this.errorMessage.textContent() ?? '';
  }

  /**
   * Проверить, что страница входа отображается
   */
  async expectPageVisible(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Перейти на страницу восстановления пароля
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }
}
