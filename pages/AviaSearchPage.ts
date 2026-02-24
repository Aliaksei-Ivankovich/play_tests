import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model для страницы поиска авиабилетов.
 * Сайт: https://alfabit.org/ru/travel/avia
 *
 * Структура формы:
 * - Поле «Откуда» (input[placeholder="Откуда"]) — город вылета
 * - Поле «Куда»   (input[placeholder="Куда"])   — город прилёта
 * - Поле «Когда»  (input[placeholder="Когда"])  — дата вылета
 * - Блок «Пассажиры» (.passengers-trip)         — кол-во пасс. и класс
 * - Кнопка «Найти» (button.btn-search)          — запуск поиска
 */
export class AviaSearchPage extends BasePage {
  // === Локаторы формы поиска ===
  readonly formContainer: Locator;
  readonly fromInput: Locator;
  readonly toInput: Locator;
  readonly dateInput: Locator;
  readonly dateDisplay: Locator;
  readonly passengersBlock: Locator;
  readonly passengersInput: Locator;
  readonly searchButton: Locator;
  readonly fromCode: Locator;

  // === Автокомплит ===
  readonly autocompleteList: Locator;
  readonly autocompleteFirstItem: Locator;

  // === Dropdown пассажиров ===
  readonly passengersDropdown: Locator;
  readonly tripClassItems: Locator;
  readonly passengerCategories: Locator;

  // === Популярные направления ===
  readonly popularDestinations: Locator;

  // === Навигационные вкладки ===
  readonly aviaBiletsTab: Locator;

