class LoginPage {
constructor(page) {
    // Initialize page elements here    

    this.page = page;await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    this.LoginToGitHubURL=' https://github.com/microsoft/playwright'        
  
}
async LoginToGitHub() {
    await this.page.goto(this.LoginToGitHubURL);
    await this.page.getByRole('link', { name: 'Sign in' }).click();
    await this.page.getByLabel('Username or email address').fill('your-username');
    await page.getByRole('textbox', { name: 'Password' }).fill('your-password');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
}

}
module.exports = { LoginPage };    