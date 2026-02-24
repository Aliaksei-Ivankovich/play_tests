import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config();

/**
 * Конфигурация Playwright
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Директория с тестами
  testDir: './tests',

  // Паттерн для поиска тестовых файлов
  testMatch: '**/*.spec.ts',

  // Максимальное время выполнения одного теста (30 секунд)
  timeout: 30_000,

  // Максимальное время ожидания для expect assertions (5 секунд)
  expect: {
    timeout: 5_000,
  },

  // Запускать тесты параллельно
  fullyParallel: true,

  // Запрещаем добавление .only в CI окружении
  forbidOnly: !!process.env.CI,

  // Количество повторных попыток при падении теста
  retries: process.env.CI ? 2 : 0,

  // Количество параллельных воркеров
  workers: process.env.CI ? 1 : undefined,

  // Репортеры для отчётов
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // Глобальные настройки для всех тестов
  use: {
    // Базовый URL приложения (берётся из переменной окружения)
    baseURL: process.env.BASE_URL || 'https://example.com',

    // Сохранять трассировку при первом повторе упавшего теста
    trace: 'on-first-retry',

    // Делать скриншот при падении теста
    screenshot: 'only-on-failure',

    // Записывать видео при падении теста
    video: 'on-first-retry',

    // Размер окна браузера
    viewport: { width: 1280, height: 720 },

    // Игнорировать ошибки HTTPS
    ignoreHTTPSErrors: true,
  },

  // Директория для сохранения результатов тестов
  outputDir: 'test-results/',

  // Настройки проектов (браузеры)
  projects: [
    // === Десктопные браузеры ===
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // === Мобильные устройства ===
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
