import { test, expect, chromium } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
});

//Header link tests
test('Click on Playwright logo', async ({ page }) => {  
await page.getByRole('link', { name: 'Playwright logo Playwright' }).click();
await expect(page.getByRole('heading', { name: 'Playwright enables reliable end-to-end testing for modern web apps.' })).toBeVisible();
});

test('Go to Docs page', async ({ page }) => { 
await page.getByRole('link', { name: 'Docs' }).click();
await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('Go to API page', async ({ page }) => { 
await page.getByRole('link', { name: 'API' }).click();
await expect(page.getByRole('heading', { name: 'Playwright Library' })).toBeVisible();
}); 

//Work with dropdown menu
test(   'Select Python in the menu', async ({ page }) => {
await   page.getByRole('button', { name: 'Node.js' }).hover ()  ;  
await page.getByLabel('Main', { exact: true }).getByRole('link', { name: 'Python' }).click();
await   expect(page.getByRole('link', { name: 'Playwright logo Playwright' })).toBeVisible();
});


test('Go to Community page', async ({ page }) => {
await page.getByRole('link', { name: 'Community' }).click();
await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
}); 

test('Go to Github page', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage();
    await page.goto('https://playwright.dev/');
    await page.getByRole('link', { name: 'GitHub repository' }).click();

const [newPage] = await Promise.all([
    await context.waitForEvent("page"),
])
await expect(newPage).toHaveURL('https://github.com/microsoft/playwright')
await newPage.waitForLoadState  ();
newPage.close();
});

test('Go to Discord page', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage();
    await page.goto('https://playwright.dev/');
    await page.getByRole('link', { name: 'Discord server' }).click();

const [newPage] = await Promise.all([
    await context.waitForEvent("page"),
])

await expect(newPage).toHaveURL('https://discord.com/servers/playwright-807756831384403968') ;
await newPage.waitForLoadState();
newPage.close();
});

test('theme toggle sets dark/light/system and persists', async ({ page }) => {

  // Preferred locator: ARIA role + case-insensitive regex for the accessi
  const toggle = page.getByRole('button', { name: /switch between dark and light mode/i });

  // Wait till toggle is visible/enabled
  await expect(toggle).toBeVisible();

  // Click once -> expect light 
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  // Check persistence: localStorage or attribute
  const storedAfterLight = await page.evaluate(() => localStorage.getItem('theme'));
  // If your app uses 'dark'/'light' values; adapt assertion if it uses '1'/'0' or data-theme
  expect(storedAfterLight === 'light' || storedAfterLight === null || storedAfterLight === '').toBeTruthy();

  // Reload and assert the theme is still applied
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  // Click again -> expect dark (assuming toggle cycles)
  await toggle.click();
//   await expect(page.locator('html')).not.toHaveAttribute('color-scheme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const storedAfterDark = await page.evaluate(() => localStorage.getItem('theme'));
  expect(storedAfterDark === 'dark' || storedAfterDark === null).toBeTruthy()
});

// Search with dynamic dropdown list    
test('Search for a valid text ', async ({ page }) => { 
await page.getByRole('button', { name: "Search (Ctrl+K)"}).click();
const searchList = page.locator('#docsearch-input');
await searchList.clear({timeout:30000});
await searchList.pressSequentially('getBy', {delay:1000});
await page.locator('#docsearch-hits0-item-3').click();
await expect(page.getByRole('heading', { name: 'getByRole' })).toBeVisible();
});

//Body link tests
test('Click on Get started', async ({ page }) => { 
await page.getByRole('link', { name: "Get started"}).click();
await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('Click on Star button', async ({ browser }) => { 
     const context = await browser.newContext()
 const page = await context.newPage();
await page.goto('https://playwright.dev/');
await page.getByRole('link', { name: 'Star microsoft/playwright on' }).click();
const [newPage] = await Promise.all([
    await context.waitForEvent("page"),
])
await expect(newPage).toHaveURL('https://github.com/microsoft/playwright') ;
await newPage.waitForLoadState  ();
newPage.close();
});

test('Click on 78K button', async ({ browser }) => { 
     const context = await browser.newContext()
 const page = await context.newPage();
await page.goto('https://playwright.dev/');
await page.getByRole('link', { name: '78k+ stargazers on GitHub' }).click();
const [newPage] = await Promise.all([
    await context.waitForEvent("page"),
])
await expect(newPage).toHaveURL('https://github.com/microsoft/playwright/stargazers') ;
await newPage.waitForLoadState  ();
newPage.close();
});


//Click on company logos
// This way is for real click + new tab check=> This works safety
// There is another fast and stable way (no real click)
// No open content and page, then wait for logo is visable and getAttribute href to check url

test('Click on Company logo', async ({ browser }) => {
    test.setTimeout(60000);
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://playwright.dev/');

    const links = [
        // list of logo links to test
        { name: 'VS Code', expectedUrl: 'https://code.visualstudio.com/' },
        { name: 'Bing', expectedUrl: 'https://www.bing.com/', exact: true },
        { name: 'Outlook', expectedUrl: 'https://outlook.live.com/mail/' },
        { name: 'Disney+ Hotstar', expectedUrl:'https://www.hotstar.com/' },
        { name: 'Material UI', expectedUrl: 'https://github.com/mui/material-ui' },  
        { name: 'ING', expectedUrl: 'https://github.com/ing-bank/lion' , exact: true},
        { name: 'Adobe', expectedUrl: 'https://github.com/adobe/spectrum-web-components' },
        { name: 'React Navigation', expectedUrl: 'https://github.com/react-navigation/react-navigation'},
        { name: 'Accessibility Insights', expectedUrl: 'https://accessibilityinsights.io/' },
    
    ];

    for (const link of links) {
        const linkLocator = page.getByRole('link', { name: link.name, exact: true });
        
        await expect(linkLocator).toBeVisible({ timeout: 10000 });

        // detect whether the link opens in a new tab
        // const target = await linkLocator.getAttribute('target');

      
            const [newPage] = await Promise.all([
                //wait for new  page to open
                context.waitForEvent('page'),
                linkLocator.click(),
            ]);
            await newPage.waitForLoadState('domcontentloaded', { timeout: 20000 });

            await newPage.waitForEvent('load');

            await expect(newPage.url()).toContain(link.expectedUrl);
            await newPage.close();

        }
    });

//Test footer links 
//Learn
test('Footer link - Getting started', async ({ page }) => {                      
// await page.goto('https://playwright.dev/');
await page.getByRole('link', { name: 'Getting started' }).click();
await expect(page).toHaveURL('https://playwright.dev/docs/intro');
    }   );
// Community
test('Footer link - Stackoverflow', async ({ browser }) => { 
    const context = await browser.newContext();
    const page = await context.newPage();   
    await page.goto('https://playwright.dev/');

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.getByRole('link', { name: 'Stack Overflow' }).click() ,
    
    ]); 
    await expect(newPage).toHaveURL('https://stackoverflow.com/questions/tagged/playwright');              
    await newPage.close();
    }   );