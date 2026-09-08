import { expect, test } from "@playwright/test";

for (const width of [390, 1280]) {
  test(`navigation follows scrolling and Cloud opens at the top at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const desktop = page.getByRole("navigation", {
      name: "Main navigation",
      exact: true,
      includeHidden: true,
    });
    await expect(desktop.locator("[aria-current]")).toHaveCount(0);
    for (const [id, label] of [
      ["workspace", "The workspace"],
      ["community", "Open source"],
    ]) {
      await page.evaluate((id) => {
        const section = document.getElementById(id)!;
        window.scrollTo({ top: section.offsetTop - 100, behavior: "instant" });
      }, id);
      await expect(
        desktop.getByRole("link", { name: label, includeHidden: true }),
      ).toHaveAttribute("aria-current", "location");
    }
    await expect(page).not.toHaveURL(/#/);
    if (width <= 900) {
      const toggle = await page
        .getByRole("button", { name: "Open navigation" })
        .boundingBox();
      expect(toggle).not.toBeNull();
      await page.mouse.click(
        toggle!.x + toggle!.width / 2,
        toggle!.y + toggle!.height / 2,
      );
      const mobile = page.getByRole("navigation", {
        name: "Mobile navigation",
      });
      await expect(
        mobile.getByRole("link", { name: "Open source" }),
      ).toHaveAttribute("aria-current", "location");
      await mobile.getByRole("link", { name: "Cloud Soon" }).click();
    } else {
      await desktop.getByRole("link", { name: "Cloud Soon" }).click();
    }
    await expect(page).toHaveURL(/\/cloud$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(
      desktop.getByRole("link", { name: "Cloud Soon", includeHidden: true }),
    ).toHaveAttribute("aria-current", "page");
    await page.getByRole("link", { name: "Back to OpenCadence" }).click();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(desktop.locator("[aria-current]")).toHaveCount(0);
  });
}
