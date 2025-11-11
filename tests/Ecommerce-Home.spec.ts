import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');
});

test('Verify select item on right menu', async ({ page }) => {
await page.getByRole('link', { name: 'Installing Playwright', exact: true }).click();
await page.getByRole('link', { name: 'Using npm, yarn or pnpm', exact: true }).click();
await expect(page.getByRole('heading', { name: 'Using npm, yarn or pnpm' })).toBeVisible();
});