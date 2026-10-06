import { expect, test } from "@playwright/test";

import { ORIGIN, open, start } from "./demo.mjs";

const PAGES = [
  { file: "index.html", title: "Houseki · gem and stone puzzle games", current: "Falling Triplets", play: "#well" },
  { file: "chains.html", title: "Houseki · Colour Chains", current: "Colour Chains", play: "#well" },
  { file: "tools.html", title: "Houseki · Gem Swap and Stone Collapse", current: "Gem Swap & Stone Collapse", play: "#grid" },
  { file: "blocks.html", title: "Houseki · Magnetic Blocks", current: "Magnetic Blocks · Beta", play: "#well" },
];

for (const { file, title, current, play } of PAGES) {
  test(`${file} opens with no complaint, under the family's header and footer, with its game drawn`, async ({ page }) => {
    const errors = await open(page, file);
    await expect(page).toHaveTitle(title);
    // The shared head: a description, an icon, the viewport, Open Graph.
    expect(((await page.locator('meta[name="description"]').getAttribute("content")) ?? "").length).toBeGreaterThan(60);
    await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
    await expect(page.locator('meta[name="viewport"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    // The header: the name with its kana, the language chooser, the cloth patches, the Help switch, GitHub and npm.
    await expect(page.locator("header h1")).toContainText("Houseki");
    await expect(page.locator("header h1 [lang=ja]")).toHaveText("宝石");
    await expect(page.locator("header [data-lang]")).toHaveCount(2);
    await expect(page.locator("header [data-cloth]")).toHaveCount(5);
    await expect(page.locator("header [data-help-switch]")).toHaveCount(1);
    await expect(page.locator('header a[href$="/npm" i], header a[href*="npmjs.com/package/@johnmorrisdotca/houseki"]')).toHaveCount(1);
    await expect(page.locator('header a[href="https://github.com/johnmorrisdotca/houseki"]')).toHaveCount(1);
    await expect(page.locator('header a[href="api.html"]')).toHaveCount(1);
    // The footer names the whole family, each by its demo, this one marked.
    const family = page.locator("footer .family a");
    expect(await family.count()).toBe(25);
    await expect(page.locator('footer .family a[aria-current="page"]')).toHaveText("Houseki");
    await expect(page.locator('footer .family a[href="https://johnmorrisdotca.github.io/karakuri/"]')).toHaveText("Karakuri");
    // The page chooser marks the page being read.
    await expect(page.locator('.pages a[aria-current="page"]')).toHaveText(current);
    await expect(page.locator(play)).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("the language chooser speaks Japanese in the header, the footer and the page, and the choice survives a reload", async ({ page }) => {
  const errors = await open(page, "chains.html");
  await page.locator('header [data-lang="ja"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator("header .intro p").first()).toContainText("宝石と石のオリジナルパズルゲーム");
  await expect(page.locator("footer .family span").first()).toHaveText("姉妹パッケージ:");
  await expect(page.locator("#unreviewed")).toBeVisible();
  await expect(page.locator('.game-screen h2[data-i="title"]')).toHaveText("色の連鎖");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator('header [data-lang="ja"]')).toHaveAttribute("aria-pressed", "true");
  await page.locator('header [data-lang="en"]').click();
  await expect(page.locator('.game-screen h2[data-i="title"]')).toHaveText("Colour Chains");
  await expect(page.locator("#unreviewed")).toBeHidden();
  expect(errors).toEqual([]);
});

for (const file of ["index.html", "chains.html", "tools.html", "blocks.html", "api.html"]) {
  test(`${file} does not scroll sideways at the width it is made for`, async ({ page }) => {
    await open(page, file);
    const { over, wide } = await page.evaluate(() => {
      const width = document.documentElement.clientWidth;
      // What reaches past the right edge, so that a failure names the thing and not only the number of pixels.
      const wide = [...document.querySelectorAll("body *")].filter((el) => el.getBoundingClientRect().right > width + 0.5).slice(0, 6).map((el) => `${el.tagName.toLowerCase()}.${el.className} right=${Math.round(el.getBoundingClientRect().right)} "${(el.textContent ?? "").trim().slice(0, 30)}"`);
      return { over: document.documentElement.scrollWidth - width, wide };
    });
    expect(over, wide.join("; ")).toBeLessThanOrEqual(0);
  });
}

test("dark mode follows the device: the page's background and ink change, and nothing goes unreadable", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await open(page, "index.html");
  const light = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.emulateMedia({ colorScheme: "dark" });
  const dark = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(dark).not.toBe(light);
  const [r, g, b] = dark.match(/\d+/g).map(Number);
  expect((r + g + b) / 3).toBeLessThan(90);
});

test("the API reference lists every entry point, in the family's header and footer", async ({ page }) => {
  const errors = await open(page, "api.html");
  await expect(page).toHaveTitle(/Houseki/);
  for (const entry of ["falling-triplets", "colour-chains", "stone-collapse", "gem-swap", "nature", "magnetic-blocks"]) {
    await expect(page.locator("main").getByText(`@johnmorrisdotca/houseki/${entry}`).first()).toBeVisible();
  }
  expect(await page.locator("article").count()).toBeGreaterThan(100);
  await expect(page.locator('footer .family a[aria-current="page"]')).toHaveText("Houseki");
  expect(errors).toEqual([]);
});

test("a page that does not exist is not served", async ({ page }) => {
  await start(page);
  const response = await page.goto(`${ORIGIN}/nothing-here.html`);
  expect(response?.status()).toBe(404);
});
