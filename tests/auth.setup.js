import { test as setup } from '@playwright/test';

setup('authenticate admin', async ({ page }) => {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await page.context().storageState({ path: 'playwright/.auth/admin.json' });
});
