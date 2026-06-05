import { chromium } from "@playwright/test";

const targetUrl = "http://localhost:3000/settings";

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
  console.log("Reading the local model field without saving changes.");
  const modelInput = page.locator("input").first();
  console.log(`Current model field value: ${await modelInput.inputValue()}`);

  await browser.close();
  console.log("Form fill safety test complete.");
}

main().catch((error) => {
  console.error("Form fill test failed.");
  console.error(error);
  process.exit(1);
});
