import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';

let loginPage: LoginPage;
let productsPage: ProductsPage;

test('Complete login and logout flow', async ({ page }) => {
  // Initialize page objects
  loginPage = new LoginPage(page);
  productsPage = new ProductsPage(page);

  // Step 1: Navigate to login page and login
  await loginPage.goto();
  await loginPage.loginStandardUser();

  // Step 2: Verify products page loaded
  await productsPage.verifyProductsPageLoaded();

  // Step 3: Logout
  await productsPage.logout();

  // Step 4: Verify redirected to login page
  await expect(page).toHaveURL(loginPage.loginUrl);
  await expect(loginPage.usernameInput).toBeVisible();
});

test('Login as locked out user then logout', async ({ page }) => {
  loginPage = new LoginPage(page);
  productsPage = new ProductsPage(page);

  await loginPage.goto();
  await loginPage.loginLockedOutUser();
  
  // Should see error message
  await loginPage.expectErrorMessage(/locked out/i);
});

test('Standard user can add to cart and logout', async ({ page }) => {
  loginPage = new LoginPage(page);
  productsPage = new ProductsPage(page);

  await loginPage.goto();
  await loginPage.loginStandardUser();
  await productsPage.verifyProductsPageLoaded();

  // Add to cart
  await productsPage.clickCart();

  // Then logout
  await productsPage.logout();
  
  await expect(page).toHaveURL(loginPage.loginUrl);
});
