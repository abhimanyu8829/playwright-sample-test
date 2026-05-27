import { test as setup } from '@playwright/test';
import { loginToHub } from '../utils/nitroberry';

setup('authenticate admin', async ({ page }) => {
  await loginToHub(page);
  await page.context().storageState({ path: 'playwright/.auth/admin.json' });
});
