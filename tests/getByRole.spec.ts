import { test, expect } from '@playwright/test';

// test('Get by Role', async ({ page }) => { 
// await page.goto('https://login.salesforce.com/');
// await page.getByRole("link", { name: "Forgot Your Password?"}).click();
// await expect(page.getByRole('heading', { name: 'Reset Your Password' })).toBeVisible();
// });

// test('Get by text ', async ({ page }) => { 
// await page.goto('https://login.salesforce.com/');
// await page.getByText('Forgot Your Password?').click();
// await expect(page.getByRole('heading', { name: 'Reset Your Password' })).toBeVisible();
// });

test('Get by label', async ({ page }) => { 
await page.goto('https://login.salesforce.com/');
await page.getByRole('checkbox', { name: 'Remember me' }).click();
// await expect(page.getByRole('heading', { name: 'Reset Your Password' })).toBeVisible();
});