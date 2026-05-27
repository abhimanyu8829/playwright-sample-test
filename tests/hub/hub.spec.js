import { test, expect } from '@playwright/test';
import { loginToHub } from '../../utils/nitroberry';

test.describe('Nitroberry hub', () => {
  test.beforeEach(async ({ page }) => {
    await loginToHub(page);
  });

  test('renders the licensed product catalogue', async ({ page }) => {
    const products = [
      'Cockpit',
      'Vault',
      'Social',
      'Task',
      'Workflow',
      'Messenger',
    ];

    for (const product of products) {
      const card = page.getByRole('button', { name: new RegExp(`${product}.*Launch app`, 'i') });
      await expect(card).toBeVisible();
      await expect(card).toContainText('Launch app');
    }
  });

  test('marks unavailable products without allowing normal access', async ({ page }) => {
    const survey = page.getByRole('button', { name: /Survey.*Launch app/i });
    const crm = page.getByRole('button', { name: /CRM.*Launch app/i });

    await expect(survey).toBeDisabled();
    await expect(crm).toContainText(/Coming Soon|No licence|Not licensed/i);
  });

  test('supports the compact catalogue view toggle', async ({ page }) => {
    await page.getByRole('button', { name: /compact/i }).click();

    await expect(page.getByText('Your Products')).toBeVisible();
    await expect(page.getByRole('button', { name: /^Full$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Cockpit$/i })).toBeVisible();
  });
});
