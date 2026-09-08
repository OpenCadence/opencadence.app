import { expect, test } from "@playwright/test";

type Samples = {
  times: number[];
  draws: number;
  pointDraws: number;
  pointer: number[];
};

test("ribbons settle after the introduction, render no markers, and ignore pointer movement", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const samples: Samples = {
      times: [],
      draws: 0,
      pointDraws: 0,
      pointer: [0, 0],
    };
    (window as unknown as { cadence: Samples }).cadence = samples;
    const names = new WeakMap<WebGLUniformLocation, string>();
    const prototype = WebGLRenderingContext.prototype;
    const originalLocation = prototype.getUniformLocation;
    const originalUniform = prototype.uniform1f;
    const originalPointer = prototype.uniform2f;
    const originalDraw = prototype.drawArrays;
    prototype.getUniformLocation = function (program, name) {
      const location = originalLocation.call(this, program, name);
      if (location) names.set(location, name);
      return location;
    };
    prototype.uniform1f = function (location, value) {
      if (location && names.get(location) === "uTime") {
        samples.times.push(value);
        if (samples.times.length > 120) samples.times.shift();
      }
      return originalUniform.call(this, location, value);
    };
    prototype.uniform2f = function (location, x, y) {
      if (location && names.get(location) === "uPointer")
        samples.pointer = [x, y];
      return originalPointer.call(this, location, x, y);
    };
    prototype.drawArrays = function (mode, first, count) {
      samples.draws++;
      if (mode === this.POINTS) samples.pointDraws++;
      return originalDraw.call(this, mode, first, count);
    };
  });
  const samples = () =>
    page.evaluate(() => (window as unknown as { cadence: Samples }).cadence);
  await page.goto("/");
  const field = page.locator(".cadence-field");
  const canvas = field.locator("canvas");
  await expect(field).toHaveAttribute("data-renderer", "webgl");
  await expect(page.locator(".hero-motion-toggle")).toHaveCount(0);
  await expect
    .poll(async () => (await samples()).times.at(-1), { timeout: 6000 })
    .toBe(3);
  await expect(canvas).toHaveAttribute("data-active", "false");
  const settled = await samples();
  expect(settled.times.some((value) => value > 0 && value < 3)).toBe(true);
  expect(settled.pointDraws).toBe(0);
  // Verify actual GPU draw calls stop, not just a DOM state attribute.
  await page.waitForTimeout(200);
  expect((await samples()).draws).toBe(settled.draws);

  await page.mouse.move(50, 260);
  await page.waitForTimeout(600);
  await expect(canvas).toHaveAttribute("data-active", "false");
  const afterPointer = await samples();
  expect(afterPointer.draws).toBe(settled.draws);
  expect(afterPointer.pointer).toEqual([0, 0]);
  expect(afterPointer.times.at(-1)).toBe(3);
  await page.waitForTimeout(200);
  expect((await samples()).draws).toBe(afterPointer.draws);

  await page.evaluate(() =>
    window.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerType: "touch",
        clientX: 150,
        clientY: 260,
      }),
    ),
  );
  await page.waitForTimeout(200);
  expect((await samples()).draws).toBe(afterPointer.draws);

  await page.locator("#community").scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute("data-active", "false");
  const offscreen = await samples();
  await page.waitForTimeout(200);
  expect((await samples()).draws).toBe(offscreen.draws);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(async () => (await samples()).pointer).toEqual([0, 0]);
  await expect(canvas).toHaveAttribute("data-active", "false");
  expect((await samples()).times.at(-1)).toBe(3);
});

test("reduced motion uses the static artwork, including preference changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const field = page.locator(".cadence-field");
  await expect(field).toHaveAttribute("data-renderer", "static");
  await expect(page.locator(".cadence-field-static")).toBeVisible();
  await expect(page.locator(".hero-motion-toggle")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(field).toHaveAttribute("data-renderer", "webgl");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(field).toHaveAttribute("data-renderer", "static");
  await expect(field.locator("canvas")).toHaveAttribute("data-active", "false");
});

test("unavailable WebGL preserves artwork and usable hero links", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = new Proxy(
      HTMLCanvasElement.prototype.getContext,
      {
        apply(target, receiver, args) {
          if (args[0] === "webgl") return null;
          return Reflect.apply(target, receiver, args);
        },
      },
    );
  });
  await page.goto("/");
  await expect(page.locator(".cadence-field")).toHaveAttribute(
    "data-renderer",
    "static",
  );
  await expect(page.locator(".cadence-field-static")).toBeVisible();
  await expect(page.locator(".hero-motion-toggle")).toHaveCount(0);
  await page.getByRole("link", { name: "Meet your workspace" }).click();
  await expect(page).toHaveURL(/#workspace$/);
});

test("WebGL context loss falls back and recovery does not replay the introduction", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const field = page.locator(".cadence-field");
  await expect(field).toHaveAttribute("data-renderer", "webgl");
  await page.locator(".cadence-field-canvas").evaluate((element) => {
    const gl = (element as HTMLCanvasElement).getContext("webgl")!;
    const extension = gl.getExtension("WEBGL_lose_context")!;
    (window as unknown as { restoreCadence: () => void }).restoreCadence = () =>
      extension.restoreContext();
    extension.loseContext();
  });
  await expect(field).toHaveAttribute("data-renderer", "static");
  await expect(field.locator("canvas")).toHaveAttribute("data-active", "false");
  await page.evaluate(() =>
    (window as unknown as { restoreCadence: () => void }).restoreCadence(),
  );
  await expect(field).toHaveAttribute("data-renderer", "webgl");
  await expect(field.locator("canvas")).toHaveAttribute("data-active", "false");
});

test("static hero artwork is available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3101/");
    await expect(page.locator(".cadence-field-static")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Get OpenCadence", exact: true }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
