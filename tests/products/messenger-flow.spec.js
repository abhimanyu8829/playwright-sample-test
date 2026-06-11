import { test, expect } from '@playwright/test';
import { loginToHub, openProduct } from '../../utils/nitroberry';

test.describe('Messenger product flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginToHub(page);
    await openProduct(page, 'messenger');
  });

  test('filters contact search without leaving the workspace', async ({ page }) => {
    const search = page.getByPlaceholder('Search users...').first();

    await search.fill('NB');
    await expect(search).toHaveValue('NB');
    await expect(page.getByText('Your Workspace is Ready')).toBeVisible();

    await search.clear();
    await expect(search).toHaveValue('');
  });

  test('switches between all and unread contact filters', async ({ page }) => {
    await page.getByRole('button', { name: 'Unread' }).click();
    await expect(page.getByRole('button', { name: 'Unread' })).toBeVisible();

    await page.getByRole('button', { name: 'All' }).click();
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
  });
});
