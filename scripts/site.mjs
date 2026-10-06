// Builds the static demo for GitHub Pages into ./site: each page of the demo, made from its markup in demo/ and the
// family's shared head, header, footer and language chooser, with the family's stylesheet, Houseki's own, the page's
// script and the compiled library beside it, and the API reference made from the source.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

import { PAGES } from "../demo/words.js";
import { API_CSS, apiOf, apiPage } from "./api.mjs";
import { FAMILY_SCRIPT, familyFooter, familyHead, familyHeader, familyUnreviewed } from "./family-template.mjs";

const id = "houseki";
const ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%232f5d4a'/%3E%3Ctext x='50' y='66' font-size='46' text-anchor='middle' fill='%23f3efe4'%3E%E5%AE%9D%E7%9F%B3%3C/text%3E%3C/svg%3E";

/** The row of links to the demo's pages, the page being read marked as the current one. */
const pages = (current) => `<div class="pages fam-row" data-help-en="Choose a game. Each has its own page, settings and saved progress on this device." data-help-ja="ゲームを選びます。ゲームごとにページと設定があり、進み具合はこの端末に残ります。">
    <span class="fam-label" data-say="games"></span>
    <nav class="fam-actions" aria-label="Games">${Object.entries(PAGES)
      .map(([key, page]) => `<a class="fam-button" href="${page.file}" data-say="page_${key}"${key === current ? ` aria-current="page"` : ""}></a>`)
      .join("")}</nav>
  </div>`;

function render(key) {
  const page = PAGES[key];
  const html = readFileSync(`demo/${page.file}`, "utf8");
  return html
    .replace("<!--family:head-->", `${familyHead({ id, title: page.title, description: page.description })}\n  <link rel="icon" href="${ICON}">`)
    .replace("<!--family:header-->", `${familyHeader({ id, links: [{ href: "api.html", say: "pageApi" }] })}\n  <p class="fam-fine" data-say="status"></p>`)
    .replace("<!--family:pages-->", pages(key))
    .replace("<!--family:unreviewed-->", familyUnreviewed({ id }))
    .replace("<!--family:footer-->", familyFooter({ id }))
    .replace(/<!--family:scripts ([\w.-]+)-->/, (_, script) => `<script>${FAMILY_SCRIPT}</script>\n<script type="module" src="${script}"></script>`);
}

rmSync("site", { recursive: true, force: true });
mkdirSync("site", { recursive: true });
cpSync("demo", "site", { recursive: true });
cpSync("dist", "site/dist", { recursive: true });
for (const key of Object.keys(PAGES)) writeFileSync(`site/${PAGES[key].file}`, render(key));
// The API reference, made from the source: every export of every entry point.
writeFileSync("site/api.css", API_CSS);
writeFileSync("site/api.json", JSON.stringify(apiOf(), null, 2));
writeFileSync("site/api.html", apiPage({ id, name: "Houseki", icon: ICON }));
console.log("site/ is ready: serve it, or let the Pages workflow publish it.");
