import { test, expect } from '@playwright/test';
import { parseEnv } from 'util';

test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');
});

test('Verify select item on right menu', async ({ page }) => {
await page.getByRole('link', { name: 'Using npm, yarn or pnpm', exact: true }).click();
await expect(page.getByRole('heading', { name: 'Using npm, yarn or pnpm' })).toBeVisible();
});

test('Verify search functionality', async ({ page }) => {
    await page.getByRole('button', { name: 'Search (Ctrl+K)'}).click();;
    const searchbox = page.locator('input[placeholder="Search docs"]');
    await expect(searchbox).toBeVisible();
    await searchbox.pressSequentially('Browsers', { delay: 100 });
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'Browsers',  exact: true })).toBeVisible(); 
});
   
test('Verify navigation to API reference', async ({ page }) => {    
    await page.getByRole('link', { name: 'API', exact: true }).click();
    await expect(page).toHaveURL(/.*api/);      
});