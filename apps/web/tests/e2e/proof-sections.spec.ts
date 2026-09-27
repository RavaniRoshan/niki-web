import { expect, test, type Page } from "playwright/test";
import { MODEL_SECTION, MODEL_ROUTING_TOML } from "../../src/components/landing/content";
import { INSTALLERS } from "../../src/data/release";
import { revealAllSections, setStoredTheme, waitForStaticDom } from "./helpers";

async function openLanding(page: Page, theme: "light" | "dark" = "dark") {
  await setStoredTheme(page, theme);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForStaticDom(page);
  await revealAllSections(page);
}

test("the branch feature shows unchanged main and a separate review branch", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const section = page.getByTestId("branch-feature");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText(
    "Nothing lands until the tests pass"
  );
  await expect(section).toContainText("unless you force the run");
  await expect(section).toContainText("committed history is never rewritten");
  await expect(section.getByTestId("branch-window")).toContainText("main");
  await expect(section.getByTestId("branch-window")).toContainText("niki/<id>");

  const gates = section.getByTestId("branch-gates");
  await expect(gates.locator("li")).toHaveCount(4);
  for (const label of ["Non-empty diff", "Executed test suite", "niki/<id> created"]) {
    await expect(gates).toContainText(label);
  }
  await expect(gates).toContainText("never rewritten");
});

test("model routing shows real per-agent configuration without a universal recommendation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const section = page.getByTestId("model-routing");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText(MODEL_SECTION.title);
  const code = section.getByTestId("model-routing-code");
  await expect(code).toBeVisible();
  await expect(code).toHaveAttribute("tabindex", "0");
  await expect(code).toHaveText(MODEL_ROUTING_TOML);
  for (const agent of ["planner", "coder", "tester", "reviewer"]) {
    await expect(code).toContainText(`[agents.${agent}]`);
    await expect(code).toContainText("provider =");
    await expect(code).toContainText("model =");
  }
  await expect(section.getByTestId("model-routing-code")).toContainText("[agents.planner]");
  await expect(section).not.toContainText(/recommended for everyone|always use|best model/i);
  expect(await code.evaluate((element) => getComputedStyle(element).overflowX)).toMatch(
    /auto|scroll/
  );
});

test("the manifest card names the real guarantees and links to the source", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const section = page.getByTestId("open-source-proof");
  await expect(section.getByRole("heading", { level: 2 })).toContainText("free software");
  await expect(section).toContainText("Apache-2.0");
  await expect(section).toContainText(/no telemetry/i);
  for (const text of ["Podman", "Docker", "worktree"]) {
    await expect(section).toContainText(text);
  }
  await expect(section.getByRole("link", { name: /Read the source/ })).toHaveAttribute(
    "href",
    /github\.com\/RavaniRoshan\/niki/
  );
  await expect(section).not.toContainText(/\b(customers?|teams use|trusted by)\b/i);
});

test("the evidence feature carries the real install command and copies it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const section = page.getByTestId("evidence-feature");
  await expect(section.getByTestId("install-command")).toHaveText(INSTALLERS.shell.command);
  await expect(section.getByTestId("copy-command")).toHaveAccessibleName("Copy install command");
  await expect(section.getByRole("heading", { level: 2 })).toContainText("receipts");
});

test("the final CTA is a single centred action pointing at downloads", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const section = page.getByTestId("final-cta");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText("Try Niki now.");
  await expect(section.getByRole("link")).toHaveCount(1);
  const href = await section.getByRole("link").getAttribute("href");
  expect(new URL(href!, page.url()).pathname.replace(/\/$/, "")).toBe("/downloads");

  const headingBox = await section.getByRole("heading", { level: 2 }).boundingBox();
  const linkBox = await section.getByRole("link").boundingBox();
  const sectionBox = await section.boundingBox();
  const headingCentre = headingBox!.x + headingBox!.width / 2;
  const linkCentre = linkBox!.x + linkBox!.width / 2;
  const sectionCentre = sectionBox!.x + sectionBox!.width / 2;
  expect(Math.abs(headingCentre - sectionCentre)).toBeLessThan(2);
  expect(Math.abs(linkCentre - sectionCentre)).toBeLessThan(2);
});

test("the install command reports clipboard success only after a real write", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: "http://127.0.0.1:4322",
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const button = page.getByTestId("copy-command");
  const status = page.getByTestId("copy-command-status");
  await button.click();
  await expect(status).toHaveText("Copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(INSTALLERS.shell.command);
});

test("clipboard rejection never reports success and selects the command instead", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error("denied")),
      },
    });
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const button = page.getByTestId("copy-command");
  const status = page.getByTestId("copy-command-status");
  await button.click();
  await expect(status).toHaveText("Copy failed. Select the command manually.");
  expect(await page.evaluate(() => window.getSelection()?.toString() ?? "")).toContain(
    "curl -fsSL"
  );
});

test("the changelog row renders real releases and links to each", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  const section = page.getByTestId("changelog-row");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText("Changelog");
  /* A timeline, not a four-up grid: an ordered list on a spine. */
  const rows = section.getByTestId("changelog-timeline").locator("> li");
  await expect(rows).toHaveCount(4);
  for (const row of await rows.all()) {
    await expect(row.getByRole("link")).toHaveAttribute("href", /github\.com/);
    await expect(row.locator("time")).toHaveAttribute("datetime", /^\d{4}-\d{2}-\d{2}$/);
  }
  await expect(section.getByRole("link", { name: /See what's new/ })).toBeVisible();
});

test("the final sections remain overflow-free on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openLanding(page);

  for (const testId of [
    "branch-feature",
    "model-routing",
    "open-source-proof",
    "receipt-grid",
    "changelog-row",
    "capability-row",
    "highlights-row",
    "final-cta",
  ]) {
    const section = page.getByTestId(testId);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
  }
  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
});
