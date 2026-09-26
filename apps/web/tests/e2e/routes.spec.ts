import { expect, test } from "@playwright/test";
import { setStoredTheme, waitForStaticDom } from "./helpers";

const SITE_ROUTES = [
  "/product/",
  "/product/agents/",
  "/product/security/",
  "/product/integrations/",
  "/downloads/",
  "/pricing/",
  "/about/",
  "/community/",
  "/resources/",
  "/resources/blog/",
  "/resources/changelog/",
  "/resources/guides/",
  "/resources/examples/",
  "/resources/blog/announcing-niki-0.7/",
  "/resources/blog/why-four-agents/",
  "/resources/guides/first-verified-branch/",
  "/resources/guides/provider-mixing/",
  "/resources/examples/health-endpoint/",
] as const;

function normalizePathname(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

for (const route of SITE_ROUTES) {
  test(`${route} preserves its exported page and canonical URL`, async ({ page }) => {
    await setStoredTheme(page, "dark");
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });

    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
    await waitForStaticDom(page);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    // The landing header is the only header on the site now, so inner routes
    // carry `data-testid="landing-header"` rather than a site-specific class.
    await expect(page.getByTestId("site-chrome")).toHaveCount(1);
    await expect(page.getByTestId("landing-header")).toHaveCount(1);
    await expect(page.getByTestId("landing-footer")).toHaveCount(1);
    await expect(page.locator(".ax-header__bar")).toHaveCount(0);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute("href");
    expect(canonicalHref).toBeTruthy();

    const canonicalPathname = new URL(canonicalHref!, page.url()).pathname;
    const routePathname = new URL(route, page.url()).pathname;
    expect(normalizePathname(canonicalPathname)).toBe(normalizePathname(routePathname));
  });
}

test("the landing route has exactly one main landmark", async ({ page }) => {
  await setStoredTheme(page, "dark");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForStaticDom(page);

  await expect(page.locator("main")).toHaveCount(1);
});

test("an unknown route serves the generated 404 document", async ({ page }) => {
  await setStoredTheme(page, "dark");
  const response = await page.goto("/this-route-must-not-exist/", {
    waitUntil: "domcontentloaded",
  });

  expect(response).not.toBeNull();
  expect(response!.status()).toBe(404);
  await waitForStaticDom(page);

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
});
