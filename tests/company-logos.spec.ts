import { test, expect } from '@playwright/test';

// Company logos click test
// Edit BASE_URL to the page that contains your company logos.
// Edit LOGOS_SELECTOR to match the container/selector that wraps the logo links.
const BASE_URL = process.env.BASE_URL || 'https://playwright.dev/';
const LOGOS_SELECTOR = process.env.LOGOS_SELECTOR || '.company-logos, .partners, #partners, footer .partners';

test.describe('Company logos navigation', () => {
  test('each company logo has a valid href and navigates/can open a new tab', async ({ page, context }) => {
    await page.goto(BASE_URL);

    // Find all anchors within the container(s)
    const anchors = page.locator(`${LOGOS_SELECTOR} a`);
    const count = await anchors.count();
    test.skip(count === 0, `No anchors found using selector: ${LOGOS_SELECTOR}`);

    for (let i = 0; i < count; ++i) {
      const anchor = anchors.nth(i);
      const href = await anchor.getAttribute('href');
      // Ensure there is an href
      expect(href, `anchor[${i}] should have href`).toBeTruthy();

      // Resolve absolute URL for comparison when href is relative
      const absolute = new URL(href || '', BASE_URL).toString();

      // If the anchor opens in a new tab (target=_blank) then wait for page event
      const target = (await anchor.getAttribute('target')) || '';
      if (target === '_blank') {
        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          anchor.click({ button: 'middle' }).catch(() => anchor.click()),
        ]);
        await newPage.waitForLoadState('domcontentloaded');
        // Basic sanity: the opened page URL should contain the host of the href
        expect(newPage.url(), `expected opened page to include ${absolute}`).toContain(new URL(absolute).host);
        await newPage.close();
      } else {
        // Click and wait for navigation in the same page
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
          anchor.click().catch(() => {}),
        ]);
        // After navigation, page.url() should contain the host (handles absolute and relative href)
        expect(page.url(), `expected navigation to include ${absolute}`).toContain(new URL(absolute).host);
        // Go back to the base page to continue the loop
        await page.goto(BASE_URL);
      }
    }
  });
});
