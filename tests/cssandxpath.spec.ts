import { test, expect } from '@playwright/test';

test('CSSandXPath application', async ({ page }) => { 
await page.goto('https://login.salesforce.com/');
//await expect(page).toHaveTitle('Getting started - VS Code | Playwright');
await page.locator("xpath=//*[@id='username']").fill("RCV");
await page.locator("css=#password").fill('RCV');
})