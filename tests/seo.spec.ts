import { expect, test } from "@playwright/test";
import { faqs } from "../src/lib/faq";
import { site } from "../src/lib/site";

for (const [path, title, description] of [
  ["/", site.title, site.description],
  ["/cloud", site.cloudTitle, site.cloudDescription],
]) {
  test(`${path} has consistent canonical, search, and social metadata`, async ({
    page,
  }) => {
    await page.goto(path);
    const url = path === "/" ? site.url : `${site.url}${path}`;
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      url,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      description,
    );
    for (const name of ["og:title", "twitter:title"]) {
      await expect(
        page.locator(`meta[property="${name}"], meta[name="${name}"]`),
      ).toHaveAttribute("content", title);
    }
    for (const name of ["og:description", "twitter:description"]) {
      await expect(
        page.locator(`meta[property="${name}"], meta[name="${name}"]`),
      ).toHaveAttribute("content", description);
    }
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      url,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index, follow",
    );
    await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute(
      "content",
      /max-image-preview:large/,
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toHaveCount(1);
    const image = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute("content");
    expect(image).toContain(
      `${site.url}${path === "/" ? "" : path}/opengraph-image`,
    );
  });
}

test("server-rendered JSON-LD matches the visible FAQ and product status", async ({
  request,
  page,
}) => {
  const response = await request.get("/");
  const html = await response.text();
  const json = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  )?.[1];
  expect(json).toBeTruthy();
  const data = JSON.parse(json!);
  expect(data["@context"]).toBe("https://schema.org");
  const graph = data["@graph"];
  const app = graph.find(
    (node: { "@type": string }) => node["@type"] === "SoftwareApplication",
  );
  expect(app.name).toBe("OpenCadence Community");
  expect(app.isAccessibleForFree).toBe(true);
  expect(app.aggregateRating).toBeUndefined();
  expect(app.review).toBeUndefined();
  const faqPage = graph.find(
    (node: { "@type": string[] | string }) =>
      Array.isArray(node["@type"]) && node["@type"].includes("FAQPage"),
  );
  expect(faqPage.mainEntity).toHaveLength(faqs.length);
  await page.goto("/");
  await expect(page.locator(".preview-wrap")).toHaveAttribute(
    "data-nosnippet",
    "",
  );
  await expect(page.locator(".assistant-demo")).toHaveAttribute(
    "data-nosnippet",
    "",
  );
  expect(
    await page
      .locator(".hero-description")
      .evaluate((element) => element.closest("[data-nosnippet]") === null),
  ).toBe(true);
  for (const [index, faq] of faqs.entries()) {
    expect(faqPage.mainEntity[index].name).toBe(faq.question);
    expect(faqPage.mainEntity[index].acceptedAnswer.text).toBe(faq.answer);
    await expect(page.locator(`#${faq.id} summary`)).toContainText(
      faq.question,
    );
    await expect(page.locator(`#${faq.id} .faq-answer`)).toContainText(
      faq.answer,
    );
  }
  const cloudResponse = await request.get("/cloud");
  const cloudHtml = await cloudResponse.text();
  const cloud = JSON.parse(
    cloudHtml.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    )![1],
  );
  expect(
    cloud["@graph"].map((node: { "@type": string }) => node["@type"]),
  ).toEqual(["WebPage", "BreadcrumbList"]);
  expect(JSON.stringify(cloud)).not.toMatch(
    /"offers"|"aggregateRating"|"review"/,
  );
});

for (const path of ["/opengraph-image", "/cloud/opengraph-image"]) {
  test(`${path} serves a real 1200x630 PNG`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    const image = await response.body();
    expect(image.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(image.readUInt32BE(16)).toBe(1200);
    expect(image.readUInt32BE(20)).toBe(630);
  });
}

test("search bots receive indexable HTML with product facts, without running JS", async ({
  request,
}) => {
  for (const agent of [
    "Googlebot",
    "bingbot",
    "OAI-SearchBot",
    "Claude-SearchBot",
    "PerplexityBot",
  ]) {
    const response = await request.get("/", {
      headers: { "User-Agent": agent },
    });
    expect(response.status()).toBe(200);
    expect(response.headers()["x-robots-tag"] ?? "").not.toContain("noindex");
    const html = await response.text();
    expect(html).toContain(
      "OpenCadence is an open-source workspace for freelancers.",
    );
    expect(html).toContain("Node.js 22.13");
    expect(html).toContain("application/ld+json");
  }
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("User-Agent: *\nAllow: /");
});

test("llms.txt shares factual answers and unknown URLs return a real 404", async ({
  request,
}) => {
  const summary = await request.get("/llms.txt");
  expect(summary.status()).toBe(200);
  expect(summary.headers()["content-type"]).toContain("text/plain");
  const text = await summary.text();
  for (const faq of faqs) expect(text).toContain(faq.answer);
  expect(text).toContain("not a live integration or a customer testimonial");
  const missing = await request.get("/this-page-does-not-exist");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain('content="noindex"');
});
