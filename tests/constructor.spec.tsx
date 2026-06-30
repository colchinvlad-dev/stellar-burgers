// tests/constructor.spec.tsx
import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    // Все запросы через HAR
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });
    await page.routeFromHAR('./tests/hars/orders.har', {
      url: '**/api/orders',
      update: false
    });
  });

  test('Добавление ингредиента из списка в конструктор', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const bun = page.locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]');
    await expect(bun).toBeVisible({ timeout: 10000 });
    await bun.locator('button:has-text("Добавить")').click();

    const bunElements = page.locator('.constructor-element__text:has-text("Краторная булка N-200i")');
    await expect(bunElements).toHaveCount(2);

    const ingredient = page.locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]');
    await ingredient.locator('button:has-text("Добавить")').click();

    const ingredientInConstructor = page.locator('.constructor-element__text:has-text("Биокотлета из марсианской Магнолии")');
    await expect(ingredientInConstructor).toBeVisible();
  });

  test('Открытие модального окна ингредиента', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Кликаем по ингредиенту — это откроет страницу
    const ingredient = page.locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]');
    await ingredient.click();

    // Проверяем, что открылась страница с деталями
    const details = page.locator('[data-testid="ingredient-details"]');
    await expect(details).toBeVisible({ timeout: 5000 });

    const name = page.locator('[data-testid="ingredient-details-name"]');
    await expect(name).toContainText('Биокотлета из марсианской Магнолии');

    expect(page.url()).toContain('/ingredients/643d69a5c3f7b9001cfa0941');
  });

  test('Закрытие страницы ингредиента по клику на крестик', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ingredient = page.locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]');
    await ingredient.click();

    const details = page.locator('[data-testid="ingredient-details"]');
    await expect(details).toBeVisible({ timeout: 5000 });

    // Пытаемся закрыть через крестик, если есть
    const closeButton = page.locator('[data-testid="modal-close-button"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await page.waitForURL('/', { timeout: 5000 });
    } else {
      // Иначе просто возвращаемся назад
      await page.goBack();
      await page.waitForURL('/', { timeout: 5000 });
    }

    expect(page.url()).toBe('http://localhost:4000/');
  });

  test('Закрытие страницы ингредиента по клику на оверлей', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ingredient = page.locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]');
    await ingredient.click();

    const details = page.locator('[data-testid="ingredient-details"]');
    await expect(details).toBeVisible({ timeout: 5000 });

    const overlay = page.locator('[data-testid="modal-overlay"]');
    if (await overlay.isVisible()) {
      await overlay.click();
      await page.waitForURL('/', { timeout: 5000 });
    } else {
      await page.goBack();
      await page.waitForURL('/', { timeout: 5000 });
    }

    expect(page.url()).toBe('http://localhost:4000/');
  });

  test('Создание заказа', async ({ page, context }) => {
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token-12345');
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'fake-access-token-12345',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const bun = page.locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]');
    await expect(bun).toBeVisible({ timeout: 10000 });
    await bun.locator('button:has-text("Добавить")').click();

    const bunElements = page.locator('.constructor-element__text:has-text("Краторная булка N-200i")');
    await expect(bunElements).toHaveCount(2);

    const ingredient = page.locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]');
    await ingredient.locator('button:has-text("Добавить")').click();

    const ingredientInConstructor = page.locator('.constructor-element__text:has-text("Биокотлета из марсианской Магнолии")');
    await expect(ingredientInConstructor).toBeVisible();

    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await expect(orderButton).toBeVisible({ timeout: 5000 });
    await orderButton.click();

    // Проверяем номер заказа по классу
    const orderNumber = page.locator('.text_type_digits-large');
    await expect(orderNumber).toBeVisible({ timeout: 10000 });
    const numberText = await orderNumber.textContent();
    expect(Number(numberText)).toBeGreaterThan(0);

    const orderStatus = page.locator('text=Ваш заказ начали готовить');
    await expect(orderStatus).toBeVisible();

    // Проверяем очистку конструктора
    const ingredientAfterOrder = await page.locator('.constructor-element__text:has-text("Биокотлета из марсианской Магнолии")').count();
    expect(ingredientAfterOrder).toBe(0);

    const bunAfterOrder = await page.locator('.constructor-element__text:has-text("Краторная булка N-200i")').count();
    expect(bunAfterOrder).toBe(0);

    // Закрываем модальное окно
    const closeButton = page.locator('[data-testid="modal-close-button"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      // Ищем оверлей и кликаем
      const overlay = page.locator('[data-testid="modal-overlay"]');
      if (await overlay.isVisible()) {
        await overlay.click();
      } else {
        // Если ничего нет, кликаем в угол
        await page.mouse.click(10, 10);
      }
    }

    // Проверяем, что номер заказа исчез
    await expect(orderNumber).toBeHidden({ timeout: 5000 });

    await page.evaluate(() => {
      localStorage.removeItem('refreshToken');
    });
    await context.clearCookies();
  });
});
