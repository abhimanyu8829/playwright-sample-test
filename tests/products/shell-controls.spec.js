import { test, expect } from '@playwright/test';
import { openProduct } from '../../utils/nitroberry';

test.describe('Shared Nitroberry shell controls', () => {
  test.beforeEach(async ({ page }) => {
    await openProduct(page, 'task');
  });

  test('opens the notifications popover from the product shell', async ({ page }) => {
    await page.getByRole('button', { name: 'Notifications' }).click();

    const notificationDialog = page.getByRole('dialog');
    await expect(notificationDialog).toBeVisible();
    await expect(notificationDialog.getByText('Notifications', { exact: true })).toBeVisible();
  });

  test('opens the product switcher menu from a product app', async ({ page }) => {
    await page.getByRole('button', { name: 'Switch product' }).click();

    await expect(page.getByText('Cockpit').first()).toBeVisible();
    await expect(page.getByText('Workflow').first()).toBeVisible();
    await expect(page.getByText('Messenger').first()).toBeVisible();
  });

  test('toggles theme mode without leaving the product page', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: /switch to (dark|light) mode/i });
    const beforeLabel = await themeButton.getAttribute('aria-label');

    await themeButton.click();

    await expect(page).toHaveURL(/task\.nitroberry\.com\/dashboard/);
    await expect(themeButton).not.toHaveAttribute('aria-label', beforeLabel || '');
  });
});
