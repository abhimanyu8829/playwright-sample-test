import { test, expect } from '@playwright/test';
import { openProduct } from '../../utils/nitroberry';

test.describe('Cockpit dashboard basics', () => {
  test.beforeEach(async ({ page }) => {
    await openProduct(page, 'cockpit');
  });

  test('shows the main admin sidebar modules', async ({ page }) => {
    const modules = [
      'Dashboard',
      'Company',
      'Facility',
      'Subscription',
      'User',
      'Group',
      'Job Title',
      'Department',
      'Roles & Permissions',
      'Storage',
      'Support',
      'Audit Log',
      'My Permissions',
    ];

    for (const moduleName of modules) {
      await expect(page.getByText(moduleName, { exact: true }).first()).toBeVisible();
    }
  });

  test('renders key overview sections for company administration', async ({ page }) => {
    await expect(page.getByText('TOTAL USERS')).toBeVisible();
    await expect(page.getByText('ORGANISATION STRUCTURE')).toBeVisible();
    await expect(page.getByText('Upcoming Holidays')).toBeVisible();
    await expect(page.getByText('Company Shifts')).toBeVisible();
    await expect(page.getByText('Office Locations')).toBeVisible();
    await expect(page.getByText('Support Tickets')).toBeVisible();
    await expect(page.getByText('Storage Usage')).toBeVisible();
  });
});
