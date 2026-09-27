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

/* The inner pages carry their own chrome but no motion rules of their own: they
   are covered by the blanket `*` rule in globals.css rather than by a scoped
   block like the landing's. That works today, and nothing would catch the day
   someone deletes the blanket rule or a route grows an animation of its own, so
   it is asserted across every route rather than left to a one-off audit. */
test("every route stills its motion when the reader asks for less of it", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await setStoredTheme(page, "dark");

  const offenders: Array<{
    route: string;
    className: string;
    transition: string;
    animation: string;
  }> = [];

  for (const route of ["/", ...SITE_ROUTES]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await waitForStaticDom(page);

    const moving = await page.evaluate(() =>
      [...document.querySelectorAll("a, button, [class*='ax-'], canvas")]
        .map((element) => {
          const style = window.getComputedStyle(element);
          return {
            className: (element.getAttribute("class") ?? element.tagName).slice(0, 60),
            transition: style.transitionDuration,
            animation: style.animationDuration,
          };
        })
        .filter(
          ({ transition, animation }) =>
            parseFloat(transition) > 0.002 || parseFloat(animation) > 0.002
        )
    );

    for (const entry of moving) offenders.push({ route, ...entry });

    /* A reveal that stays at opacity 0 is a page whose content never arrives,
       which is the same failure wearing a different hat. */
    const stranded = await page.evaluate(
      () =>
        [...document.querySelectorAll(".ax-reveal, .ax-line")].filter((element) => {
          const style = window.getComputedStyle(element);
          return style.opacity === "0" || style.visibility === "hidden";
        }).length
    );
    expect(stranded, `${route} leaves ${stranded} reveal(s) hidden under reduced motion`).toBe(0);
  }

  expect(offenders).toEqual([]);
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
