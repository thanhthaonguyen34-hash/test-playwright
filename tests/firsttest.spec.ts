import { test, expect } from '@playwright/test';

test('Launch application', async ({ page }) => { 
await page.goto("https://playwright.dev/docs/getting-started-vscode");
await expect(page).toHaveTitle('Getting started - VS Code | Playwright');
})