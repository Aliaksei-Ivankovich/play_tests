import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model для страницы результатов поиска авиабилетов.
 * URL формат: /ru/travel/avia/search_results?from=MOW&to=TBS&date=...
 *
 * Структура карточки рейса (.full-result):
 * - .time × 2              — время вылета и прилёта
 * - .sppliers.title        — название авиакомпании
 * - .trait                 — бейджи (Самый дешёвый, Самый быстрый)
 * - .flight-param          — параметры (В пути, Пересадок, Багаж)
 *   - .value               — название параметра
 *   - .description         — значение параметра
 * - .price                 — блок с ценой
 *   - .base-price          — основная цена (USDT)
 *   - .upgrade-price       — цена с опцией (Багаж +X)
 * - button "Выбрать"       — кнопка выбора рейса
 */
export class AviaResultsPage extends BasePage {
  // === Контейнер страницы результатов ===
  readonly resultsContainer: Locator;

  // === Фильтры ===
  readonly filterBaggage: Locator;
  readonly filterDirect: Locator;
  readonly filterDaytime: Locator;
  readonly filterNighttime: Locator;

  // === Карточки рейсов ===
  readonly flightCards: Locator;

  // === Заголовок маршрута ===
  readonly routeTitle: Locator;

  // === Форма поиска (сверху страницы результатов) ===
  readonly fromCodeInHeader: Locator;
  readonly toCodeInHeader: Locator;
  readonly searchButtonInHeader: Locator;

