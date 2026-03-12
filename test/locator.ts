import { Stagehand } from "@browserbasehq/stagehand";
import "dotenv/config";

async function main() {
  const stagehand = new Stagehand({
    env: "LOCAL",
    // cacheDir: "cache/haiku",
    cacheDir: "cache/sonnet",
    domSettleTimeout: 3000,
    model: {
      provider: "anthropic",
      apiKey: process.env.ANTHROPIC_API_KEY,
      modelName: "anthropic/claude-sonnet-4-5-20250929",
      // modelName: "anthropic/claude-haiku-4-5-20251001",
    },
    localBrowserLaunchOptions: {
      headless: false, // Show browser window
      viewport: { width: 1512, height: 1200 },
    },
  });

  await stagehand.init();

  console.log(`Stagehand Session Started`);
  console.log(
    `Watch live: https://browserbase.com/sessions/${stagehand.browserbaseSessionId}`,
  );

  const page = stagehand.context.pages()[0];
  const waitForTimeout = 3000;

  await page.goto("https://app.nearme.jp/airport-shuttle/");
  await page.waitForTimeout(waitForTimeout);

  await page.locator('//*[@id="search-form"]//*[.="羽田空港"]').click();
  await page.waitForTimeout(waitForTimeout);

  await page.locator('//*[@id="search-form"]//*[.="成田空港"]').click();
  await page.waitForTimeout(waitForTimeout);

  await page
    .locator('//*[@id="search-form"]//*[.="ターミナルを入力"]')
    .nth(2)
    .click();
  await page.waitForTimeout(waitForTimeout);

  await page
    .locator('//select[.//option[contains(.,"第1ターミナル")]]')
    .selectOption("第1ターミナル");
  await page.waitForTimeout(waitForTimeout);

  await page.waitForTimeout(10000);

  await stagehand.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
