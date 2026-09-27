import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

const MEDIA_READY_TIMEOUT_MS = 10_000;

export async function waitForStaticDom(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("header").first()).toBeVisible();
}

export async function waitForLanding(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForLoadState("networkidle");
  await page.evaluate(
    async ({ timeoutMs }) => {
      const withTimeout = <T>(promise: Promise<T>, label: string): Promise<T> => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const timeout = new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error(`Timed out waiting for ${label}`)), timeoutMs);
        });
        return Promise.race([promise, timeout]).finally(() => {
          if (timer) clearTimeout(timer);
        });
      };

      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images, async (image) => {
          const source = image.currentSrc || image.src;
          if (!source) return;

          if (!image.complete) {
            await withTimeout(
              new Promise<void>((resolve, reject) => {
                const cleanup = () => {
                  image.removeEventListener("load", onLoad);
                  image.removeEventListener("error", onError);
                };
                const onLoad = () => {
                  cleanup();
                  resolve();
                };
                const onError = () => {
                  cleanup();
                  reject(new Error(`Image failed to load: ${source}`));
                };
                image.addEventListener("load", onLoad, { once: true });
                image.addEventListener("error", onError, { once: true });
                if (image.complete) onLoad();
              }),
              `image load ${source}`
            );
          }

          if (typeof image.decode === "function") {
            await withTimeout(image.decode(), `image decode ${source}`);
          }
        })
      );

      for (const animation of document.getAnimations()) {
        animation.pause();
      }
      for (const video of document.querySelectorAll("video")) {
        video.pause();
        if (video.currentSrc || video.src) video.currentTime = 0;
      }
    },
    { timeoutMs: MEDIA_READY_TIMEOUT_MS }
  );

  await page.waitForFunction(
    () =>
      Array.from(document.querySelectorAll("video")).every((element) => {
        const video = element as HTMLVideoElement;
        return !video.currentSrc && !video.src
          ? true
          : video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
              !video.seeking &&
              video.currentTime === 0;
      }),
    undefined,
    { timeout: MEDIA_READY_TIMEOUT_MS }
  );
}

export async function setStoredTheme(page: Page, theme: "light" | "dark"): Promise<void> {
  await page.addInitScript((storedTheme) => {
    if (!window.localStorage.getItem("niki-theme")) {
      window.localStorage.setItem("niki-theme", storedTheme);
    }
  }, theme);
}

/**
 * The landing reveals each section on scroll, so a section below the fold is
 * deliberately `opacity: 0` until it enters the viewport. Assertions that read
 * content, the accessibility tree, or an element box need that reveal to have
 * happened first, exactly as it would for a person scrolling the page.
 *
 * Runs only when motion is allowed; under reduced motion the reveal never
 * applies, so the page is already fully visible and this is a no-op.
 */
export async function revealAllSections(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    const total = document.documentElement.scrollHeight;

    for (let y = 0; y <= total; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 60));
    }

    window.scrollTo(0, total);
    await new Promise((resolve) => window.setTimeout(resolve, 120));
    window.scrollTo(0, 0);
    await new Promise((resolve) => window.setTimeout(resolve, 60));
  });
}

/**
 * A box may sit a hair outside the viewport and still be flush.
 *
 * `getBoundingClientRect` returns fractional CSS pixels, and a full-width
 * element measured as 1280.00006px in a 1280px viewport is not overflowing by
 * anything a reader could see — it is a rounding artefact from the compositor.
 * Without a tolerance the overflow suite fails intermittently under load, when
 * layout lands on a different subpixel. Half a pixel is the right size for the
 * allowance: it is below any real layout regression, which the suite's own
 * fixtures stage at 20px, and above the float noise that causes the flake.
 */
const OVERFLOW_TOLERANCE = 0.5;

export async function collectVisibleOverflow(page: Page): Promise<
  Array<{
    tag: string;
    className: string;
    left: number;
    right: number;
  }>
> {
  return page.locator("body *").evaluateAll((elements, tolerance) => {
    const viewportWidth = document.documentElement.clientWidth;
    const isInsideHorizontalScroller = (element: Element) => {
      let parent = element.parentElement;
      while (parent && parent !== document.body) {
        const style = window.getComputedStyle(parent);
        if (
          (style.overflowX === "auto" || style.overflowX === "scroll") &&
          parent.scrollWidth > parent.clientWidth
        ) {
          return true;
        }
        parent = parent.parentElement;
      }
      return false;
    };

    return elements.flatMap((element) => {
      const style = window.getComputedStyle(element);
      const box = element.getBoundingClientRect();
      const visible =
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.visibility !== "collapse" &&
        Number(style.opacity) > 0 &&
        box.width > 0 &&
        box.height > 0;

      if (!visible || (box.left >= -tolerance && box.right <= viewportWidth + tolerance)) {
        return [];
      }

      if (isInsideHorizontalScroller(element)) {
        return [];
      }

      // Ignore visually hidden 1x1 skip-link geometry (any element with left: -1, right: 0)
      if (box.width === 1 && box.height === 1 && box.left < 0 && box.right === 0) {
        return [];
      }

      return [
        {
          tag: element.tagName.toLowerCase(),
          className: element.getAttribute("class") ?? "",
          left: box.left,
          right: box.right,
        },
      ];
    });
  }, OVERFLOW_TOLERANCE);
}

export async function expectNoSeriousAxeViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical"
  );
  expect(blocking).toEqual([]);
}
