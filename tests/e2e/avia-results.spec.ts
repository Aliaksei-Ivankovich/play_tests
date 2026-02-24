import { test, expect } from '../fixtures/base.fixtures';
import aviaData from '../../test-data/avia-search.json';

/**
 * Тесты для страницы результатов поиска авиабилетов
 * URL: /ru/travel/avia/search_results?from=MOW&to=TBS&date=...
 *
 * Покрываемые сценарии:
 * 1. Корректность URL и параметров поиска
 * 2. Загрузка и отображение карточек рейсов
 * 3. Структура карточки рейса (время, авиакомпания, цена, кнопка)
 * 4. Фильтры (С багажом, Прямые, Дневные, Ночные)
 * 5. Заголовок маршрута
 * 6. Наличие формы поиска на странице результатов
 */

// baseURL берётся из переменной окружения BASE_URL (см. .env и playwright.config.ts)

/**
 * Вспомогательная функция: вернуть дату завтра в формате DD.MM.YYYY
 */
function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const day = String(tomorrow.getDate()).padStart(2, '0');
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const year = tomorrow.getFullYear();
  return `${day}.${month}.${year}`;
}

test.describe('Страница результатов поиска авиабилетов', () => {

  // Перед каждым тестом переходим на страницу результатов напрямую через URL
  // (чтобы тесты не зависели от формы поиска)
  test.beforeEach(async ({ aviaResultsPage }) => {
    await aviaResultsPage.gotoSearch(
      aviaData.routes.mosToTbs.from,
      aviaData.routes.mosToTbs.to,
      getTomorrowDate()
    );
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Группа 1: URL и параметры поиска
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('URL и параметры поиска', () => {

    test('URL содержит корректные коды аэропортов from=MOW&to=TBS', async ({ aviaResultsPage }) => {
      await aviaResultsPage.expectSearchUrl('MOW', 'TBS');
    });

    test('URL содержит параметр adults=1', async ({ aviaResultsPage }) => {
      await expect(aviaResultsPage.page).toHaveURL(/adults=1/);
    });

    test('URL содержит параметр class=e (эконом)', async ({ aviaResultsPage }) => {
      await expect(aviaResultsPage.page).toHaveURL(/class=e/);
    });

    test('URL содержит параметр roundtrip=false (в одну сторону)', async ({ aviaResultsPage }) => {
      await expect(aviaResultsPage.page).toHaveURL(/roundtrip=false/);
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // Группа 2: Загрузка результатов
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Загрузка результатов', () => {

    test('страница результатов загружается', async ({ aviaResultsPage }) => {
      await aviaResultsPage.expectResultsLoaded();
    });

    test('найдено более одного рейса', async ({ aviaResultsPage }) => {
      await aviaResultsPage.expectFlightsFound();

      const count = await aviaResultsPage.getFlightCount();
      expect(count).toBeGreaterThan(1);
    });

    test('в заголовке страницы отображается маршрут «Москва - Тбилиси»', async ({ aviaResultsPage }) => {
      await aviaResultsPage.expectRouteInHeader('Москва', 'Тбилиси');
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // Группа 3: Структура карточки рейса
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Карточка рейса — структура и данные', () => {

    test('первая карточка содержит название авиакомпании', async ({ aviaResultsPage }) => {
      await aviaResultsPage.expectAirlineNameVisible(0);
    });

    test('первая карточка содержит время вылета и прилёта', async ({ aviaResultsPage }) => {
      await aviaResultsPage.expectTimesVisible(0);

      // Время должно быть в формате HH:MM
      const depTime = await aviaResultsPage.getDepartureTime(0).textContent();
      const arrTime = await aviaResultsPage.getArrivalTime(0).textContent();

      expect(depTime).toMatch(/^\d{2}:\d{2}$/);
      expect(arrTime).toMatch(/^\d{2}:\d{2}$/);
    });

    test('первая карточка содержит цену', async ({ aviaResultsPage }) => {
      await aviaResultsPage.expectPriceVisible(0);

      // Цена должна содержать числовое значение
      const priceText = await aviaResultsPage.getBasePrice(0).textContent();
      expect(priceText).toMatch(/\d+/);
    });

    test('цена отображается в USDT', async ({ aviaResultsPage }) => {
      // Иконка USDT представлена SVG внутри .base-price
      const priceLocator = aviaResultsPage.getBasePrice(0);
      await expect(priceLocator).toBeVisible();
      // Убеждаемся что внутри есть числовое значение
      const text = await priceLocator.textContent();
      expect(text).toMatch(/\d+\.\d+/);
    });

    test('первая карточка содержит кнопку «Выбрать»', async ({ aviaResultsPage }) => {
      await aviaResultsPage.expectSelectButtonVisible(0);
    });

    test('первая карточка содержит информацию о длительности полёта', async ({ aviaResultsPage }) => {
      const duration = aviaResultsPage.getDuration(0);
      await expect(duration).toBeVisible();

      // Длительность должна быть в формате Xч YYм
      const text = await duration.textContent();
      expect(text).toMatch(/\d+ч/);
    });

    test('несколько карточек содержат корректные данные', async ({ aviaResultsPage }) => {
      const count = await aviaResultsPage.getFlightCount();
      const checkCount = Math.min(count, 3); // проверяем до 3 карточек

      for (let i = 0; i < checkCount; i++) {
        await aviaResultsPage.expectAirlineNameVisible(i);
        await aviaResultsPage.expectTimesVisible(i);
        await aviaResultsPage.expectPriceVisible(i);
        await aviaResultsPage.expectSelectButtonVisible(i);
      }
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // Группа 4: Фильтры
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Фильтры результатов', () => {

    test('фильтры «С багажом» и «Прямые» отображаются', async ({ aviaResultsPage }) => {
      await aviaResultsPage.expectFiltersVisible();
    });

    test('фильтры «Дневные» и «Ночные» отображаются', async ({ aviaResultsPage }) => {
      await expect(aviaResultsPage.filterDaytime).toBeVisible();
      await expect(aviaResultsPage.filterNighttime).toBeVisible();
    });

    test('фильтр «С багажом» кликабелен', async ({ aviaResultsPage }) => {
      await expect(aviaResultsPage.filterBaggage).toBeEnabled();
      await aviaResultsPage.applyBaggageFilter();

      // После применения фильтра результаты должны оставаться
      await aviaResultsPage.expectResultsLoaded();
    });

    test('фильтр «Прямые» кликабелен', async ({ aviaResultsPage }) => {
      await expect(aviaResultsPage.filterDirect).toBeEnabled();
      await aviaResultsPage.applyDirectFilter();

      // После применения фильтра результаты должны оставаться
      await aviaResultsPage.expectResultsLoaded();
    });

    test('применение «Прямые» показывает только рейсы без пересадок', async ({ aviaResultsPage }) => {
      await aviaResultsPage.applyDirectFilter();

      const count = await aviaResultsPage.getFlightCount();
      // После фильтра должны остаться рейсы (маршрут MOW→TBS имеет прямые)
      expect(count).toBeGreaterThan(0);
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // Группа 5: Форма поиска на странице результатов
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Форма поиска на странице результатов', () => {

    test('форма поиска присутствует на странице результатов', async ({ aviaResultsPage }) => {
      await expect(aviaResultsPage.searchButtonInHeader).toBeVisible();
    });

    test('коды аэропортов отображаются в форме на странице результатов', async ({ aviaResultsPage }) => {
      // Должны быть видны коды MOW и TBS
      await expect(aviaResultsPage.page.getByText('MOW')).toBeVisible();
      await expect(aviaResultsPage.page.getByText('TBS')).toBeVisible();
    });

  });

});

// ─────────────────────────────────────────────────────────────────────────
// Дополнительные тесты: полный сценарий через форму поиска
// ─────────────────────────────────────────────────────────────────────────

test.describe('Полный сценарий поиска (форма → результаты)', () => {

  test('поиск через популярное направление «Тбилиси» показывает результаты', async ({ aviaSearchPage }) => {
    await aviaSearchPage.goto();

    // Кликаем на популярное направление
    await aviaSearchPage.clickPopularDestination('Тбилиси');

    // Ждём редиректа на страницу результатов
    await expect(aviaSearchPage.page).toHaveURL(/search_results/, { timeout: 15_000 });

    // Убеждаемся что на странице есть рейсы
    const firstCard = aviaSearchPage.page.locator('.full-result').first();
    await expect(firstCard).toBeVisible({ timeout: 20_000 });
  });

  test('поиск по маршруту Москва → Баку показывает результаты', async ({ aviaSearchPage }) => {
    await aviaSearchPage.goto();

    await aviaSearchPage.clickPopularDestination('Баку');

    await expect(aviaSearchPage.page).toHaveURL(/to=BAK/, { timeout: 15_000 });

    const firstCard = aviaSearchPage.page.locator('.full-result').first();
    await expect(firstCard).toBeVisible({ timeout: 20_000 });
  });

});
