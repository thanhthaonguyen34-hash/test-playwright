import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  readonly loginUrl = 'https://www.saucedemo.com/';
  readonly standardUsername = 'standard_user';
  readonly standardPassword = 'secret_sauce';
  readonly lockedOutUsername = 'locked_out_user';
  readonly problemUsername = 'problem_user';
  readonly performanceUsername = 'performance_glitch_user';
  readonly errorUser = 'error_user';

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto(this.loginUrl);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginStandardUser() {
    await this.login(this.standardUsername, this.standardPassword);
  }

  async loginLockedOutUser() {
    await this.login(this.lockedOutUsername, this.standardPassword);
  }
  async loginProblemUser() {
    await this.login(this.problemUsername, this.standardPassword);
  }

  async expectErrorMessage(message: string | RegExp) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(message);
  }
}
