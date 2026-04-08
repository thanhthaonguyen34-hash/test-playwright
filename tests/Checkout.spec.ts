import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';
import { CheckoutPage } from './pages/CheckoutPage';

let loginPage: LoginPage;
let productsPage: ProductsPage;
let checkoutPage: CheckoutPage;

test.describe('Checkout Process', () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    checkoutPage = new CheckoutPage(page);

    // Login first
    await loginPage.goto();
    await loginPage.loginStandardUser();
    await productsPage.verifyProductsPageLoaded();
  });

  test('Complete checkout process with one item', async ({ page }) => {
    // Add item to cart
    await productsPage.addBackpackToCart();

    // Go to cart
    await productsPage.clickCart();
    await checkoutPage.verifyCartPageLoaded();

    // Verify item is in cart
    expect(await checkoutPage.getItemCount()).toBe(1);

    // Proceed to checkout
    await checkoutPage.proceedToCheckout();

    // Fill checkout information
    await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');

    // Verify checkout step two loaded
    await checkoutPage.verifyCheckoutStepTwoLoaded();

    // Finish checkout
    await checkoutPage.finishCheckout();

    // Verify checkout complete
    await checkoutPage.verifyCheckoutComplete();
  });

  test('Complete checkout process with multiple items', async ({ page }) => {
    // Add multiple items to cart
    await productsPage.addBackpackToCart();
    await productsPage.addBikeLightToCart();

    // Go to cart
    await productsPage.clickCart();
    await checkoutPage.verifyCartPageLoaded();

    // Verify items are in cart
    expect(await checkoutPage.getItemCount()).toBe(2);

    // Proceed to checkout
    await checkoutPage.proceedToCheckout();

    // Fill checkout information
    await checkoutPage.fillCheckoutInformation('Jane', 'Smith', '67890');

    // Verify checkout step two loaded
    await checkoutPage.verifyCheckoutStepTwoLoaded();

    // Verify totals are calculated
    const itemTotal = await checkoutPage.getItemTotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    expect(itemTotal).toBeGreaterThan(0);
    expect(tax).toBeGreaterThan(0);
    expect(total).toBe(itemTotal + tax);

    // Finish checkout
    await checkoutPage.finishCheckout();

    // Verify checkout complete and return to products
    await checkoutPage.verifyCheckoutComplete();
    await checkoutPage.backToProducts();
    await productsPage.verifyProductsPageLoaded();
  });

  test('Cancel checkout from cart', async ({ page }) => {
    // Add item to cart
    await productsPage.addBackpackToCart();

    // Go to cart
    await productsPage.clickCart();
    await checkoutPage.verifyCartPageLoaded();
    await checkoutPage.proceedToCheckout();

    // Cancel checkout - should return to products
    await checkoutPage.cancelButton.click();
    await checkoutPage.verifyCartPageLoaded();
  });
});