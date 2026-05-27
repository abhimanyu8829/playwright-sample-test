import { expect } from '@playwright/test';

export const credentials = {
  email: process.env.NITROBERRY_EMAIL || 'admin@nitroberry.com',
  password: process.env.NITROBERRY_PASSWORD || '123456',
};

export const productUrls = {
  cockpit: 'https://cockpit.nitroberry.com/dashboard',
  vault: 'https://vault.nitroberry.com',
  social: 'https://social.nitroberry.com/home',
  task: 'https://task.nitroberry.com/dashboard',
  workflow: 'https://workflow.nitroberry.com/dashboard',
  messenger: 'https://messenger.nitroberry.com',
};

export async function loginToHub(page) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });

  if (await page.locator('#email').isVisible().catch(() => false)) {
    await page.locator('#email').fill(credentials.email);
    await page.locator('#password').fill(credentials.password);
    await page.getByRole('button', { name: /^sign in$/i }).click();
  }

  await expect(page).toHaveURL(/\/hub(?:$|\?)/);
  await expect(page.getByText('YOUR PRODUCTS')).toBeVisible();
  await expect(page.getByText('NB', { exact: true }).first()).toBeVisible();
}

export async function openProduct(page, productName) {
  const baseUrl = productUrls[productName];

  if (!baseUrl) {
    throw new Error(`Unknown Nitroberry product: ${productName}`);
  }

  await gotoWithRetry(page, baseUrl);
  await page.waitForLoadState('networkidle').catch(() => {});
  await expect(page.getByText('NitroBerry').first()).toBeVisible();
}

async function gotoWithRetry(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  } catch (error) {
    await page.waitForTimeout(2_000);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  }
}

export async function expectShell(page, productTitle) {
  await expect(page).toHaveTitle(new RegExp(`${productTitle}.*NitroBerry`, 'i'));
  await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Switch product' })).toBeVisible();
  await expect(page.getByRole('button', { name: /switch to (dark|light) mode/i })).toBeVisible();
}

export function pageText(page, text) {
  return page.getByText(text, { exact: true });
}
