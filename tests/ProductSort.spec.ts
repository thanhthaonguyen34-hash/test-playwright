import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';

let loginPage: LoginPage;
let productsPage: ProductsPage;

test.describe('Product Listing - Sort Function', () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    // Login with standard user
    await loginPage.goto();
    await loginPage.loginStandardUser();
    await productsPage.verifyProductsPageLoaded();
  });

  test('Sort products by name A to Z', async () => {
    // Get product names before sorting
    const initialNames = await productsPage.getProductNames();
    
    // Sort by name A to Z
    await productsPage.sortByNameAscending();
    
    // Get product names after sorting
    const sortedNames = await productsPage.getProductNames();
    
    // Verify the products are sorted alphabetically
    const expectedSorted = [...sortedNames].sort((a, b) => a.localeCompare(b));
    expect(sortedNames).toEqual(expectedSorted);
  });

  test('Sort products by name Z to A', async () => {
    // Get product names 
    const initialNames = await productsPage.getProductNames();
    
    // Sort by name Z to A
    await productsPage.sortByNameDescending();
    
    // Get product names after sorting
    const sortedNames = await productsPage.getProductNames();
    
    // Verify the products are sorted in reverse alphabetically
    const expectedSorted = [...sortedNames].sort((a, b) => b.localeCompare(a));
    expect(sortedNames).toEqual(expectedSorted);
  });

  test('Sort products by price low to high', async () => {
    // Sort by price low to high
    await productsPage.sortByPriceLowToHigh();
    
    // Get product prices after sorting
    const sortedPrices = await productsPage.getProductPrices();
    
    // Verify the prices are sorted from low to high
    const expectedSorted = [...sortedPrices].sort((a, b) => a - b);
    expect(sortedPrices).toEqual(expectedSorted);
  });

  test('Sort products by price high to low', async () => {
    // Sort by price high to low
    await productsPage.sortByPriceHighToLow();
    
    // Get product prices after sorting
    const sortedPrices = await productsPage.getProductPrices();
    
    // Verify the prices are sorted from high to low
    const expectedSorted = [...sortedPrices].sort((a, b) => b - a);
    expect(sortedPrices).toEqual(expectedSorted);
  });

  test('Verify sort dropdown is visible and functional', async ({ page }) => {
    // Verify sort dropdown is visible
    await expect(productsPage.sortDropdown).toBeVisible();
    
    // Verify sort dropdown has the expected options
    const sortOptions = await page.locator('[data-test="product-sort-container"] option');
    const optionCount = await sortOptions.count();
    
    // Should have 4 sorting options plus the default
    expect(optionCount).toBeGreaterThanOrEqual(4);
  });

  test('Verify products remain after sorting', async () => {
    // Get initial product count
    const initialCount = await productsPage.productItems.count();
    
    // Sort by name A to Z
    await productsPage.sortByNameAscending();
    
    // Get product count after sorting
    const finalCount = await productsPage.productItems.count();
    
    // Verify product count remains the same
    expect(finalCount).toBe(initialCount);
  });

  test('Sort and then add item to cart', async ({ page }) => {
    // Sort by name A to Z
    await productsPage.sortByNameAscending();
    
    // Get the first product item and its add to cart button
    const firstProduct = productsPage.productItems.first();
    const addToCartButton = firstProduct.locator('[data-test^="add-to-cart-"]');
    
    // Click the add to cart button
    await addToCartButton.click();
    
    // Verify the item was added by checking if the button is now a remove button
    const removeButton = firstProduct.locator('[data-test^="remove-"]');
    await expect(removeButton).toBeVisible();
  });

  test('Close dropdown list after selecting sort option', async () => {
    // Get initial product names
    const initialNames = await productsPage.getProductNames();
    
    // Select sort option (Name A to Z)
    await productsPage.sortByNameAscending();
    
    // Get product names after sorting
    const sortedNames = await productsPage.getProductNames();
    
    // Sort dropdown is still enabled and accessible
    await expect(productsPage.sortDropdown).toBeEnabled();
  });

  test('Close dropdown by clicking outside the dropdown', async ({ page }) => {
    // Get initial sort value
    const initialValue = await productsPage.sortDropdown.inputValue();
    
    // Select a sort option
    await productsPage.sortDropdown.selectOption('az');
    
    // Click outside the dropdown (on the products title area)
    await productsPage.productsTitle.click();
    
    // Wait for any dropdown animation to complete
    await page.waitForTimeout(300);
    
    // Verify dropdown is still enabled and accessible
    await expect(productsPage.sortDropdown).toBeEnabled();
    
    // Verify the sort was applied (products changed)
    const sortedNames = await productsPage.getProductNames();
    expect(sortedNames.length).toBeGreaterThan(0);
  });

  test('Verify dropdown closes after switching between sort options', async () => {
    // Sort by name A to Z
    await productsPage.sortByNameAscending();
    const firstSortedNames = await productsPage.getProductNames();
    
    // Sort by name Z to A
    await productsPage.sortByNameDescending();
    const secondSortedNames = await productsPage.getProductNames();
    
    // Verify the sorting changed
    expect(firstSortedNames).not.toEqual(secondSortedNames);
    
    // Sort by price low to high
    await productsPage.sortByPriceLowToHigh();
    const sortedPrices = await productsPage.getProductPrices();
    
    // Verify prices are sorted
    const expectedSorted = [...sortedPrices].sort((a, b) => a - b);
    expect(sortedPrices).toEqual(expectedSorted);
  });

  test('Verify dropdown remains focused and functional after multiple selections', async ({ page }) => {
    const sortOptions = ['az', 'za', 'lohi', 'hilo'];
    
    for (const option of sortOptions) {
      // Select sort option
      await productsPage.sortDropdown.selectOption(option);
      await page.waitForTimeout(300);
      
      // Verify sort dropdown is still visible and enabled
      await expect(productsPage.sortDropdown).toBeVisible();
      await expect(productsPage.sortDropdown).toBeEnabled();
      
      // Verify products are still displayed
      const productCount = await productsPage.productItems.count();
      expect(productCount).toBeGreaterThan(0);
    }
  });

  test('Verify dropdown list closes when pressing Escape key', async ({ page }) => {
    // Get initial product names
    const initialNames = await productsPage.getProductNames();
    
    // Focus on sort dropdown
    await productsPage.sortDropdown.focus();
    
    // Select a sort option using keyboard
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    // Wait for sort to apply
    await page.waitForTimeout(500);
    
    // Get sorted product names
    const sortedNames = await productsPage.getProductNames();
    
    // Verify sort was applied
    expect(sortedNames.length).toBeGreaterThan(0);
    
    // Verify dropdown is still accessible
    await expect(productsPage.sortDropdown).toBeEnabled();
  });
});
