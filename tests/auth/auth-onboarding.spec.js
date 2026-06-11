import { test, expect } from '@playwright/test';

test.describe('Nitroberry auth onboarding pages', () => {
  test('renders the forgot password page with the expected controls', async ({ page }) => {
    await page.goto('/forgot-password');

    await expect(page).toHaveURL(/\/forgot-password(?:$|\?)/);
    await expect(page).toHaveTitle(/NitroBerry/i);
    await expect(page.getByText('Reset your password securely.')).toBeVisible();
    await expect(page.getByText("Enter your email address and we'll send you a secure link to reset your password and regain access to your account.")).toBeVisible();
    await expect(page.getByText('Secure reset process')).toBeVisible();
    await expect(page.getByText('Email verification')).toBeVisible();
    await expect(page.getByText('Quick recovery')).toBeVisible();
    await expect(page.getByText('24/7 support')).toBeVisible();
    await expect(page.locator('#email')).toHaveAttribute('type', 'email');
    await expect(page.getByRole('button', { name: 'Send Reset Link' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', /\/login$/);
  });

  test('renders the register page with the expected controls', async ({ page }) => {
    await page.goto('/register');

    await expect(page).toHaveURL(/\/register(?:$|\?)/);
    await expect(page).toHaveTitle(/NitroBerry/i);
    await expect(page.getByText('Create your account and get started.')).toBeVisible();
    await expect(page.getByText('Enterprise-grade security')).toBeVisible();
    await expect(page.getByText('Real-time analytics')).toBeVisible();
    await expect(page.getByText('Custom workflows')).toBeVisible();
    await expect(page.getByText('24/7 support')).toBeVisible();
    await expect(page.locator('#first_name')).toHaveAttribute('name', 'firstName');
    await expect(page.locator('#last_name')).toHaveAttribute('name', 'lastName');
    await expect(page.locator('#email')).toHaveAttribute('type', 'email');
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', /\/login$/);
  });

  test('register page exposes the terms and privacy agreement links', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', /nitroberry\.com\/terms$/);
    await expect(page.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      /nitroberry\.com\/privacy-policy$/
    );
  });

  test('forgot password page keeps the user on the page when submitted empty', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.getByRole('button', { name: 'Send Reset Link' }).click();

    await expect(page).toHaveURL(/\/forgot-password(?:$|\?)/);
    await expect(page.getByRole('button', { name: 'Send Reset Link' })).toBeVisible();
  });
});
