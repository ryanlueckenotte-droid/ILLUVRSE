import { chromium } from "@playwright/test";

const targetUrl = "http://localhost:3000/lab/canvas";

function assertLocalhost(url: string) {
  const parsed = new URL(url);
  const allowedHosts = new Set(["localhost", "127.0.0.1"]);

  if (!allowedHosts.has(parsed.hostname)) {
    throw new Error(`Blocked non-local automation target: ${url}`);
  }
}

async function main() {
  assertLocalhost(targetUrl);

  console.log(`Opening ${targetUrl}`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(targetUrl, { waitUntil: "networkidle" });
  console.log("Clicking Draw Circle.");
  await page.getByRole("button", { name: "Draw Circle" }).click();

  console.log("Click test complete.");
  await browser.close();
}

main().catch((error) => {
  console.error("Click test failed.");
  console.error(error);
  process.exit(1);
});
