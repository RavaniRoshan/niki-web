import { expect, test, type Page } from "@playwright/test";
import { setStoredTheme, waitForStaticDom } from "./helpers";

/* The header and the closing portal are the two pieces whose behaviour is not
   visible in a static baseline: one depends on scroll position and measurement,
   the other on the document font and the reduced-motion setting. Both are
   asserted here instead. */

async function openLanding(page: Page) {
  await setStoredTheme(page, "dark");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForStaticDom(page);
}

const trigger = (page: Page, label: string) => page.getByTestId(`nav-trigger-${label}`);
const panel = (page: Page, label: string) => page.getByTestId(`mega-panel-${label}`);

test.describe("the mega-menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openLanding(page);
  });

  test("every nav entry exposes a panel with real, resolvable destinations", async ({ page }) => {
    for (const label of ["product", "agents", "security", "integrations", "changelog"]) {
      const button = trigger(page, label);
      await expect(button).toHaveAttribute("aria-expanded", "false");
      await expect(button).toHaveAttribute("aria-controls", /.+/);

      await button.click();
      const open = panel(page, label);
      await expect(button).toHaveAttribute("aria-expanded", "true");
      await expect(open).toBeVisible();
      await expect(open).toHaveAttribute("aria-hidden", "false");

      /* The panel's id is the one the trigger controls. */
      const controls = await button.getAttribute("aria-controls");
      expect(await open.getAttribute("id")).toBe(controls);

      const links = open.getByRole("link");
      expect(await links.count()).toBeGreaterThanOrEqual(5);
      for (const href of await links.evaluateAll((nodes) =>
        nodes.map((node) => (node as HTMLAnchorElement).getAttribute("href") ?? "")
      )) {
        expect(href).toMatch(/^(\/|https:\/\/)/);
      }
    }
  });

  test("opens on keyboard focus as well as on hover", async ({ page }) => {
    await trigger(page, "security").focus();
    await expect(trigger(page, "security")).toHaveAttribute("aria-expanded", "true");
    await expect(panel(page, "security")).toBeVisible();

    await page.mouse.move(700, 700);
    await trigger(page, "agents").hover();
    await expect(trigger(page, "agents")).toHaveAttribute("aria-expanded", "true");
    await expect(trigger(page, "security")).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape closes the panel and returns focus to its trigger", async ({ page }) => {
    const button = trigger(page, "integrations");
    await button.click();
    await expect(panel(page, "integrations")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(panel(page, "integrations")).toBeHidden();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
  });

  test("a closed panel keeps its links out of the tab order", async ({ page }) => {
    const open = panel(page, "product");
    await expect(open).toBeHidden();
    /* visibility:hidden is what removes them; aria-hidden alone would not. */
    expect(await open.evaluate((node) => getComputedStyle(node).visibility)).toBe("hidden");
  });

  test("a click outside the header closes the panel", async ({ page }) => {
    await trigger(page, "agents").click();
    await expect(panel(page, "agents")).toBeVisible();

    await page.locator("main").click({ position: { x: 20, y: 400 } });
    await expect(panel(page, "agents")).toBeHidden();
  });

  test("the panel hangs below the bar rather than inside it", async ({ page }) => {
    await trigger(page, "product").click();
    const geometry = await page.getByTestId("landing-header").evaluate((element) => {
      const bar = element.firstElementChild as HTMLElement;
      const open = element.querySelector('[data-testid="mega-panel-product"]') as HTMLElement;
      return {
        barBottom: Math.round(bar.getBoundingClientRect().bottom),
        panelTop: Math.round(open.getBoundingClientRect().top),
        barLeft: Math.round(bar.getBoundingClientRect().left),
        barWidth: Math.round(bar.getBoundingClientRect().width),
        panelWidth: Math.round(open.getBoundingClientRect().width),
      };
    });
    expect(geometry.panelTop).toBeGreaterThanOrEqual(geometry.barBottom);
    /* The panel is the bar's own width, so it reads as one object. */
    expect(geometry.panelWidth).toBe(geometry.barWidth);
    expect(geometry.barLeft).toBeGreaterThanOrEqual(0);
  });

  test("the desktop nav is replaced by the mobile sheet below the collapse point", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1100, height: 900 });
    await expect(trigger(page, "product")).toBeHidden();
    await expect(page.getByTestId("mobile-nav-trigger")).toBeVisible();
  });

  test("a click never snatches a panel away a hover just opened", async ({ page }) => {
    await trigger(page, "product").hover();
    await expect(trigger(page, "product")).toHaveAttribute("aria-expanded", "true");

    /* With a real pointer, moving onto a trigger is what opens the panel, so a
       click on the open trigger is open-only rather than a toggle. */
    await trigger(page, "product").click();
    await expect(trigger(page, "product")).toHaveAttribute("aria-expanded", "true");
    await expect(panel(page, "product")).toBeVisible();

    /* Leaving it closes it, which is the other way out. */
    await page.mouse.move(700, 700);
    await expect(panel(page, "product")).toBeHidden();
  });
});

