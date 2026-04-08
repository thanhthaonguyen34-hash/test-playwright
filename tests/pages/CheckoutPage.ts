import { expect, Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // Cart page locators
  readonly cartTitle: Locator;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;

  // Checkout step one locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;

  // Checkout step two locators
  readonly checkoutSummary: Locator;
  readonly finishButton: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;

  // Checkout complete locators
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Cart page
    this.cartTitle = page.locator('.title');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('.cart_item');

    // Checkout step one
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');

    // Checkout step two
    this.checkoutSummary = page.locator('.checkout_summary_container');
    this.finishButton = page.locator('[data-test="finish"]');
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');

    // Checkout complete
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async verifyCartPageLoaded() {
    await expect(this.cartTitle).toHaveText('Your Cart');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async verifyCheckoutStepTwoLoaded() {
    await expect(this.checkoutSummary).toBeVisible();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async verifyCheckoutComplete() {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
    await expect(this.completeText).toContainText('Your order has been dispatched');
  }

  async backToProducts() {
    await this.backHomeButton.click();
  }

  async getItemCount() {
    return await this.cartItems.count();
  }

  async getItemTotal() {
    const text = await this.itemTotal.textContent();
    return text ? parseFloat(text.replace('Item total: $', '')) : 0;
  }

  async getTax() {
    const text = await this.tax.textContent();
    return text ? parseFloat(text.replace('Tax: $', '')) : 0;
  }

  async getTotal() {
    const text = await this.total.textContent();
    return text ? parseFloat(text.replace('Total: $', '')) : 0;
  }
}