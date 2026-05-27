import { test, expect } from '@playwright/test';
import { expectShell, loginToHub, openProduct } from '../../utils/nitroberry';

test.describe('Nitroberry product smoke coverage', () => {
  test.beforeEach(async ({ page }) => {
    await loginToHub(page);
  });

  test('Cockpit dashboard shows company administration modules', async ({ page }) => {
    await openProduct(page, 'cockpit');

    await expectShell(page, 'Cockpit');
    await expect(page).toHaveURL(/cockpit\.nitroberry\.com\/dashboard/);
    await expect(page.getByText('Company & User Administration')).toBeVisible();
    await expect(page.getByText('TOTAL USERS')).toBeVisible();
    await expect(page.getByText('ORGANISATION STRUCTURE')).toBeVisible();

    for (const item of ['Company', 'Facility', 'User', 'Group', 'Job Title', 'Department', 'Roles & Permissions']) {
      await expect(page.getByText(item, { exact: true }).first()).toBeVisible();
    }
  });

  test('Task dashboard exposes calendar, delegation, and create-task controls', async ({ page }) => {
    await openProduct(page, 'task');

    await expectShell(page, 'Task');
    await expect(page).toHaveURL(/task\.nitroberry\.com\/dashboard/);
    await expect(page.getByText('View and manage your delegated tasks')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delegations' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'My Task' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Task' })).toBeVisible();
    await expect(page.getByText('DELEGATIONS BOARD')).toBeVisible();
  });

  test('Workflow dashboard shows dashboard metrics and workflow board', async ({ page }) => {
    await openProduct(page, 'workflow');

    await expectShell(page, 'Workflow');
    await expect(page).toHaveURL(/workflow\.nitroberry\.com\/dashboard/);
    await expect(page.getByText('Workflow & Process Management')).toBeVisible();
    await expect(page.getByText('Pending Steps')).toBeVisible();
    await expect(page.getByText('In Progress Steps')).toBeVisible();
    await expect(page.getByText('WORKFLOW BOARD')).toBeVisible();
  });

  test('Social home feed loads community shortcuts and post-type controls', async ({ page }) => {
    await openProduct(page, 'social');

    await expectShell(page, 'Social');
    await expect(page).toHaveURL(/social\.nitroberry\.com\/home/);
    await expect(page.getByText('Share thoughts, ideas, or updates')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create new' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Discussion' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Question' })).toBeVisible();
    await expect(page.getByText('My Company')).toBeVisible();
  });

  test('Vault requires a private key before showing encrypted credentials', async ({ page }) => {
    await openProduct(page, 'vault');

    await expectShell(page, 'Vault');
    await expect(page.getByText('Unlock Your Vault')).toBeVisible();
    await expect(page.getByPlaceholder('Paste your generated private key here')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Access Vault' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Generate Private Key' })
        .or(page.getByRole('button', { name: 'Forgot private key?' }))
    ).toBeVisible();
  });

  test('Messenger loads contacts workspace and encrypted empty state', async ({ page }) => {
    await openProduct(page, 'messenger');

    await expectShell(page, 'Messenger');
    await expect(page.getByText('Messages')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Contacts', exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Search users...').first()).toBeVisible();
    await expect(page.getByText('Your Workspace is Ready')).toBeVisible();
    await expect(page.getByText('END-TO-END ENCRYPTED')).toBeVisible();
  });
});