test.describe("the mega-menu on a touch pointer", () => {
  test.use({ hasTouch: true, isMobile: true });

  test("a tap opens and a second tap closes, because there is no hover to lean on", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openLanding(page);

    const button = trigger(page, "integrations");
    await button.tap();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(panel(page, "integrations")).toBeVisible();

    await button.tap();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(panel(page, "integrations")).toBeHidden();
  });
});

test.describe("the closing portal", () => {
  test("mounts, pins the camera on a stem, and collapses under reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openLanding(page);
    await page.locator("[data-gp-pin]").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-gp-ready='true']")).toHaveCount(1);

    const state = () =>
      page.locator("section[id^='gp-']").evaluate((node) => {
        const element = node as HTMLElement;
        const content = element.querySelector("[data-gp-content]") as HTMLElement;
        return {
          motion: element.dataset.gpMotion,
          focus: element.dataset.gpFocus,
          ready: element.dataset.gpReady,
          text: element.getAttribute("aria-label"),
          contentOpacity: getComputedStyle(content).opacity,
          contentMarginTop: getComputedStyle(content).marginTop,
        };
      });

    const reduced = await state();
    expect(reduced.ready).toBe("true");
    /* The word is the product name and the camera lands on its second i, a stem,
       so the cut is a clean rectangle rather than a ragged diagonal. */
    expect(reduced.text).toBe("Niki");
    expect(reduced.focus).toBe("i");
    expect(reduced.motion).toBe("off");
    /* No scroll runway when motion is off, or the page would end in dead space. */
    expect(reduced.contentMarginTop).toBe("0px");
    expect(Number(reduced.contentOpacity)).toBe(1);
  });

  test("reserves a scroll runway and reveals its content only once entered", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openLanding(page);
    await page.locator("[data-gp-pin]").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-gp-ready='true']")).toHaveCount(1);

    const element = page.locator("section[id^='gp-']");
    await expect(element).toHaveAttribute("data-gp-motion", "on");

    const before = await page
      .locator("[data-gp-content]")
      .evaluate((node) => getComputedStyle(node).marginTop);
    expect(parseFloat(before)).toBeGreaterThan(400);
    await expect(element).toHaveAttribute("data-gp-entered", "false");

    /* Scrolling the runway drives the camera and opens the panel. */
    const pin = page.locator("[data-gp-pin]");
    await pin.evaluate((node) => {
      const section = node.closest("section") as HTMLElement;
      const travel = parseFloat(getComputedStyle(section).getPropertyValue("--gp-length")) || 1;
      const height = section.clientHeight * travel;
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + height * 0.98);
    });

    await expect(element).toHaveAttribute("data-gp-entered", "true", { timeout: 10_000 });
    await expect(page.getByTestId("portal-title")).toBeVisible();
  });

  test("the reveal sits above the footer rather than replacing it", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openLanding(page);
    /* The portal is gated on the document font, so it is not in the DOM until
       that resolves. Asserting order before it mounts reads a null. */
    await expect(page.locator("section[id^='gp-']")).toHaveCount(1);
    const order = await page.evaluate(() => {
      const portal = document.querySelector("section[id^='gp-']");
      const footer = document.querySelector("footer");
      if (!portal || !footer) return null;
      return {
        portalBeforeFooter:
          portal.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING ? true : false,
        footerText: footer.textContent?.trim().slice(0, 40) ?? "",
      };
    });
    expect(order).not.toBeNull();
    expect(order!.portalBeforeFooter).toBe(true);
    expect(order!.footerText.length).toBeGreaterThan(0);
  });
});
