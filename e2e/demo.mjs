// What every demo test starts from: the built demo in `site/`, served to the page without a port, and a listener for
// whatever the page complains of.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const site = join(dirname(fileURLToPath(import.meta.url)), "..", "site");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };

export const ORIGIN = "http://houseki.test";

/** Serve `site/` to a page at http://houseki.test/. */
export async function serve(page) {
  if (!existsSync(join(site, "index.html"))) throw new Error("site/ is not built: run `pnpm site` first (`pnpm test:demo` does)");
  await page.route(`${ORIGIN}/**`, (route) => {
    const { pathname } = new URL(route.request().url());
    const file = join(site, pathname.endsWith("/") ? `${pathname}index.html` : pathname);
    if (!existsSync(file)) return route.fulfill({ status: 404, body: "" });
    return route.fulfill({ body: readFileSync(file), contentType: TYPES[file.slice(file.lastIndexOf("."))] ?? "application/octet-stream" });
  });
}

/** Collect anything the page complains of: a script error, a console error, a request that failed, a missing file. */
function listen(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  page.on("requestfailed", (request) => errors.push(`Failed resource: ${request.url()}`));
  page.on("response", (response) => {
    if (response.status() >= 400 && ["script", "stylesheet", "document", "font", "image"].includes(response.request().resourceType())) errors.push(`HTTP ${response.status()}: ${response.url()}`);
  });
  return errors;
}

/** Serve the demo to the page and start listening; returns the list of what the page complains of. Go to a page with `page.goto(`${ORIGIN}/chains.html`)`. */
export async function start(page) {
  const errors = listen(page);
  await serve(page);
  return errors;
}

/** Open one of the demo's pages and wait until the family's header has spoken; returns what the page complains of. */
export async function open(page, file = "index.html") {
  const errors = await start(page);
  await page.goto(`${ORIGIN}/${file}`);
  await page.waitForSelector("header h1");
  return errors;
}
