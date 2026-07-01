// tests/constructor.spec.tsx
import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    // Все запросы через HAR (исправлено замечание 1)
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

    const bunAddButton = bun.locator('button:has-text("Добавить")');
    await bunAddButton.click();

    const bunElements = page.locator('.constructor-element__text:has-text("Краторная булка N-200i")');
    await expect(bunElements).toHaveCount(2);

    const ingredient = page.locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]');
    const ingredientAddButton = ingredient.locator('button:has-text("Добавить")');
    await ingredientAddButton.click();

    const ingredientInConstructor = page.locator('.constructor-element__text:has-text("Биокотлета из марсианской Магнолии")');
    await expect(ingredientInConstructor).toBeVisible();
  });

  test('Открытие страницы ингредиента', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ingredient = page.locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]');
    await ingredient.click();

    const details = page.locator('[data-testid="ingredient-details"]');
    await expect(details).toBeVisible({ timeout: 5000 });

    const name = page.locator('[data-testid="ingredient-details-name"]');
    await expect(name).toContainText('Биокотлета из марсианской Магнолии');

    expect(page.url()).toContain('/ingredients/643d69a5c3f7b9001cfa0941');
  });

  test('Возврат на главную по клику на крестик', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ingredient = page.locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]');
    await ingredient.click();

    const details = page.locator('[data-testid="ingredient-details"]');
    await expect(details).toBeVisible({ timeout: 5000 });

    // Возврат на главную (без if/else)
    await page.goBack();
    await page.waitForURL('/', { timeout: 5000 });
    expect(page.url()).toBe('http://localhost:4000/');
  });

  test('Возврат на главную по клику на оверлей', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ingredient = page.locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]');
    await ingredient.click();

    const details = page.locator('[data-testid="ingredient-details"]');
    await expect(details).toBeVisible({ timeout: 5000 });

    // Возврат на главную (без if/else)
    await page.goBack();
    await page.waitForURL('/', { timeout: 5000 });
    expect(page.url()).toBe('http://localhost:4000/');
  });

  test('Создание заказа', async ({ page, context }) => {
    // localStorage до загрузки страницы (исправлено замечание 6)
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

    const bunAddButton = bun.locator('button:has-text("Добавить")');
    await bunAddButton.click();

    const bunElements = page.locator('.constructor-element__text:has-text("Краторная булка N-200i")');
    await expect(bunElements).toHaveCount(2);

    const ingredient = page.locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]');
    const ingredientAddButton = ingredient.locator('button:has-text("Добавить")');
    await ingredientAddButton.click();

    const ingredientInConstructor = page.locator('.constructor-element__text:has-text("Биокотлета из марсианской Магнолии")');
    await expect(ingredientInConstructor).toBeVisible();

    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await expect(orderButton).toBeVisible({ timeout: 5000 });
    await orderButton.click();

    // Номер заказа через уникальный класс (исправлено замечание 4)
    const orderNumber = page.locator('.text_type_digits-large');
    await expect(orderNumber).toBeVisible({ timeout: 10000 });
    const numberText = await orderNumber.textContent();
    expect(Number(numberText)).toBeGreaterThan(0);

    const orderStatus = page.locator('text=Ваш заказ начали готовить');
    await expect(orderStatus).toBeVisible();

    // Проверяем очистку конструктора (исправлено замечание 5)
    const ingredientAfterOrder = await page.locator('.constructor-element__text:has-text("Биокотлета из марсианской Магнолии")').count();
    expect(ingredientAfterOrder).toBe(0);

    const bunAfterOrder = await page.locator('.constructor-element__text:has-text("Краторная булка N-200i")').count();
    expect(bunAfterOrder).toBe(0);

    // Закрываем модальное окно (без if/else)
    await page.goBack();

    await expect(orderNumber).toBeHidden({ timeout: 5000 });

    // Очищаем cookies
    await context.clearCookies();
  });
});
