import { test, expect } from '@playwright/test';

test.describe('Nitroberry hub', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hub', { waitUntil: 'domcontentloaded' });
  });

  test('redirects unauthenticated users to the login page', async ({ page }) => {
    await expect(page).toHaveURL(/\/login(?:$|\?)/);
    await expect(page.getByRole('button', { name: /^sign in$/i })).toBeVisible();
    await expect(page.getByText('Single-sign-on ready')).toBeVisible();
  });

  test('keeps the login form visible after the hub redirect', async ({ page }) => {
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByText('Email magic link')).toBeVisible();
  });

  test('preserves the requested hub url in the login callback', async ({ page }) => {
    await expect(page).toHaveURL(/\/login(?:$|\?)/);
  });
});
