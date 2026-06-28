import { test, expect,} from '@playwright/test';

// App under test: Coffee Cart — https://seleniumbase.io/coffee/
// Routes: menu — /coffee/, cart — /coffee/cart
//
// This file is a structural skeleton only. Test bodies are intentionally
// left as test.skip(true, 'TODO: ...') placeholders — no locators or
// expect() assertions are implemented yet. Replace each TODO with the
// real steps/assertions described in the comment.

test.describe('Coffee Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/coffee/');
  });

  test('Smoke: menu loads with drinks list and Total button @smoke', async ({page}) => {
    const menuLocator = page.locator('[data-test="Cappuccino"]')
    const totalButtonLocator = page.locator('[data-test="checkout"]')  
    await expect(menuLocator).toBeVisible();
    await expect(totalButtonLocator).toBeVisible(); 
  });

  test('Adding two different drinks updates the header cart counter and Total', async ({page}) => {
    const cappuccinoLocator = page.locator('[data-test="Cappuccino"]');
    const latteLocator = page.locator('[data-test="Cafe_Latte"]')
    await cappuccinoLocator.click();
    await latteLocator.click();
    const cartCounterLocator = page.getByRole('listitem').filter({ hasText: 'cart (2)' }).first();
    const totalLocator = page.locator('[data-test="checkout"]') 
    await expect(cartCounterLocator).toContainText('2');
    await expect(totalLocator).toContainText('35.00');

  });

  test('Cart page lists exactly the added items', async ({page}) => {
    await page.locator('[data-test="Cafe_Latte"]').click();
    await page.locator('[data-test="Cafe_Breve"]').click();
    await page.getByRole('link', { name: 'Cart page' }).click();
    const cartItemsLocator = page.locator('.cart-preview .list-item');
    await expect(cartItemsLocator).toHaveCount(2);
  });

  test('Increasing item quantity on the cart page updates counter and Total', async ({page}) => {
    await page.locator('[data-test="Espresso"]').click();
    const cartCounterLocator = page.getByRole('link', { name: 'Cart page' });
    await expect(cartCounterLocator).toContainText('1');
    const totalpricelocator = page.locator('[data-test="checkout"]');
    await expect(totalpricelocator).toContainText('10.00');
    await page.locator('[data-test="checkout"]').hover();
    await page.getByRole('button', { name: 'Add one Espresso' }).click();
    await expect(totalpricelocator).toContainText('20.00');
    await expect(cartCounterLocator).toContainText('2');
  });

  test('Empty cart shows no items on a fresh session', async ({page}) => {
    await page.goto('/coffee/cart');
    await expect(page.getByText('No coffee, go add some.')).toBeVisible();
  });

  test('Payment modal shows Name, Email and Submit', async ({page}) => {
    await page.locator('[data-test="Cappuccino"]').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page.getByText('Payment details×We will send')).toBeVisible();
    await expect.soft(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
    await expect.soft(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect.soft(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  test.describe('Optional', () => {
    test('Promo dialog appears when 3 drinks are added, clicking "No" closes it', async ({ page }) => {
      await page.locator('[data-test="Cappuccino"]').click();
      await page.locator('[data-test="Cafe_Latte"]').click();
      await page.locator('[data-test="Cafe_Breve"]').click();
      await expect(page.getByText("It's your lucky day!")).toBeVisible();
      await page.getByRole('button', { name: 'Nah, I\'ll skip.' }).click();
      const cartCounterLocator = page.getByRole('link', { name: 'Cart page' });
      await expect(cartCounterLocator).toContainText('3');
    });

    test('Completed payment form shows a success message', async ({ page }) => {
      await page.locator('[data-test="Cappuccino"]').click();
      await page.locator('[data-test="checkout"]').click();
      await page.getByRole('textbox', { name: 'Name' }).fill('John Doe');
      await page.getByRole('textbox', { name: 'Email' }).fill('john.doe@example.com');
      await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.getByRole('button', { name: 'Thanks for your purchase.' })).toBeVisible();
    });

    test('Skipped on a specific browser with a documented reason', async ({ browserName, page }) => {
      test.skip(browserName === 'webkit', 'webkit project is disabled in playwright.config.ts for this assignment');
      await expect(page.getByRole('listitem').filter({ hasText: 'menu' })).toBeVisible();
    });

    test('Annotated with a tracking issue', async ({page }) => {
      const issueUrl = 'https://example.com/issues/123';
      test.info().annotations.push({ type: 'issue', description: issueUrl });
      await expect(page.getByRole('listitem').filter({ hasText: 'menu' })).toBeVisible();
    });
  });
});
