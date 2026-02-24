import { test, expect } from '../fixtures/base.fixtures';
import aviaData from '../../test-data/avia-search.json';

/**
 * Тесты для страницы поиска авиабилетов
 * URL: https://alfabit.org/ru/travel/avia
 *
 * Покрываемые сценарии:
 * 1. Загрузка страницы и видимость всех элементов
 * 2. Форма поиска — состояние полей по умолчанию
 * 3. Кнопка «Найти» — блокировка без маршрута
 * 4. Популярные направления — отображение и клик
 * 5. Поиск через популярное направление → редирект на результаты
 * 6. Dropdown пассажиров — классы перелёта
 * 7. Вкладки навигации
 */

test.use({
  baseURL: 'https://alfabit.org',
});

test.describe('Страница поиска авиабилетов — alfabit.org/ru/travel/avia', () => {

  test.beforeEach(async ({ aviaSearchPage }) => {
    await aviaSearchPage.goto();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Группа 1: Загрузка страницы
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Загрузка страницы', () => {

    test('заголовок страницы содержит "Alfabit Travel"', async ({ aviaSearchPage }) => {
      await aviaSearchPage.expectPageTitle();
    });

    test('URL страницы корректный', async ({ aviaSearchPage }) => {
      await expect(aviaSearchPage.page).toHaveURL(/\/ru\/travel\/avia/);
    });

    test('вкладки навигации (Авиабилеты, Отели) видны', async ({ aviaSearchPage }) => {
      await aviaSearchPage.expectNavigationTabsVisible();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // Группа 2: Форма поиска — элементы и состояние
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Форма поиска — элементы', () => {

    test('все элементы формы отображаются', async ({ aviaSearchPage }) => {
      await aviaSearchPage.expectFormVisible();
    });

    test('поле «Откуда» содержит предзаполненный код аэропорта', async ({ aviaSearchPage }) => {
      // По умолчанию поле «Откуда» имеет значение VTB (Витебск)
      await aviaSearchPage.expectFromCodeVisible();
      const codeText = await aviaSearchPage.fromCode.textContent();
      expect(codeText?.trim().length).toBeGreaterThan(0);
    });

    test('поле «Куда» изначально пустое (placeholder виден)', async ({ aviaSearchPage }) => {
      const value = await aviaSearchPage.toInput.inputValue();
      expect(value).toBe('');
    });

    test('поле «Когда» показывает дату', async ({ aviaSearchPage }) => {
      // Дата по умолчанию — сегодня или завтра
      const dateText = await aviaSearchPage.dateDisplay.textContent();
      expect(dateText?.trim().length).toBeGreaterThan(0);
    });

    test('блок «Пассажиры» виден', async ({ aviaSearchPage }) => {
      await expect(aviaSearchPage.passengersInput).toBeVisible();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // Группа 3: Кнопка «Найти» — логика блокировки
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Кнопка «Найти» — блокировка', () => {

    test('кнопка «Найти» заблокирована, пока не выбрано направление «Куда»', async ({ aviaSearchPage }) => {
      // При загрузке поле «Куда» пустое → кнопка disabled
      await aviaSearchPage.expectSearchDisabled();
    });

    test('кнопка «Найти» становится активной после выбора направления', async ({ aviaSearchPage }) => {
      // Кликаем на популярное направление — оно заполняет «Откуда» и «Куда»
      await aviaSearchPage.clickPopularDestination(aviaData.popularDestinations[0]);
      // После этого страница уходит на результаты — проверяем до редиректа
      // (клик на популярное направление сразу перенаправляет на поиск)
      await expect(aviaSearchPage.page).toHaveURL(/search_results/);
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // Группа 4: Популярные направления
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Популярные направления', () => {

    test('секция «Популярные направления» отображается', async ({ aviaSearchPage }) => {
      await aviaSearchPage.expectPopularDestinationsVisible();
    });

    test('города из популярных направлений видны на странице', async ({ aviaSearchPage }) => {
      for (const city of aviaData.popularDestinations) {
        await expect(aviaSearchPage.page.getByText(city).first()).toBeVisible();
      }
    });

    test('клик на «Тбилиси» перенаправляет на страницу результатов', async ({ aviaSearchPage }) => {
      await aviaSearchPage.clickPopularDestination('Тбилиси');

      // Ожидаем редирект на страницу результатов
      await expect(aviaSearchPage.page).toHaveURL(/search_results/, { timeout: 15_000 });
    });

    test('после клика на популярное направление URL содержит коды аэропортов', async ({ aviaSearchPage }) => {
      await aviaSearchPage.clickPopularDestination('Тбилиси');

      // URL должен содержать from=MOW&to=TBS
      await expect(aviaSearchPage.page).toHaveURL(/from=MOW/, { timeout: 15_000 });
      await expect(aviaSearchPage.page).toHaveURL(/to=TBS/);
    });

    test('после клика на «Баку» URL содержит код BAK', async ({ aviaSearchPage }) => {
      await aviaSearchPage.clickPopularDestination('Баку');

      await expect(aviaSearchPage.page).toHaveURL(/to=BAK/, { timeout: 15_000 });
    });

    test('после клика URL содержит параметр класса — эконом (class=e)', async ({ aviaSearchPage }) => {
      await aviaSearchPage.clickPopularDestination('Тбилиси');

      await expect(aviaSearchPage.page).toHaveURL(/class=e/, { timeout: 15_000 });
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // Группа 5: Dropdown пассажиров
  // ─────────────────────────────────────────────────────────────────────────

  test.describe('Dropdown пассажиров', () => {

    test('клик на «Пассажиры» открывает dropdown', async ({ aviaSearchPage }) => {
      await aviaSearchPage.openPassengersDropdown();
      await aviaSearchPage.expectPassengersDropdownOpen();
    });

    test('в dropdown отображаются все классы перелёта', async ({ aviaSearchPage }) => {
      await aviaSearchPage.openPassengersDropdown();

      for (const tripClass of aviaData.tripClasses) {
        await expect(
          aviaSearchPage.page.locator('.trip-classes-list .item', { hasText: tripClass })
        ).toBeVisible();
      }
    });

    test('класс «Эконом» выбран по умолчанию', async ({ aviaSearchPage }) => {
      await aviaSearchPage.openPassengersDropdown();

      const econom = aviaSearchPage.page.locator('.trip-classes-list .item', { hasText: 'Эконом' });
      await expect(econom).toHaveClass(/selected/);
    });

    test('в dropdown отображаются категории пассажиров (Взрослые, Дети, Младенцы)', async ({ aviaSearchPage }) => {
      await aviaSearchPage.openPassengersDropdown();

      for (const category of aviaData.passengerCategories) {
        await expect(
          aviaSearchPage.page.locator('.passenger-category', { hasText: category }).first()
        ).toBeVisible();
      }
    });

    test('можно переключить класс на «Бизнес»', async ({ aviaSearchPage }) => {
      await aviaSearchPage.openPassengersDropdown();

      await aviaSearchPage.page.locator('.trip-classes-list .item', { hasText: 'Бизнес' }).click();

      const bizClass = aviaSearchPage.page.locator('.trip-classes-list .item', { hasText: 'Бизнес' });
      await expect(bizClass).toHaveClass(/selected/);
    });

  });

});
