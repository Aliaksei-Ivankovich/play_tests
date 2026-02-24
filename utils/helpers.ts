import { Page } from '@playwright/test';

/**
 * Вспомогательные утилиты для тестов
 */

/**
 * Генерирует случайную строку заданной длины
 */
export function randomString(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/**
 * Генерирует случайный email
 */
export function randomEmail(domain: string = 'test.com'): string {
  return `test_${randomString(6)}_${Date.now()}@${domain}`;
}

/**
 * Ждёт заданное количество миллисекунд
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Форматирует дату в строку формата YYYY-MM-DD
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Читает значение localStorage
 */
export async function getLocalStorage(page: Page, key: string): Promise<string | null> {
  return page.evaluate((k) => localStorage.getItem(k), key);
}

/**
 * Устанавливает значение в localStorage
 */
export async function setLocalStorage(page: Page, key: string, value: string): Promise<void> {
  await page.evaluate(([k, v]) => localStorage.setItem(k, v), [key, value]);
}

/**
 * Устанавливает cookies для обхода аутентификации в тестах
 */
export async function setAuthCookie(page: Page, token: string): Promise<void> {
  await page.context().addCookies([
    {
      name: 'auth_token',
      value: token,
      domain: new URL(process.env.BASE_URL || 'https://example.com').hostname,
      path: '/',
    },
  ]);
}
