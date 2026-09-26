import { expect, test, type Page } from "@playwright/test";
import {
  BACKENDS,
  EVIDENCE_FILES,
  HERO,
  INSTALL_COMMAND,
  PROVIDERS,
  STAGES,
} from "../../src/components/landing/content";
import { INSTALLERS } from "../../src/data/release";
import {
  collectVisibleOverflow,
  expectNoSeriousAxeViolations,
  revealAllSections,
  setStoredTheme,
  waitForStaticDom,
} from "./helpers";

/* Layout is sub-pixel, so a 44 px control can measure 43.99999. Tolerance of half
   a pixel keeps the assertion honest about the 44 px floor without failing on
   float noise. */
const TOUCH_TARGET_PX = 44;
const TOUCH_TOLERANCE = 0.5;

const RESPONSIVE_VIEWPORTS = [
  { width: 1440, height: 1000 },
  { width: 1280, height: 800 },
  { width: 834, height: 1112 },
  { width: 390, height: 844 },
] as const;

const EXPECTED_PROVIDERS = [
  { name: "Anthropic", logo: "/logos/anthropic.svg", width: 16, height: 16 },
  { name: "OpenAI", logo: "/logos/openai.svg", width: 16, height: 16 },
  { name: "Google", logo: "/logos/google.svg", width: 32, height: 32 },
  { name: "Ollama", logo: "/logos/ollama.svg", width: 16, height: 16 },
  { name: "OpenRouter", logo: "/logos/openrouter.svg", width: 16, height: 16 },
  { name: "OpenCode Zen", logo: "/logos/opencode.svg", width: 512, height: 512 },
  { name: "Kimi Code", logo: "/logos/kimi.svg", width: 16, height: 16 },
  { name: "Kilo Code", logo: "/logos/kilocode.svg", width: 16, height: 16 },
  { name: "NVIDIA", logo: "/logos/nvidia.svg", width: 16, height: 16 },
  { name: "Groq", logo: "/logos/groq.svg", width: 16, height: 16 },
  { name: "Together", logo: "/logos/together.svg", width: 16, height: 16 },
  { name: "DeepSeek", logo: "/logos/deepseek.svg", width: 16, height: 16 },
] as const;

async function openLanding(page: Page, theme: "light" | "dark" = "dark") {
  await setStoredTheme(page, theme);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForStaticDom(page);
}

async function leaveLandingThroughHeader(page: Page): Promise<void> {
  await page.getByTestId("landing-header").getByRole("link", { name: "Download" }).click();
  await expect(page).toHaveURL(/\/downloads\/$/);
}

