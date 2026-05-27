import { test, expect } from '@playwright/test';
import { openProduct } from '../../utils/nitroberry';

test.describe('Social dashboard controls', () => {
  test.beforeEach(async ({ page }) => {
    await openProduct(page, 'social');
  });

  test('shows feed navigation and community context', async ({ page }) => {
    await expect(page.getByText('Home', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Communities', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Favorites will appear here.')).toBeVisible();
    await expect(page.getByText('My Company')).toBeVisible();
  });

  test('post type controls are available from the home feed', async ({ page }) => {
    for (const type of ['Discussion', 'Question', 'Praise', 'Poll', 'Drafts']) {
      await expect(page.getByRole('button', { name: type })).toBeVisible();
    }
  });
});
