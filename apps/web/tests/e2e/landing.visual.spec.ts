import { expect, test } from "@playwright/test";
import {
  collectVisibleOverflow,
  expectNoSeriousAxeViolations,
  setStoredTheme,
  waitForLanding,
} from "./helpers";

const VIEWPORTS = [
  { width: 1440, height: 1000, name: "desktop" },
  { width: 834, height: 1112, name: "tablet" },
  { width: 390, height: 844, name: "mobile" },
] as const;

const THEMES = ["light", "dark"] as const;

test.use({ reducedMotion: "reduce" });

for (const viewport of VIEWPORTS) {
  for (const theme of THEMES) {
    test(`landing ${viewport.name} ${theme} matches the approved baseline`, async ({ page }) => {
      await setStoredTheme(page, theme);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await waitForLanding(page);

      expect(await page.evaluate(() => window.devicePixelRatio)).toBe(1);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await collectVisibleOverflow(page)).toEqual([]);

      const widths = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(widths.scroll).toBeLessThanOrEqual(widths.client);

      await expect(page).toHaveScreenshot(`landing-${viewport.name}-${theme}.png`, {
        fullPage: true,
        animations: "disabled",
        scale: "css",
        // Not 0, and the reason is specific rather than a general loosening. The
        // hero background is a live WebGL canvas, and a driver's rounding when
        // compositing one is not bit-stable between runs. Measured over repeated
        // runs of this exact test, on an otherwise idle machine and under load:
        // 1.3k, 5.0k, 5.4k and 10.6k differing pixels, always at one or two units
        // per channel and always along the gradient's band edges. The
        // inner-route baselines below stay at 0 because those pages carry no
        // canvas.
        //
        // 15000 is ~0.13% of the desktop image. The smallest real regression this
        // suite is meant to catch, a nav gap closing by 4px, moves well over
        // 100k pixels, so this cannot hide one.
        maxDiffPixels: 15000,
      });
    });
  }
}

/* Representative coverage of the inner routes.
 *
 * The landing has its own token scope, so a change to the shared palette or to
 * the chrome can pass the landing baselines and still break every other page.
 * These pin the two page shapes the inner routes actually use (a long
 * multi-band product page and a short index page) in both themes. */
const INNER_ROUTES = [
  { route: "/product/", slug: "product" },
  { route: "/pricing/", slug: "pricing" },
  { route: "/resources/changelog/", slug: "changelog" },
] as const;

for (const { route, slug } of INNER_ROUTES) {
  for (const theme of THEMES) {
    test(`inner ${slug} ${theme} matches the approved baseline`, async ({ page }) => {
      await setStoredTheme(page, theme);
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await waitForLanding(page);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.getByTestId("landing-header")).toHaveCount(1);
      await expect(page.getByTestId("landing-footer")).toHaveCount(1);
      expect(await collectVisibleOverflow(page)).toEqual([]);
      await expectNoSeriousAxeViolations(page);

      await expect(page).toHaveScreenshot(`inner-${slug}-${theme}.png`, {
        fullPage: true,
        animations: "disabled",
        scale: "css",
        maxDiffPixels: 0,
      });
    });
  }
}

/* The landing token scope must not leak into the inner pages, and the shared
 * palette must not drift back to the old cool greys. */
test("the shared palette is the same warm system on both route groups", async ({ page }) => {
  await setStoredTheme(page, "dark");

  const readPalette = async (route: string) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    return page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        background: style.getPropertyValue("--background").trim(),
        foreground: style.getPropertyValue("--foreground").trim(),
        card: style.getPropertyValue("--card").trim(),
        border: style.getPropertyValue("--border").trim(),
        accent: style.getPropertyValue("--orange-9").trim(),
      };
    });
  };

  const landing = await readPalette("/");
  const inner = await readPalette("/product/");

  expect(inner).toEqual(landing);
  expect(landing).toEqual({
    background: "#14120b",
    foreground: "#edecec",
    card: "#1b1913",
    border: "#201e19",
    accent: "#f54e00",
  });
});
