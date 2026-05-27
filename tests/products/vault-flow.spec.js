import { test, expect } from '@playwright/test';
import { loginToHub, openProduct } from '../../utils/nitroberry';

test.describe('Vault product flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginToHub(page);
    await openProduct(page, 'vault');
  });

  test('shows validation when accessing vault without a private key', async ({ page }) => {
    await page.getByRole('button', { name: 'Access Vault' }).click();

    await expect(page.getByText(/private key|required|invalid/i).first()).toBeVisible();
    await expect(page.getByText('Unlock Your Vault')).toBeVisible();
  });

  test('toggles private key visibility control', async ({ page }) => {
    const privateKey = page.getByPlaceholder('Paste your generated private key here');

    await expect(privateKey).toHaveAttribute('type', 'password');
    await page.getByLabel('Show private key').click();
    await expect(privateKey).toHaveAttribute('type', 'text');
  });
});
