import { chromium } from "@playwright/test";

async function main() {
  console.log("ILLUVRSE Browser Check");
  console.log("Launching local Chromium...");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Opening a blank local browser page...");
  await page.goto("about:blank");
  console.log(`Browser title: ${await page.title() || "(blank)"}`);

  await browser.close();
  console.log("Browser check complete.");
}

main().catch((error) => {
  console.error("Browser check failed.");
  console.error(error);
  process.exit(1);
});
