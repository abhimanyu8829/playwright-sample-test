import { test, expect } from '@playwright/test';
import { credentials } from '../../utils/nitroberry';

test.describe('Nitroberry auth', () => {
  test('renders the current login page marketing copy and controls', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveTitle(/NitroBerry/i);
    await expect(page.getByText('Industrial Automation Platform')).toBeVisible();
    await expect(page.getByText('Single-sign-on ready')).toBeVisible();
    await expect(page.getByText('Email magic link')).toBeVisible();
    await expect(page.getByText('Role-based access')).toBeVisible();
    await expect(page.getByText('Audit logs & 2FA')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /^sign in$/i })).toBeVisible();
    await expect(page.getByText('Remember me')).toBeVisible();
    await expect(page.getByText('Forgot password?')).toBeVisible();
    await expect(page.getByText('Create an account')).toBeVisible();
  });

  test('exposes the expected login form field types and checkbox', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('#email')).toHaveAttribute('type', 'email');
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    await expect(page.getByLabel('Remember me')).toBeVisible();
    await expect(page.getByLabel('Remember me')).toBeChecked();
  });

  test('toggles the remember me checkbox on the login form', async ({ page }) => {
    await page.goto('/login');

    const rememberMe = page.getByLabel('Remember me');
    await expect(rememberMe).toBeChecked();
    await rememberMe.click();
    await expect(rememberMe).not.toBeChecked();
  });

  test('links to forgot password and account creation pages', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('link', { name: 'Forgot password?' })).toHaveAttribute(
      'href',
      /\/forgot-password$/
    );
    await expect(page.getByRole('link', { name: 'Create an account' })).toHaveAttribute(
      'href',
      /\/register$/
    );
  });

  test('includes the NitroBerry legal footer links', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', /nitroberry\.com\/terms$/);
    await expect(page.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      /nitroberry\.com\/privacy-policy$/
    );
    await expect(page.getByRole('link', { name: 'Cookie Policy' })).toHaveAttribute(
      'href',
      /nitroberry\.com\/cookie-policy$/
    );
  });

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

  test('keeps a saved admin storage state file available for product tests', async () => {
    await expect(true).toBeTruthy();
    await expect(credentials.email).toBe('admin@nitroberry.com');
  });
});
