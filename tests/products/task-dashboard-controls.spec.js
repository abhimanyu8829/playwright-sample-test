import { test, expect } from '@playwright/test';
import { openProduct } from '../../utils/nitroberry';

test.describe('Task dashboard controls', () => {
  test.beforeEach(async ({ page }) => {
    await openProduct(page, 'task');
  });

  test('switches between delegation and my-task views', async ({ page }) => {
    await page.getByRole('button', { name: 'My Task' }).click();
    await expect(page.getByRole('button', { name: 'My Task' })).toBeVisible();

    await page.getByRole('button', { name: 'Delegations' }).click();
    await expect(page.getByText('DELEGATIONS BOARD')).toBeVisible();
  });

  test('opens dashboard view mode selector', async ({ page }) => {
    await page.getByRole('button', { name: /View: Calendar/i }).click();

    await expect(page.getByRole('option').first()).toBeVisible();
  });
});
