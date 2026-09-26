import { expect, test, type Page } from "@playwright/test";
import { EVIDENCE_FILES, STAGES } from "../../src/components/landing/content";
import { revealAllSections, setStoredTheme, waitForStaticDom } from "./helpers";

/* Layout is sub-pixel, so a 44 px control can measure 43.99999. Tolerance of half
   a pixel keeps the assertion honest about the 44 px floor without failing on
   float noise. */
const TOUCH_TARGET_PX = 44;
const TOUCH_TOLERANCE = 0.5;

async function openLanding(page: Page, theme: "light" | "dark" = "dark") {
  await setStoredTheme(page, theme);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForStaticDom(page);
  await revealAllSections(page);
}

const tabIds = (page: Page, testId: string) => page.getByTestId(testId).getByRole("tab");

test("the run explorer implements a complete four-stage tab pattern", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const section = page.locator("#run");
  await expect(section).toBeVisible();
  await expect(section).toHaveAttribute("data-testid", "run-explorer");

  const tabs = tabIds(page, "run-stage-tabs");
  const tablist = page.getByTestId("run-stage-tabs");
  const panel = page.getByTestId("run-stage-panel");
  await expect(tablist).toHaveAttribute("aria-orientation", "vertical");
  await expect(tabs).toHaveCount(STAGES.length);
  await expect(
    page.getByTestId("run-stage-tabs").locator('[role="tab"][aria-selected="true"]')
  ).toHaveCount(1);
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  const panelId = await panel.getAttribute("id");
  const plannerTabId = await tabs.nth(0).getAttribute("id");
  expect(panelId).toBeTruthy();
  expect(plannerTabId).toBeTruthy();
  await expect(tabs.nth(0)).toHaveAttribute("aria-controls", panelId!);
  await expect(panel).toHaveAttribute("role", "tabpanel");
  await expect(panel).toHaveAttribute("aria-labelledby", plannerTabId!);
  await expect(panel).toContainText(STAGES[0].output);
  await expect(panel).toContainText(STAGES[0].summary);

  for (const tab of await tabs.all()) {
    const box = await tab.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(TOUCH_TARGET_PX - TOUCH_TOLERANCE);
    expect(box!.height).toBeGreaterThanOrEqual(TOUCH_TARGET_PX - TOUCH_TOLERANCE);
  }

  await tabs.nth(0).focus();
  await tabs.nth(0).press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(panel).toContainText(STAGES[1].output);

  await tabs.nth(1).press("ArrowLeft");
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await tabs.nth(0).press("End");
  await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
  await expect(panel).toContainText(STAGES[3].output);
  await tabs.nth(3).press("Home");
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await tabs.nth(0).press("ArrowDown");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
});

test("the run explorer advances once, pauses for user attention, and replays on demand", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const tabs = tabIds(page, "run-stage-tabs");
  const selectedIndex = async () =>
    tabs.evaluateAll((elements) =>
      elements.findIndex((element) => element.getAttribute("aria-selected") === "true")
    );

  const heading = page.getByTestId("agent-feature").getByRole("heading", { level: 2 });
  await page.getByTestId("run-explorer").scrollIntoViewIfNeeded();
  expect(await selectedIndex()).toBe(0);
  await expect.poll(selectedIndex, { timeout: 4_000 }).toBe(1);
  await tabs.nth(1).hover();
  await page.waitForTimeout(2_100);
  expect(await selectedIndex()).toBe(1);
  await heading.hover();
  await expect.poll(selectedIndex, { timeout: 4_000 }).toBe(2);

  await tabs.nth(2).focus();
  await page.waitForTimeout(2_100);
  expect(await selectedIndex()).toBe(2);
  await tabs.nth(2).blur();
  await heading.hover();
  await expect.poll(selectedIndex, { timeout: 4_000 }).toBe(3);

  await page.getByTestId("run-replay").click();
  await page.getByTestId("run-replay").blur();
  await heading.hover();
  await expect.poll(selectedIndex, { timeout: 4_000 }).toBe(1);
  await expect.poll(selectedIndex, { timeout: 5_000 }).toBe(3);
  await page.waitForTimeout(2_100);
  expect(await selectedIndex()).toBe(3);
  await expect(page.getByTestId("run-status")).toHaveText("Run complete");
});

test("the run sequence waits until the explorer enters the viewport", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const tabs = tabIds(page, "run-stage-tabs");
  const selectedIndex = async () =>
    tabs.evaluateAll((elements) =>
      elements.findIndex((element) => element.getAttribute("aria-selected") === "true")
    );

  await page.waitForTimeout(2_300);
  expect(await selectedIndex()).toBe(0);

  await page.getByTestId("run-explorer").scrollIntoViewIfNeeded();
  await expect.poll(selectedIndex, { timeout: 4_000 }).toBe(1);
});

test("reduced motion keeps the run explorer on an explicit stage", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const tabs = tabIds(page, "run-stage-tabs");
  await page.waitForTimeout(2_300);
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByTestId("run-status")).toHaveText("Planner selected");
});

test("the evidence viewer presents source-backed artifacts through complete tabs", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const section = page.getByTestId("evidence-feature");
  await expect(section.getByRole("heading", { level: 2 })).toContainText("receipts");

  const tabs = tabIds(page, "evidence-tabs");
  const tablist = page.getByTestId("evidence-tabs");
  const panel = page.getByTestId("evidence-panel");
  await expect(tablist).toBeVisible();
  await expect(tablist).toHaveAttribute("aria-orientation", "vertical");
  await expect(tabs).toHaveCount(EVIDENCE_FILES.length);
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await expect(panel).toHaveAttribute("role", "tabpanel");
  await expect(panel).toContainText("Plan mode");
  await expect(panel).toContainText(EVIDENCE_FILES[0].description);

  await tabs.nth(0).press("ArrowRight");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(panel).toContainText(EVIDENCE_FILES[1].description);
  await expect(panel).toContainText("when branch creation succeeds");
  await tabs.nth(1).press("End");
  await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
  await expect(panel).toContainText(EVIDENCE_FILES[3].description);
  await tabs.nth(3).press("Home");
  await tabs.nth(0).press("ArrowDown");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

  const text = await section.innerText();
  expect(text).not.toMatch(/\b\d+(?:\.\d+)?\s*(?:ms|s|tests?|pass|score)\b/i);
  expect(text).not.toMatch(/```|\$\s+niki\s+run\s+"(?!Add a \/health)/);
});

test("mobile run and evidence tabs stay horizontal, reachable, and overflow-free", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await openLanding(page);

  for (const testId of ["run-stage-tabs", "evidence-tabs"]) {
    const tabs = page.getByTestId(testId);
    await tabs.scrollIntoViewIfNeeded();
    await expect(tabs).toHaveAttribute("aria-orientation", "horizontal");
    const styles = await tabs.evaluate((element) => {
      const style = getComputedStyle(element);
      return { overflowX: style.overflowX, scrollSnapType: style.scrollSnapType };
    });
    expect(styles.overflowX).toBe("auto");
    expect(styles.scrollSnapType).toContain("x");
    for (const tab of await tabs.getByRole("tab").all()) {
      const box = await tab.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(TOUCH_TARGET_PX - TOUCH_TOLERANCE);
    }
  }

  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
});

test("the run explorer is reachable from the first feature card", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const section = page.locator("#run");
  await expect(section).toBeVisible();
  await expect(page.getByTestId("agent-feature")).toContainText(
    "Four agents turn a task into a branch"
  );
});
