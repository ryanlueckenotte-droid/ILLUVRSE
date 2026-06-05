import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const outputPath = path.join(process.cwd(), "automation", "output", "homepage.png");
const targetUrl = "http://localhost:3000";

function assertLocalhost(url: string) {
  const parsed = new URL(url);
  const allowedHosts = new Set(["localhost", "127.0.0.1"]);

  if (!allowedHosts.has(parsed.hostname)) {
    throw new Error(`Blocked non-local automation target: ${url}`);
  }
}

async function main() {
  assertLocalhost(targetUrl);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  console.log(`Opening ${targetUrl}`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

  await page.goto(targetUrl, { waitUntil: "networkidle" });
  await page.screenshot({ path: outputPath, fullPage: true });
  await browser.close();

  console.log(`Saved screenshot to ${outputPath}`);
}

main().catch((error) => {
  console.error("Screenshot test failed.");
  console.error(error);
  process.exit(1);
});