  constructor(page: Page) {
    super(page);

    // Форма
    this.formContainer = page.locator('.shadowed.form-container');
    this.fromInput = page.locator('.location-input input[placeholder="Откуда"]');
    this.toInput = page.locator('.location-input input[placeholder="Куда"]');
    this.dateInput = page.locator('input[placeholder="Когда"]');
    this.dateDisplay = page.locator('.date-input .dates');
    this.passengersBlock = page.locator('.passengers-trip');
    this.passengersInput = page.locator('.passengers-input');
    this.searchButton = page.locator('button.btn-search');
    this.fromCode = page.locator('.shadowed.form-container .container .code').first();

    // Автокомплит (появляется при вводе в поле)
    this.autocompleteList = page.locator('ul.list');
    this.autocompleteFirstItem = page.locator('ul.list li').first();

    // Dropdown пассажиров
    this.passengersDropdown = page.locator('.passengers-trip .dropdown');
    this.tripClassItems = page.locator('.trip-classes-list .item');
    this.passengerCategories = page.locator('.passenger-categories');

    // Популярные направления
    this.popularDestinations = page.locator('.popular-destinations__item, [class*="popular"]');

    // Навигация — вкладка с exact-текстом (без 🔥 из header-меню)
    this.aviaBiletsTab = page.locator('.product-name', { hasText: 'Авиабилеты' }).first();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Навигация
  // ──────────────────────────────────────────────────────────────────────────

  /** Перейти на страницу поиска авиабилетов */
  async goto(): Promise<void> {
    await this.navigate('/ru/travel/avia');
    await this.waitForSearchForm();
  }

  /** Дождаться загрузки формы поиска */
  async waitForSearchForm(): Promise<void> {
    await this.formContainer.waitFor({ state: 'visible', timeout: 15_000 });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Заполнение формы — Откуда
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Ввести город отправления и выбрать первый вариант из автокомплита.
   * @param cityName - Название города или кода аэропорта (например "Москва")
   */
  async fillOrigin(cityName: string): Promise<void> {
    await this.fromInput.click();
    await this.fromInput.selectText();
    await this.fromInput.fill('');
    await this.fromInput.pressSequentially(cityName, { delay: 120 });
    await this.autocompleteList.waitFor({ state: 'visible', timeout: 8_000 });
  }

  /**
   * Выбрать первый город из автокомплита поля «Откуда»
   */
  async selectFirstOriginSuggestion(): Promise<void> {
    await this.autocompleteFirstItem.click();
    await this.autocompleteList.waitFor({ state: 'hidden', timeout: 5_000 });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Заполнение формы — Куда
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Ввести город назначения и выбрать первый вариант из автокомплита.
   * @param cityName - Название города (например "Тбилиси")
   */
  async fillDestination(cityName: string): Promise<void> {
    await this.toInput.click();
    await this.toInput.pressSequentially(cityName, { delay: 120 });
    await this.autocompleteList.waitFor({ state: 'visible', timeout: 8_000 });
  }

  /**
   * Выбрать первый город из автокомплита поля «Куда»
   */
  async selectFirstDestinationSuggestion(): Promise<void> {
    await this.autocompleteFirstItem.click();
    await this.autocompleteList.waitFor({ state: 'hidden', timeout: 5_000 });
  }

  /**
   * Выбрать конкретный город из автокомплита по тексту
   */
  async selectCityFromAutocomplete(cityName: string): Promise<void> {
    await this.page.locator('ul.list li', { hasText: cityName }).first().click();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Популярные направления
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Кликнуть на популярное направление по названию города.
   * Это автоматически заполняет форму (Откуда = MOW, Куда = код города)
   * и перенаправляет на страницу результатов.
   * @param cityName - Видимое название города ("Тбилиси", "Баку", "Дубай" и т.д.)
   */
  async clickPopularDestination(cityName: string): Promise<void> {
    await this.page.getByText(cityName).first().click();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Пассажиры и класс
  // ──────────────────────────────────────────────────────────────────────────

  /** Открыть dropdown выбора пассажиров и класса */
  async openPassengersDropdown(): Promise<void> {
    await this.passengersBlock.click();
    await this.passengersDropdown.waitFor({ state: 'visible', timeout: 5_000 });
  }

  /**
   * Выбрать класс перелёта.
   * @param tripClass - Один из: 'Эконом' | 'Комфорт' | 'Бизнес' | 'Первый'
   */
  async selectTripClass(tripClass: 'Эконом' | 'Комфорт' | 'Бизнес' | 'Первый'): Promise<void> {
    await this.openPassengersDropdown();
    await this.page.locator('.trip-classes-list .item', { hasText: tripClass }).click();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Поиск
  // ──────────────────────────────────────────────────────────────────────────

  /** Нажать кнопку «Найти» */
  async clickSearch(): Promise<void> {
    await this.searchButton.click();
    await this.page.waitForURL('**/search_results**', { timeout: 15_000 });
  }

  /** Проверить, что кнопка «Найти» активна (не заблокирована) */
  async isSearchEnabled(): Promise<boolean> {
    return !(await this.searchButton.isDisabled());
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Проверки (Assertions)
  // ──────────────────────────────────────────────────────────────────────────

  /** Проверить, что заголовок страницы содержит ожидаемый текст */
  async expectPageTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(/Alfabit Travel/i);
  }

  /** Проверить, что все элементы формы поиска отображаются */
  async expectFormVisible(): Promise<void> {
    await expect(this.formContainer).toBeVisible();
    await expect(this.fromInput).toBeVisible();
    await expect(this.toInput).toBeVisible();
    await expect(this.dateDisplay).toBeVisible();
    await expect(this.passengersInput).toBeVisible();
    await expect(this.searchButton).toBeVisible();
  }

  /** Проверить, что кнопка «Найти» заблокирована (destination не заполнен) */
  async expectSearchDisabled(): Promise<void> {
    await expect(this.searchButton).toBeDisabled();
  }

  /** Проверить, что кнопка «Найти» активна */
  async expectSearchEnabled(): Promise<void> {
    await expect(this.searchButton).toBeEnabled();
  }

  /** Проверить, что популярные направления отображаются */
  async expectPopularDestinationsVisible(): Promise<void> {
    await expect(this.page.getByText('Популярные направления')).toBeVisible();
  }

  /** Проверить, что вкладки навигации (Авиабилеты, Отели и т.д.) видны */
  async expectNavigationTabsVisible(): Promise<void> {
    await expect(this.aviaBiletsTab).toBeVisible();
    await expect(this.page.locator('.product-name', { hasText: 'Отели' }).first()).toBeVisible();
  }

  /** Проверить, что dropdown пассажиров открыт */
  async expectPassengersDropdownOpen(): Promise<void> {
    await expect(this.passengersDropdown).toBeVisible();
    await expect(this.tripClassItems.first()).toBeVisible();
  }

  /** Проверить, что код аэропорта вылета отображается */
  async expectFromCodeVisible(): Promise<void> {
    await expect(this.fromCode).toBeVisible();
  }
}
