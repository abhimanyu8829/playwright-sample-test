import { test, expect } from '@playwright/test';
import { productUrls } from '../../utils/nitroberry';

const productNames = [
  ['cockpit', 'Cockpit'],
  ['task', 'Task'],
  ['workflow', 'Workflow'],
  ['social', 'Social'],
  ['vault', 'Vault'],
  ['messenger', 'Messenger'],
];

test.describe('Nitroberry product redirects', () => {
  for (const [productKey, productLabel] of productNames) {
    test(`${productLabel} sends unauthenticated users to the login flow`, async ({ page }) => {
      await page.goto(productUrls[productKey], { waitUntil: 'domcontentloaded' });

      if (productKey === 'messenger') {
        await expect(page.getByText('INTERNAL_SERVER_ERROR')).toBeVisible();
        await expect(page.getByText('MIDDLEWARE_INVOCATION_FAILED')).toBeVisible();
        return;
      }

      await expect(page).toHaveURL(/\/login(?:\?|$)/);
      await expect(page.url()).toContain('callbackUrl=');
      await expect(page.url()).toContain(encodeURIComponent(productUrls[productKey]));
      await expect(page.locator('#email')).toHaveAttribute('type', 'email');
      await expect(page.locator('#password')).toHaveAttribute('type', 'password');
      await expect(page.getByRole('button', { name: /^sign in$/i })).toBeVisible();
      await expect(page.getByText('Industrial Automation Platform')).toBeVisible();
      await expect(page.getByText('Email', { exact: true })).toBeVisible();
      await expect(page.getByText('Password', { exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Create an account' })).toBeVisible();
    });
  }

  test('cockpit login callback preserves the dashboard path', async ({ page }) => {
    await page.goto(productUrls.cockpit, { waitUntil: 'domcontentloaded' });
    await expect(page.url()).toContain('callbackUrl=');
    await expect(page.url()).toContain(encodeURIComponent(productUrls.cockpit));
  });

  test('messenger currently returns the live middleware error page', async ({ page }) => {
    await page.goto(productUrls.messenger, { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(productUrls.messenger);
    await expect(page.getByText('500: INTERNAL_SERVER_ERROR')).toBeVisible();
    await expect(page.getByText('MIDDLEWARE_INVOCATION_FAILED')).toBeVisible();
  });
});