for (const theme of ["light", "dark"] as const) {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ] as const) {
    test(`landing has no serious Axe violations at ${viewport.width} in ${theme}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await openLanding(page, theme);
      await revealAllSections(page);
      await expectNoSeriousAxeViolations(page);
    });
  }
}

test("the landing route uses the rebuilt landing shell", async ({ page }) => {
  await openLanding(page);

  await expect(page.getByTestId("landing-shell")).toBeVisible();
  await expect(page.getByTestId("landing-header")).toBeVisible();
  await expect(page.getByTestId("landing-footer")).toBeVisible();
  await expect(page.locator(".ax-header__bar")).toHaveCount(0);
  await expect(page.locator("h1")).toHaveCount(1);
});

test("the landing uses its own social image without changing inner-route defaults", async ({
  page,
  request,
}) => {
  await openLanding(page);

  const openGraph = page.locator('meta[property="og:image"]');
  const twitter = page.locator('meta[name="twitter:image"]');
  await expect(openGraph).toHaveAttribute("content", /\/landing\/og\.png$/);
  await expect(twitter).toHaveAttribute("content", /\/landing\/og\.png$/);

  const image = await request.get("/landing/og.png");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");

  await leaveLandingThroughHeader(page);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\.png$/);
});

test("the landing footer presents five link groups and a legal row", async ({ page }) => {
  await openLanding(page);

  const footer = page.getByTestId("landing-footer");
  for (const heading of ["Product", "Resources", "Project", "Legal", "Connect"]) {
    await expect(footer.getByRole("heading", { name: heading })).toBeVisible();
  }
  await expect(footer).toContainText("Apache-2.0");
  await expect(footer).toContainText("No telemetry");
  await expect(footer).toContainText("BYOK");
});

test("the landing route exposes one set of landmarks and a focusable skip target", async ({
  page,
}) => {
  await openLanding(page);

  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator("main#main")).toHaveAttribute("tabindex", "-1");

  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await skipLink.focus();
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("desktop navigation stays on one line and mobile navigation is hidden", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav).toBeVisible();
  const linkTops = await nav
    .locator("a")
    .evaluateAll((links) => links.map((link) => Math.round(link.getBoundingClientRect().top)));
  expect(new Set(linkTops).size).toBe(1);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(nav).toBeHidden();
  await expect(page.getByTestId("mobile-nav-trigger")).toBeVisible();
});

test("the mobile dialog enters focus and returns it after Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openLanding(page);

  const trigger = page.getByTestId("mobile-nav-trigger");
  const dialog = page.getByTestId("mobile-nav-dialog");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toHaveAttribute("aria-controls", "mobile-nav-dialog");
  await expect(dialog).toBeHidden();

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(":focus")).toHaveCount(1);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("the in-dialog close control closes the dialog and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openLanding(page);

  const trigger = page.getByTestId("mobile-nav-trigger");
  const dialog = page.getByTestId("mobile-nav-dialog");
  const close = page.getByTestId("mobile-nav-close");
  await expect(close).toBeHidden();

  await trigger.click();
  await expect(close).toBeVisible();
  await expect(close).toHaveAttribute("aria-label", "Close navigation");
  await expect(close).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-label", "Open navigation");
  await expect(trigger).not.toHaveAttribute("data-open", "true");

  const box = await close.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(TOUCH_TARGET_PX - TOUCH_TOLERANCE);
  expect(box!.height).toBeGreaterThanOrEqual(TOUCH_TARGET_PX - TOUCH_TOLERANCE);

  await close.click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("dialog padding stays open while an outside click closes it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openLanding(page);

  const trigger = page.getByTestId("mobile-nav-trigger");
  const dialog = page.getByTestId("mobile-nav-dialog");
  await trigger.click();
  await expect(dialog).toBeVisible();

  const dialogBox = await dialog.boundingBox();
  expect(dialogBox).not.toBeNull();
  await page.mouse.click(5, dialogBox!.y + 5);
  await expect(dialog).toBeVisible();

  await page.mouse.click(dialogBox!.x + dialogBox!.width / 2, Math.max(0, dialogBox!.y - 20));
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("the theme toggle persists its selection across reload", async ({ page }) => {
  await openLanding(page, "dark");

  const toggle = page.getByTestId("theme-toggle");
  await expect(toggle).toHaveAttribute("aria-label", "Switch to light mode");
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/light/);
  expect(await page.evaluate(() => localStorage.getItem("niki-theme"))).toBe("light");

  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForStaticDom(page);
  await expect(page.locator("html")).toHaveClass(/light/);
  await expect(page.getByTestId("theme-toggle")).toHaveAttribute(
    "aria-label",
    "Switch to dark mode"
  );
});

test("mobile header controls meet the 44px touch target", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openLanding(page);

  await expect(page.getByTestId("theme-toggle")).toBeVisible();
  for (const locator of [
    page.getByTestId("theme-toggle"),
    page.getByTestId("mobile-nav-trigger"),
  ]) {
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(TOUCH_TARGET_PX - TOUCH_TOLERANCE);
    expect(box!.height).toBeGreaterThanOrEqual(TOUCH_TARGET_PX - TOUCH_TOLERANCE);
  }
});

test("landing content data deeply locks the source-backed truth", () => {
  expect(HERO.title).toBe("Niki is your coding agent for building software you can review.");
  expect(HERO.primaryAction).toEqual({ label: "Download for Linux", href: "/downloads" });
  expect(HERO.secondaryAction.label).toBe("Read the docs");
  expect(STAGES).toEqual([
    {
      id: "planner",
      label: "Planner",
      output: "TaskSpec",
      summary: "Reads the task and the current files, then defines the smallest safe plan.",
    },
    {
      id: "coder",
      label: "Coder",
      output: "unified diff",
      summary: "Applies a focused change and hands the exact diff to testing.",
    },
    {
      id: "tester",
      label: "Tester",
      output: "test results",
      summary: "Generates and runs tests against the applied change.",
    },
    {
      id: "reviewer",
      label: "Reviewer",
      output: "verdict",
      summary: "Approves the result or requests one bounded revision.",
    },
  ]);
  expect(EVIDENCE_FILES).toEqual([
    {
      id: "plan",
      name: "plan.md",
      qualifier: "Plan mode",
      description:
        "Explicit plan mode researches without executing. Approve the plan with niki run --plan <id>.",
    },
    {
      id: "changes",
      name: "changes.patch",
      qualifier: null,
      description:
        "Unified diff written from the completed run, bound to the fresh niki/<id> branch when branch creation succeeds.",
    },
    {
      id: "report",
      name: "report.md",
      qualifier: null,
      description: "Human-readable run report written after the pipeline completes.",
    },
    {
      id: "artifacts",
      name: "artifacts/*.json",
      qualifier: null,
      description: "Per-agent JSON artifacts record what each agent decided and why.",
    },
  ]);
  expect(BACKENDS).toEqual([
    {
      id: "podman",
      name: "Podman",
      description: "Default rootless container sandbox with no daemon.",
    },
    {
      id: "docker",
      name: "Docker",
      description: "Container sandbox fallback. Docker writes through the project mount.",
    },
    {
      id: "worktree",
      name: "worktree",
      description: "Git worktree backend that needs no container runtime.",
    },
  ]);
  expect(PROVIDERS).toEqual(EXPECTED_PROVIDERS);
  expect(INSTALL_COMMAND).toBe(INSTALLERS.shell.command);
});

test("the hero uses only the approved copy and actions", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const hero = page.getByTestId("landing-hero");
  const heading = hero.getByRole("heading", { level: 1 });
  await expect(hero).toBeVisible();
  await expect(heading).toHaveText(HERO.title);

  const headingLineCount = await heading.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return new Set(Array.from(range.getClientRects(), (rect) => Math.round(rect.top))).size;
  });
  expect(headingLineCount).toBeLessThanOrEqual(2);

  const primaryHref = await hero
    .getByRole("link", { name: HERO.primaryAction.label })
    .getAttribute("href");
  expect(new URL(primaryHref!, page.url()).pathname.replace(/\/$/, "")).toBe(
    HERO.primaryAction.href
  );
  await expect(hero.getByRole("link", { name: HERO.secondaryAction.label })).toHaveAttribute(
    "href",
    HERO.secondaryAction.href
  );
  await expect(hero.getByTestId("hero-window")).toBeVisible();
  expect(await hero.innerText()).not.toMatch(/\bv\d+(?:\.\d+)+\b/i);
});

test("desktop media spans the hero container below the approved copy and actions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const hero = page.getByTestId("landing-hero");
  const frame = page.getByTestId("pipeline-video");
  const heroBox = await hero.boundingBox();
  const frameBox = await frame.boundingBox();
  expect(heroBox).not.toBeNull();
  expect(frameBox).not.toBeNull();

  const inner = page.getByTestId("hero-window");
  const innerBox = await inner.boundingBox();
  const contentWidth = heroBox!.width;

  // The media spans the content column, which sits inside the page gutter.
  const gutter = await page.getByTestId("hero-window").evaluate((element) => {
    const parent = element.parentElement;
    return Number.parseFloat(getComputedStyle(parent!).paddingLeft);
  });

  expect(innerBox!.width).toBeGreaterThanOrEqual(contentWidth - gutter * 2 - 2);
  expect(Math.abs(innerBox!.x - (heroBox!.x + gutter))).toBeLessThan(2);
  expect(Math.abs(innerBox!.width - (contentWidth - gutter * 2))).toBeLessThan(2);

  const copyBoxes = await Promise.all([
    hero.getByRole("heading", { level: 1 }).boundingBox(),
    hero.getByRole("link", { name: HERO.primaryAction.label }).boundingBox(),
    hero.getByRole("link", { name: HERO.secondaryAction.label }).boundingBox(),
  ]);
  const copyBottom = Math.max(...copyBoxes.map((box) => (box?.y ?? 0) + (box?.height ?? 0)));
  expect(innerBox!.y).toBeGreaterThanOrEqual(copyBottom);
});

test("the provider strip presents twelve named integrations with meaningful images", async ({
  page,
}) => {
  await openLanding(page);
  await revealAllSections(page);

  const strip = page.getByTestId("provider-strip");
  await expect(strip).toBeVisible();
  await expect(strip).toContainText("Twelve providers");

  const grid = strip.getByTestId("provider-grid");
  await expect(grid.locator("li")).toHaveCount(12);
  for (const provider of EXPECTED_PROVIDERS) {
    const image = grid.getByRole("img", { name: provider.name });
    await expect(image).toHaveAttribute("src", provider.logo);
    await expect(image).toHaveAttribute("width", String(provider.width));
    await expect(image).toHaveAttribute("height", String(provider.height));
  }

  await grid.scrollIntoViewIfNeeded();
  await grid.locator("img").evaluateAll(async (images) => {
    await Promise.all(images.map((image) => (image as HTMLImageElement).decode()));
  });
  for (const provider of EXPECTED_PROVIDERS) {
    const image = grid.getByRole("img", { name: provider.name });
    await expect
      .poll(() =>
        image.evaluate((element) => {
          const providerImage = element as HTMLImageElement;
          const box = providerImage.getBoundingClientRect();
          return {
            complete: providerImage.complete,
            naturalWidth: providerImage.naturalWidth,
            naturalHeight: providerImage.naturalHeight,
            renderedWidth: Math.round(box.width),
            renderedHeight: Math.round(box.height),
          };
        })
      )
      .toEqual({
        complete: true,
        naturalWidth: provider.width,
        naturalHeight: provider.height,
        renderedWidth: 26,
        renderedHeight: 26,
      });
  }

  const pageText = await page.locator("main").innerText();
  expect(pageText).not.toMatch(
    /\b(customers?|testimonials?|adoption|trusted by|used by|love by)\b/i
  );
});

test("the provider grid steps down from twelve columns to four", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const grid = page.getByTestId("provider-grid");
  const columnCount = () =>
    grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(/\s+/).length);

  await expect.poll(columnCount).toBe(12);
  await page.setViewportSize({ width: 1100, height: 900 });
  await expect.poll(columnCount).toBe(6);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(columnCount).toBe(4);
});

for (const theme of ["dark", "light"] as const) {
  test(`landing content has no responsive overflow in the ${theme} theme`, async ({ page }) => {
    for (const viewport of RESPONSIVE_VIEWPORTS) {
      await page.setViewportSize(viewport);
      await openLanding(page, theme);
      await revealAllSections(page);

      const documentWidth = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(documentWidth.scroll).toBeLessThanOrEqual(documentWidth.client);
      expect(await collectVisibleOverflow(page)).toEqual([]);
    }
  });
}

test("overflow detection ignores only the hidden skip link and reports both edges", async ({
  page,
}) => {
  await openLanding(page);
  expect(await collectVisibleOverflow(page)).toEqual([]);

  await page.evaluate(() => {
    for (const [className, side] of [
      ["overflow-fixture-left", "left: -20px; right: auto"],
      ["overflow-fixture-right", "right: -20px; left: auto"],
    ] as const) {
      const fixture = document.createElement("div");
      fixture.className = className;
      fixture.style.cssText = `position: fixed; top: 0; ${side}; width: 10px; height: 10px;`;
      document.body.append(fixture);
    }
  });

  const offenders = await collectVisibleOverflow(page);
  expect(offenders.map(({ className }) => className).sort()).toEqual([
    "overflow-fixture-left",
    "overflow-fixture-right",
  ]);
});

test("the landing makes no external or cursor.com requests", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));

  await openLanding(page);
  await revealAllSections(page);
  await page.waitForLoadState("networkidle");

  const origin = new URL(page.url()).origin;
  expect(requests.filter((url) => !url.startsWith(origin))).toEqual([]);
  expect(
    requests.filter(
      (url) =>
        new URL(url).hostname === "cursor.com" || new URL(url).hostname.endsWith(".cursor.com")
    )
  ).toEqual([]);
});

test("a successful landing load has no runtime failures and decodes its real media", async ({
  page,
}) => {
  const failedResponses: Array<{ url: string; status: number }> = [];
  const failedRequests: Array<{ url: string; error: string }> = [];
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on("response", (response) => {
    if (response.status() >= 400)
      failedResponses.push({ url: response.url(), status: response.status() });
  });
  page.on("requestfailed", (request) =>
    failedRequests.push({ url: request.url(), error: request.failure()?.errorText ?? "unknown" })
  );
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await openLanding(page);
  await revealAllSections(page);
  await page.waitForLoadState("networkidle");

  const video = page.getByTestId("pipeline-video-element");
  await expect
    .poll(() =>
      video.evaluate((element) => {
        const media = element as HTMLVideoElement;
        return {
          hasMetadata: media.readyState >= HTMLMediaElement.HAVE_METADATA,
          hasDuration: Number.isFinite(media.duration) && media.duration > 0,
          videoWidth: media.videoWidth,
          videoHeight: media.videoHeight,
        };
      })
    )
    .toEqual({ hasMetadata: true, hasDuration: true, videoWidth: 1120, videoHeight: 710 });

  const providerGrid = page.getByTestId("provider-grid");
  await providerGrid.scrollIntoViewIfNeeded();
  await providerGrid.locator("img").evaluateAll(async (images) => {
    await Promise.all(images.map((image) => (image as HTMLImageElement).decode()));
  });

  const origin = new URL(page.url()).origin;
  expect(failedResponses.filter(({ url }) => new URL(url).origin === origin)).toEqual([]);
  expect(
    failedRequests.filter(
      ({ url, error }) =>
        new URL(url).origin === origin && !(url.includes("_rsc=") && error === "net::ERR_ABORTED")
    )
  ).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("the real recording and every provider mark are served locally with correct MIME types", async ({
  request,
}) => {
  const media = await Promise.all([
    request.get("/niki-tui-demo.webm"),
    request.get("/niki-tui-demo.mp4"),
    request.get("/niki-tui-demo-poster.webp"),
  ]);
  expect(media[0].status()).toBe(200);
  expect(media[0].headers()["content-type"]).toContain("video/webm");
  expect(media[1].status()).toBe(200);
  expect(media[1].headers()["content-type"]).toContain("video/mp4");
  expect(media[2].status()).toBe(200);
  expect(media[2].headers()["content-type"]).toContain("image/webp");

  for (const provider of PROVIDERS) {
    const response = await request.get(provider.logo);
    expect(response.status(), provider.name).toBe(200);
    expect(response.headers()["content-type"], provider.name).toContain("image/svg+xml");
  }
});

test("the recording exposes local sources, stable framing, and keyboard controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const frame = page.getByTestId("pipeline-video");
  const video = page.getByTestId("pipeline-video-element");
  await expect(video).toHaveJSProperty("muted", true);
  await expect(video).toHaveAttribute("playsinline", "");
  await expect(video).toHaveAttribute("preload", "metadata");
  await expect(video).toHaveAttribute("poster", "/niki-tui-demo-poster.webp");
  await expect(video.locator('source[type="video/webm"]')).toHaveAttribute(
    "src",
    "/niki-tui-demo.webm"
  );
  await expect(video.locator('source[type="video/mp4"]')).toHaveAttribute(
    "src",
    "/niki-tui-demo.mp4"
  );
  await expect(video).toHaveJSProperty("autoplay", false);
  await expect(video).toHaveJSProperty("loop", false);

  // The recording is letterboxed into a wider hero stage, so the element's box is
  // not its intrinsic ratio. What must hold is that the pixels are never
  // stretched: `cover` and `contain` both preserve the source aspect, and the
  // intrinsic size is still the real one.
  const media = await video.evaluate((element) => {
    const player = element as HTMLVideoElement;
    return {
      videoWidth: player.videoWidth,
      videoHeight: player.videoHeight,
      objectFit: getComputedStyle(player).objectFit,
    };
  });
  expect(media).toEqual({ videoWidth: 1120, videoHeight: 710, objectFit: "cover" });

  const frameBox = await frame.boundingBox();
  expect(frameBox).not.toBeNull();
  expect(frameBox!.width).toBeGreaterThan(0);
  expect(frameBox!.height).toBeGreaterThan(0);

  const status = page.getByTestId("pipeline-video-status");
  const toggle = page.getByTestId("pipeline-video-toggle");
  const replay = page.getByTestId("pipeline-video-replay");
  await expect(status).toHaveAttribute("aria-live", "polite");
  await expect(status).toHaveText("Paused");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(toggle).toHaveAccessibleName("Play pipeline recording");
  await expect(replay).toHaveAccessibleName("Replay pipeline recording");

  for (const control of [toggle, replay]) {
    const controlBox = await control.boundingBox();
    expect(controlBox).not.toBeNull();
    expect(controlBox!.width).toBeGreaterThanOrEqual(TOUCH_TARGET_PX - TOUCH_TOLERANCE);
    expect(controlBox!.height).toBeGreaterThanOrEqual(TOUCH_TARGET_PX - TOUCH_TOLERANCE);
  }

  await toggle.focus();
  await expect(toggle).toBeFocused();
  await toggle.press("Enter");
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused))
    .toBe(false);
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(toggle).toHaveAccessibleName("Pause pipeline recording");
  await expect(status).toHaveText("Playing");
  await toggle.press("Space");
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused))
    .toBe(true);
  await expect(status).toHaveText("Paused");
});

test("normal-motion playback loops and pauses offscreen or when the document is hidden", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const video = page.getByTestId("pipeline-video-element");
  await expect(video).toHaveJSProperty("autoplay", true);
  await expect(video).toHaveJSProperty("loop", true);
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused), {
      timeout: 10_000,
    })
    .toBe(false);

  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" })
  );
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused))
    .toBe(true);

  await video.scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused), {
      timeout: 10_000,
    })
    .toBe(false);
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused))
    .toBe(true);
  await expect(page.getByTestId("pipeline-video-status")).toHaveText("Paused");
});

test("a recording load failure is announced as unavailable", async ({ page }) => {
  await page.route("**/niki-tui-demo.webm", (route) => route.abort("failed"));
  await page.route("**/niki-tui-demo.mp4", (route) => route.abort("failed"));
  await openLanding(page);

  await expect(page.getByTestId("pipeline-video-status")).toHaveText("Video unavailable");
  await expect(page.getByTestId("pipeline-video-element")).toHaveJSProperty("paused", true);
});

test("the pipeline recording can be advanced, rewound, and replayed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const video = page.getByTestId("pipeline-video-element");
  const toggle = page.getByTestId("pipeline-video-toggle");
  const replay = page.getByTestId("pipeline-video-replay");

  await replay.click();
  await expect(video).toHaveJSProperty("paused", false);
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).currentTime))
    .toBeLessThan(0.5);
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("pipeline-video-status")).toHaveText("Playing");

  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).currentTime), {
      timeout: 10_000,
    })
    .toBeGreaterThan(1);

  await replay.click();
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).currentTime))
    .toBeLessThan(0.5);
  await expect(video).toHaveJSProperty("paused", false);
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("pipeline-video-status")).toHaveText("Playing");
});

test("the pipeline recording keeps an explicit user pause through interruptions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const video = page.getByTestId("pipeline-video-element");
  const toggle = page.getByTestId("pipeline-video-toggle");
  const status = page.getByTestId("pipeline-video-status");

  // Settle first: an autoplay that is still starting, or a scroll that pauses the
  // recording on the way to the control, would make the first click act on the
  // wrong state.
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused), {
      timeout: 10_000,
    })
    .toBe(false);
  await toggle.scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused), {
      timeout: 10_000,
    })
    .toBe(false);
  await toggle.click();
  await expect(video).toHaveJSProperty("paused", true);
  await expect(status).toHaveText("Paused");

  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" })
  );
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveJSProperty("paused", true);

  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(video).toHaveJSProperty("paused", true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(video).toHaveJSProperty("paused", true);
  await expect(status).toHaveText("Paused");
});
