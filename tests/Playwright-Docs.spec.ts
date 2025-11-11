import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');
});

test('Verify select item on right menu', async ({ page }) => {
await page.getByRole('link', { name: 'Installing Playwright', exact: true }).click();
await page.getByRole('link', { name: 'Using npm, yarn or pnpm', exact: true }).click();
await expect(page.getByRole('heading', { name: 'Using npm, yarn or pnpm' })).toBeVisible();
});

test('Verify select item on left menu', async ({ page }) => {
await page.getByRole('link', { name: 'Writing tests', exact: true }).click();
await expect(page.getByRole('heading', { name: 'Writing tests' })).toBeVisible();
});
test('Go to Playwright Home page from Docs', async ({ page }) => {
await page.getByRole('link', { name: 'Home page' }).click();
await expect(page).toHaveTitle('Fast and reliable end-to-end testing for modern web apps | Playwright' );
});
