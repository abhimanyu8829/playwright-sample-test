import { test, expect } from '@playwright/test';
import { openProduct } from '../../utils/nitroberry';

test.describe('Workflow dashboard controls', () => {
  test.beforeEach(async ({ page }) => {
    await openProduct(page, 'workflow');
  });

  test('switches dashboard tabs without losing workflow metrics', async ({ page }) => {
    await page.getByRole('button', { name: 'Company Dashboard' }).click();
    await expect(page.getByText('Pending Steps')).toBeVisible();
    await expect(page.getByText('Completed Steps')).toBeVisible();

    await page.getByRole('button', { name: 'My Dashboard' }).click();
    await expect(page.getByText('WORKFLOW BOARD')).toBeVisible();
  });

  test('opens workflow filters panel', async ({ page }) => {
    await page.getByRole('button', { name: 'Filters' }).click();

    await expect(page.getByText(/Filters/i).first()).toBeVisible();
    await expect(page.getByText('Pending Steps')).toBeVisible();
  });
});
