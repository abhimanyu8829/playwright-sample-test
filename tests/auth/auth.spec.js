import { test, expect } from '@playwright/test';
import { credentials, loginToHub } from '../../utils/nitroberry';

test.describe('Nitroberry auth', () => {
  test('shows required field validation on the current login form', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /^sign in$/i }).click();

    await expect(page.getByText('Email address is required.')).toBeVisible();
    await expect(page.getByText('Password is required.')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('rejects invalid credentials and keeps the user on login', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('wrong@example.com');
    await page.locator('#password').fill('wrong-password');
    await page.getByRole('button', { name: /^sign in$/i }).click();

    await expect(page.getByText(/EMAIL_NOT_FOUND|INVALID_CREDENTIALS|Error!/i).first()).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('#email')).toBeVisible();
  });

  test('signs in with the admin account and lands on the product hub', async ({ page }) => {
    await loginToHub(page);

    await expect(page.getByText('Cockpit').first()).toBeVisible();
    await expect(page.getByText('Task').first()).toBeVisible();
    await expect(page.getByText('Workflow').first()).toBeVisible();
    await expect(page.getByText(credentials.email)).not.toBeVisible();
  });
});
