import { expect, test } from "@playwright/test";

import { levelManifest } from "../dist/tsumiki.js";
import { open } from "./demo.mjs";

// Tsumiki's page, played with its own controls: a shape chosen in the tray, then a square, at a phone's width and a desk's.
for (const [width, height] of [[390, 844], [1280, 800]]) {
  test(`tsumiki.html at ${width}: a shape is laid, a level's witness wins it, and nothing runs off the page`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const errors = await open(page, "tsumiki.html");
    await expect(page.locator("#grid [data-cell]")).toHaveCount(64);
    await expect(page.locator("#tray [data-slot]")).toHaveCount(3);
    await page.locator('#tray [data-slot="0"]').click();
    await expect(page.locator('#tray [data-slot="0"]')).toHaveAttribute("aria-pressed", "true");
    await page.locator('#grid [data-fits="true"]').first().click();
    await expect(page.locator("#moves")).toHaveText("1");
    await expect(page.locator('#tray [data-slot="0"]')).toBeDisabled();

    const level = levelManifest[0];
    await page.locator("#level").selectOption(level.id);
    await page.locator("#new").click();
    await expect(page.locator("#objective")).toBeVisible();
    for (const [slot, row, column] of level.witness) {
      await page.locator(`#tray [data-slot="${slot}"]`).click();
      await page.locator(`#grid [data-cell="${row * 8 + column}"]`).click();
    }
    await expect(page.locator("#ending-title")).toHaveText("Level complete");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}
