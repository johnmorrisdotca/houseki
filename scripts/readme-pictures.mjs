// Reproducible pictures of the shipped players, using the shared family renderer.
import { takePictures } from "./readme-pictures-lib.mjs";

const gameShot = (subject, url, prepare) => ({
  subject,
  url,
  target: ".game-screen",
  ready: ".game-screen .gem:not(.ghost)",
  prepare,
});
const campaign = (prefix, number) => async (page) => {
  await page.locator("#campaign").selectOption(prefix.slice(0, -1));
  const value = await page
    .locator("#level option")
    .evaluateAll(
      (options, { prefix, number }) => options.filter((option) => option.value.startsWith(prefix))[number - 1].value,
      { prefix, number },
    );
  await page.locator("#level").selectOption(value);
  await page.locator("#new").click();
};
await takePictures({
  shots: [
    { subject: "hero", views: ["desk"], url: "/tools.html?lang=en", ready: ".game-screen .gem:not(.ghost)" },
    {
      subject: "hero",
      views: ["phone"],
      url: "/tools.html?lang=ja",
      target: ".game-screen",
      ready: ".game-screen .gem:not(.ghost)",
    },
    gameShot("falling-triplets", "/index.html"),
    gameShot("colour-chains", "/chains.html"),
    gameShot("stone-collapse", "/tools.html", async (page) => {
      await page.locator("#game").selectOption("stone-collapse");
      await page.locator("#new").click();
    }),
    gameShot("gem-swap", "/tools.html"),
    gameShot("magnetic-blocks", "/blocks.html", async (page) => {
      await page.locator("#level").selectOption({ index: 97 });
      await page.locator("#new").click();
    }),
    gameShot("shizen", "/chains.html", campaign("shizen-", 97)),
    gameShot("arashi", "/chains.html", campaign("arashi-", 97)),
    {
      subject: "tool-tray",
      views: ["phone"],
      url: "/tools.html",
      target: ".game-screen",
      ready: ".game-screen .gem:not(.ghost)",
    },
  ],
  // The family's thumbnail, dark thumbnail and icon (scripts/family-thumbnail.mjs): a Gem Swap board dealt from a fixed
  // seed, off the felt; the icon is four gems of four colours from it, without the board's frame.
  thumbnail: {
    url: "/tools.html?lang=en&seed=houseki",
    ready: ".game-screen .gem:not(.ghost)",
    target: "#grid",
    label: "Houseki 宝石",
    async prepare(page) {
      await page.evaluate(() => document.activeElement?.blur());
    },
    icon: {
      async prepare(page) {
        await page.locator("#grid").evaluate((grid) => {
          const cols = Number(getComputedStyle(grid).getPropertyValue("--cols"));
          const cells = [...grid.querySelectorAll(".full-cell")];
          const colour = (index) => cells[index]?.dataset.colour;
          const corner = cells.findIndex((_, index) => {
            const four = [index, index + 1, index + cols, index + cols + 1].map(colour);
            return index % cols < cols - 1 && new Set(four).size === 4 && four.every(Boolean);
          });
          const keep = new Set([corner, corner + 1, corner + cols, corner + cols + 1]);
          cells.forEach((cell, index) => {
            if (!keep.has(index)) cell.style.setProperty("visibility", "hidden", "important");
          });
          grid.style.setProperty("border-color", "transparent", "important");
          grid.style.setProperty("background", "transparent", "important");
        });
      },
    },
  },
});