  constructor(page: Page) {
    super(page);

    this.resultsContainer = page.locator('.search-results, [class*="SearchResults"], main');
    // Фильтры — кнопки внутри .filter-item
    this.filterBaggage = page.locator('.filter-item').filter({ hasText: /^С багажом$/ }).locator('button').first();
    this.filterDirect = page.locator('.filter-item').filter({ hasText: /^Прямые$/ }).locator('button').first();
    this.filterDaytime = page.locator('.filter-item').filter({ hasText: /^Дневные$/ }).locator('button').first();
    this.filterNighttime = page.locator('.filter-item').filter({ hasText: /^Ночные$/ }).locator('button').first();
    this.flightCards = page.locator('.full-result');
    this.routeTitle = page.locator('.result-short, h1, [class*="route"]');
    this.fromCodeInHeader = page.locator('.shadowed.form-container .container .code').first();
    this.toCodeInHeader = page.locator('.shadowed.form-container .container .code').nth(1);
    this.searchButtonInHeader = page.locator('button.btn-search');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Навигация
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Перейти на страницу результатов напрямую (через URL с параметрами).
   * @param from - Код аэропорта отправления (например "MOW")
   * @param to   - Код аэропорта назначения  (например "TBS")
   * @param date - Дата в формате DD.MM.YYYY (например "25.02.2026")
   */
  async gotoSearch(from: string, to: string, date: string): Promise<void> {
    const url = `/ru/travel/avia/search_results?from=${from}&to=${to}&date=${date}&adults=1&children=0&infants=0&insurance=0&class=e&roundtrip=false`;
    await this.navigate(url);
    await this.waitForResults();
  }

  /** Ждать появления хотя бы одной карточки рейса */
  async waitForResults(): Promise<void> {
    await this.flightCards.first().waitFor({ state: 'visible', timeout: 30_000 });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Получение данных с карточки рейса
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Получить карточку рейса по индексу (0 = первый)
   */
  getFlightCard(index: number = 0): Locator {
    return this.flightCards.nth(index);
  }

  /**
   * Получить название авиакомпании из карточки
   */
  getAirlineName(cardIndex: number = 0): Locator {
    return this.flightCards.nth(cardIndex).locator('.sppliers.title');
  }

  /**
   * Получить время вылета из карточки
   */
  getDepartureTime(cardIndex: number = 0): Locator {
    return this.flightCards.nth(cardIndex).locator('.time').first();
  }

  /**
   * Получить время прилёта из карточки
   */
  getArrivalTime(cardIndex: number = 0): Locator {
    return this.flightCards.nth(cardIndex).locator('.time').last();
  }

  /**
   * Получить блок цены из карточки
   */
  getPrice(cardIndex: number = 0): Locator {
    return this.flightCards.nth(cardIndex).locator('.price');
  }

  /**
   * Получить основную цену (без доплат) из карточки
   */
  getBasePrice(cardIndex: number = 0): Locator {
    return this.flightCards.nth(cardIndex).locator('.base-price');
  }

  /**
   * Получить значение параметра "В пути" (длительность полёта)
   */
  getDuration(cardIndex: number = 0): Locator {
    return this.flightCards.nth(cardIndex)
      .locator('.flight-param', { hasText: 'В пути' })
      .locator('.description');
  }

  /**
   * Получить информацию о пересадках
   */
  getStops(cardIndex: number = 0): Locator {
    return this.flightCards.nth(cardIndex)
      .locator('.flight-param', { hasText: 'Без пересадок' })
      .first();
  }

  /**
   * Получить кнопку «Выбрать» из карточки.
   * На странице это div.сhoose-button (с кириллической «с»!)
   */
  getSelectButton(cardIndex: number = 0): Locator {
    // Примечание: класс 'сhoose-button' содержит кириллическую букву «с»
    return this.flightCards.nth(cardIndex).locator('.stub').filter({ hasText: 'Выбрать' }).first();
  }

  /**
   * Получить бейдж (trait) из карточки — например "Самый дешёвый"
   */
  getTrait(cardIndex: number = 0): Locator {
    return this.flightCards.nth(cardIndex).locator('.trait').first();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Действия
  // ──────────────────────────────────────────────────────────────────────────

  /** Нажать «Выбрать» на карточке по индексу */
  async selectFlight(cardIndex: number = 0): Promise<void> {
    await this.getSelectButton(cardIndex).click();
  }

  /** Применить фильтр «С багажом» */
  async applyBaggageFilter(): Promise<void> {
    await this.filterBaggage.click();
    await this.page.waitForTimeout(1_000);
  }

  /** Применить фильтр «Прямые» */
  async applyDirectFilter(): Promise<void> {
    await this.filterDirect.click();
    await this.page.waitForTimeout(1_000);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Проверки (Assertions)
  // ──────────────────────────────────────────────────────────────────────────

  /** Проверить, что URL соответствует параметрам поиска */
  async expectSearchUrl(from: string, to: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`from=${from}&to=${to}`));
  }

  /** Проверить, что результаты загружены (есть хотя бы 1 карточка) */
  async expectResultsLoaded(): Promise<void> {
    await expect(this.flightCards.first()).toBeVisible();
  }

  /** Проверить, что количество найденных рейсов больше нуля */
  async expectFlightsFound(): Promise<void> {
    const count = await this.flightCards.count();
    expect(count).toBeGreaterThan(0);
  }

  /** Проверить, что карточка содержит имя авиакомпании */
  async expectAirlineNameVisible(cardIndex: number = 0): Promise<void> {
    const airline = this.getAirlineName(cardIndex);
    await expect(airline).toBeVisible();
    const text = await airline.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  }

  /** Проверить, что карточка содержит время вылета и прилёта */
  async expectTimesVisible(cardIndex: number = 0): Promise<void> {
    await expect(this.getDepartureTime(cardIndex)).toBeVisible();
    await expect(this.getArrivalTime(cardIndex)).toBeVisible();
  }

  /** Проверить, что карточка содержит цену */
  async expectPriceVisible(cardIndex: number = 0): Promise<void> {
    await expect(this.getBasePrice(cardIndex)).toBeVisible();
  }

  /** Проверить, что кнопка «Выбрать» в карточке видна и кликабельна */
  async expectSelectButtonVisible(cardIndex: number = 0): Promise<void> {
    const btn = this.getSelectButton(cardIndex);
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  }

  /** Проверить, что в заголовке страницы отображается маршрут Москва — Тбилиси */
  async expectRouteInHeader(from: string, to: string): Promise<void> {
    await expect(this.page.getByText(`${from} - ${to}`, { exact: false })).toBeVisible();
  }

  /** Проверить, что фильтры поиска отображаются */
  async expectFiltersVisible(): Promise<void> {
    await expect(this.filterBaggage).toBeVisible();
    await expect(this.filterDirect).toBeVisible();
  }

  /** Получить количество карточек рейсов */
  async getFlightCount(): Promise<number> {
    return this.flightCards.count();
  }
}
