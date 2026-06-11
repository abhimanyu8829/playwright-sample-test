import { test, expect } from '@playwright/test';
import { loginToHub, openProduct } from '../../utils/nitroberry';

test.describe('Task product flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginToHub(page);
    await openProduct(page, 'task');
  });

  test('opens the create task dialog with the current required fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Task' }).click();

    await expect(page.getByText('Create New Task')).toBeVisible();
    await expect(page.getByPlaceholder('Enter task title')).toBeVisible();
    await expect(page.getByPlaceholder('Enter task description')).toBeVisible();
    await expect(page.locator('[role="combobox"]').filter({ hasText: 'Select task type' })).toBeVisible();
    await expect(page.locator('[role="combobox"]').filter({ hasText: 'Select priority' })).toBeVisible();
    await expect(page.locator('input[type="date"]')).toHaveCount(2);
    await expect(page.getByPlaceholder('Search users...')).toBeVisible();
  });

  test('can fill task details without submitting production data', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Task' }).click();

    const taskName = `Automation smoke ${Date.now()}`;
    await page.getByPlaceholder('Enter task title').fill(taskName);
    await page.getByPlaceholder('Enter task description').fill('Created by Playwright smoke coverage.');
    await page.locator('input[type="date"]').last().fill('2026-06-30');

    await expect(page.getByPlaceholder('Enter task title')).toHaveValue(taskName);
    await expect(page.getByPlaceholder('Enter task description')).toHaveValue('Created by Playwright smoke coverage.');
    await expect(page.locator('input[type="date"]').last()).toHaveValue('2026-06-30');

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Create New Task')).not.toBeVisible();
  });
});
