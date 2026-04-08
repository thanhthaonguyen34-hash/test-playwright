import { expect, Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly productsTitle: Locator;
  readonly cartIcon: Locator;
  readonly sortDropdown: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly loginUrl = 'https://www.saucedemo.com/';

  constructor(page: Page) {
    this.page = page;
    
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.productsTitle = page.locator('.title');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.productItems = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
  }

  async logout() {
    // Click menu button
    await this.menuButton.click();
    // Wait for menu to open
    await this.page.waitForTimeout(500);
    // Click logout link
    await this.logoutLink.click();
    // Verify logged out - should redirect to login page
    await expect(this.page).toHaveURL(this.loginUrl);
  }

  async verifyProductsPageLoaded() {
    await expect(this.productsTitle).toHaveText('Products');
  }

  async clickCart() {
    await this.cartIcon.click();
  }

  async addItemToCart(itemName: string) {
    const itemButton = this.page.locator(`[data-test="add-to-cart-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`);
    await itemButton.click();
  }

  async addBackpackToCart() {
    await this.addItemToCart('sauce-labs-backpack');
  }

  async addBikeLightToCart() {
    await this.addItemToCart('sauce-labs-bike-light');
  }

  async sortBy(option: string) {
    // option can be: 'az' (A to Z), 'za' (Z to A), 'lohi' (Low to High), 'hilo' (High to Low)
    await this.sortDropdown.selectOption(option);
    // Wait for sorting to complete
    await this.page.waitForTimeout(500);
  }

  async sortByNameAscending() {
    await this.sortBy('az');
  }

  async sortByNameDescending() {
    await this.sortBy('za');
  }

  async sortByPriceLowToHigh() {
    await this.sortBy('lohi');
  }

  async sortByPriceHighToLow() {
    await this.sortBy('hilo');
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.productNames.allTextContents();
    return names;
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.productPrices.allTextContents();
    return prices.map(price => parseFloat(price.replace('$', '')));
  }
}
