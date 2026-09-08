import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage has the brand, working destinations, and metadata", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(
    "OpenCadence | Open-source workspace for freelancers",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Find your flow.Own your work.",
  );
  await expect(
    page.getByRole("link", { name: "Get OpenCadence", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://github.com/OpenCadence/opencadence#get-started",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://opencadence.app",
  );
  await page.getByRole("link", { name: "Meet your workspace" }).click();
  await expect(page).toHaveURL(/#workspace$/);
  const brokenImages = await page
    .locator("img")
    .evaluateAll(
      (images) =>
        images.filter(
          (img) =>
            img instanceof HTMLImageElement &&
            (!img.complete || img.naturalWidth === 0),
        ).length,
    );
  expect(brokenImages).toBe(0);
  expect(errors).toEqual([]);
});

test("browser frame displays the app screenshot instead of interactive controls", async ({
  page,
}) => {
  await page.goto("/");
  const frame = page.locator(".preview-window");
  const screenshot = frame.getByRole("img", {
    name: /OpenCadence Today dashboard/,
  });
  await expect(screenshot).toBeVisible();
  await expect
    .poll(() =>
      screenshot.evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await expect(screenshot).toHaveAttribute("width", "3200");
  await expect(screenshot).toHaveAttribute("height", "2000");
  await expect(frame.getByRole("button")).toHaveCount(0);
});

test("FAQ supports keyboard disclosure and skip navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  const summary = page
    .locator("summary")
    .filter({ hasText: "Is the Community edition really free?" });
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(summary.locator("..")).toHaveAttribute("open", "");
  await expect(
    page.getByText("All core workspace features are included.", {
      exact: false,
    }),
  ).toBeVisible();
});

test("Cloud is a reachable pre-launch page, not a fake sign-up", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Meet OpenCadence Cloud" }).click();
  await expect(page).toHaveURL("/cloud");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your work.Without the setup.",
  );
  await expect(
    page.getByText("Registration and sign-in will open", { exact: false }),
  ).toBeVisible();
  await expect(page.locator("form")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Start with Community" }),
  ).toHaveAttribute("href", /#get-started$/);
  await page.getByRole("link", { name: "Back to OpenCadence" }).click();
  await expect(page).toHaveURL("/");
});

for (const width of [320, 390, 768, 900, 901, 1280]) {
  test(`responsive layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ["/", "/cloud"]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
    if (width <= 900) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      const nav = page.getByRole("navigation", { name: "Mobile navigation" });
      await expect(nav).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: "Open navigation" }),
      ).toBeFocused();
      await expect(nav).toHaveCount(0);
      await page.getByRole("button", { name: "Open navigation" }).click();
      await nav.getByRole("link", { name: "Open source" }).click();
      await expect(page).toHaveURL(/\/#community$/);
      await expect(nav).toHaveCount(0);
    }
  });
}

test("reflows with larger user font preferences", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 20px; }" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

for (const path of ["/", "/cloud"]) {
  test(`accessibility checks for ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          summary: node.failureSummary,
        })),
      })),
    ).toEqual([]);
  });
}

test("mobile screenshot preserves its proportions and remains accessible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const image = page.locator(".workspace-screenshot");
  const bounds = await image.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.width / bounds!.height).toBeCloseTo(1.6, 2);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("marketing uses plain copy without eyebrows or em dashes", async ({
  page,
}) => {
  for (const path of ["/", "/cloud"]) {
    await page.goto(path);
    await expect(page.locator(".eyebrow, .eyebrow-pill")).toHaveCount(0);
    await expect(
      page.locator(".section-heading:not(.centered) > p"),
    ).toHaveCount(0);
    await expect(page.locator(".lucide-cloud")).toHaveCount(0);
    await expect(page.locator("main .lucide-infinity")).toBeVisible();
    expect(await page.locator("body").textContent()).not.toContain("\u2014");
    expect(await page.title()).not.toContain("\u2014");
    expect(await page.locator("body").textContent()).not.toContain(
      "Not enterprise complexity",
    );
    expect(await page.locator("body").textContent()).not.toContain(
      "Community isn’t a trial",
    );
  }
});

test("desktop navigation shows GitHub branding and current destinations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  const github = page.locator(".header-github");
  await expect(github.locator(".github-logo")).toBeVisible();
  await expect(github).toHaveAttribute(
    "href",
    "https://github.com/OpenCadence/opencadence",
  );
  await nav.getByRole("link", { name: "The workspace" }).click();
  await expect(
    nav.getByRole("link", { name: "The workspace" }),
  ).toHaveAttribute("aria-current", "location");
  await nav.getByRole("link", { name: "Open source" }).click();
  await expect(nav.getByRole("link", { name: "Open source" })).toHaveAttribute(
    "aria-current",
    "location",
  );
  await nav.getByRole("link", { name: "Cloud Soon" }).click();
  await expect(nav.getByRole("link", { name: "Cloud Soon" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.goBack();
  await expect(nav.getByRole("link", { name: "Open source" })).toHaveAttribute(
    "aria-current",
    "location",
  );
});

test("mobile navigation has GitHub branding, accessible links, and dismisses outside", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/cloud");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const nav = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(
    nav.getByRole("link", { name: "View on GitHub" }).locator(".github-logo"),
  ).toBeVisible();
  await expect(nav.getByRole("link", { name: "Cloud Soon" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.getByRole("heading", { level: 1 }).click();
  await expect(nav).toHaveCount(0);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(nav).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("publishes sitemap and crawler rules", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("https://opencadence.app/cloud");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain(
    "Sitemap: https://opencadence.app/sitemap.xml",
  );
});
