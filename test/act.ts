import { ActResult, Stagehand } from "@browserbasehq/stagehand";
import "dotenv/config";
import { calculateCostMetrics, logActResults } from "./utils.js";

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
  const actResults: ActResult[] = [];

  await page.goto("https://app.nearme.jp/airport-shuttle/");

  actResults.push(
    await stagehand.act("「空港へ」の下に表示されている「羽田空港」をクリック"),
  );
  await page.waitForTimeout(waitForTimeout);

  actResults.push(
    await stagehand.act(
      "「どの空港へ行きますか？」の下に表示されているの空港の一覧から「成田空港」をクリック",
    ),
  );
  await page.waitForTimeout(waitForTimeout);

  actResults.push(await stagehand.act("「ターミナルを入力」をクリック"));
  await page.waitForTimeout(waitForTimeout);

  actResults.push(
    await stagehand.act(
      "「ターミナルを選択してください」の下に表示されているSelectから「第1ターミナル」を選択",
    ),
  );
  await page.waitForTimeout(waitForTimeout);

  logActResults(actResults);

  await calculateCostMetrics(stagehand, 3, 15, 0.3);

  await page.waitForTimeout(10000);

  await stagehand.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
