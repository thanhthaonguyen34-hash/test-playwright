import { test, expect, chromium } from '@playwright/test';
const LoginPage= require("../pages/LoginPage");
//https://www.youtube.com/watch?v=4aiu6pRE0YQ&list=PL6flErFppaj0iQG2_Dd72Jz0bfrzZwMZH
test.beforeEach(async ({ page }) => {
   const loginPage = new LoginPage(page);  
    await loginPage.LoginToGitHub();  
});

test('Verify successful login', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'your-username' })).toBeVisible();
});     