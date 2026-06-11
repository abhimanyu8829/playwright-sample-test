const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Logging in...');
  await page.goto('https://app.nitroberry.com/login', { waitUntil: 'domcontentloaded' });
  
  if (await page.locator('#email').isVisible().catch(() => false)) {
    await page.locator('#email').fill('admin@nitroberry.com');
    await page.locator('#password').fill('N123456');
    await page.getByRole('button', { name: /sign in/i }).click();
  }
  
  await page.waitForURL('**/hub**');
  console.log('Logged in successfully!');

  // Check Vault
  console.log('Checking Vault...');
  await page.goto('https://vault.nitroberry.com', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000); // Wait for things to render
  
  // Try unlocking vault if needed
  try {
     await page.getByPlaceholder('Paste your generated private key here').fill('dummy-key');
     await page.getByRole('button', { name: 'Access Vault' }).click();
     await page.waitForTimeout(2000);
  } catch (e) {}

  const vaultDom = await page.evaluate(() => document.body.innerHTML);
  fs.writeFileSync('vault_dom.html', vaultDom);
  console.log('Vault DOM saved.');

  // Check Workflow
  console.log('Checking Workflow...');
  await page.goto('https://workflow.nitroberry.com/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const workflowDom = await page.evaluate(() => document.body.innerHTML);
  fs.writeFileSync('workflow_dom.html', workflowDom);
  console.log('Workflow DOM saved.');

  await browser.close();
})();
