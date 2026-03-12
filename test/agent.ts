import { Stagehand } from "@browserbasehq/stagehand";
import "dotenv/config";
import { calculateCostMetrics } from "./utils.js";

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

  await page.goto("https://app.nearme.jp/airport-shuttle/");

  const agent = stagehand.agent({
    mode: "dom",
    model: "anthropic/claude-sonnet-4-5-20250929",
    systemPrompt: "You're a helpful assistant that can control a web browser.",
  });

  const agentResult = await agent.execute({
    instruction:
      "「空港へ」の下に表示されている予約フォームにて「成田空港」と「第1ターミナル」を選択。",
    maxSteps: 20,
    highlightCursor: true,
  });
  console.log(`Agent result:\n`, agentResult);

  await calculateCostMetrics(stagehand, 3, 15, 0.3);

  await page.waitForTimeout(10000);

  await stagehand.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
