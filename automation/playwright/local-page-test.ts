import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const targetUrl = "http://localhost:3000/lab/canvas";
const outputPath = path.join(process.cwd(), "automation", "output", "canvas-test.png");

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

  console.log("ILLUVRSE Local Canvas Training Test");
  console.log(`Opening ${targetUrl}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto(targetUrl, { waitUntil: "networkidle" });

  console.log("Step 1: Click Draw Circle");
  await page.getByRole("button", { name: "Draw Circle" }).click();

  console.log("Step 2: Click Draw Rectangle");
  await page.getByRole("button", { name: "Draw Rectangle" }).click();

  console.log("Step 3: Click Animate Ball");
  await page.getByRole("button", { name: "Animate Ball" }).click();
  await page.waitForTimeout(1200);

  console.log("Step 4: Take screenshot");
  await page.screenshot({ path: outputPath, fullPage: true });

  await browser.close();
  console.log(`Saved screenshot to ${outputPath}`);
  console.log("Local canvas training test complete.");
}

main().catch((error) => {
  console.error("Local page test failed.");
  console.error(error);
  process.exit(1);
});
