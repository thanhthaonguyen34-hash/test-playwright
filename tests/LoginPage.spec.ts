import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.goto();
});

test('Verify successful login with standard user', async ({ page }) => {
  await loginPage.loginStandardUser();
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');
});

test('Verify locked out user shows error', async ({ page }) => {
  await loginPage.loginLockedOutUser();
  await loginPage.expectErrorMessage(/locked out/i);
});     