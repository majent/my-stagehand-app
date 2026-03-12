import { ActResult, V3 } from "@browserbasehq/stagehand";

export async function calculateCostMetrics(
  stagehand: V3,
  inputCostPerMtok: number,
  outputCostPerMtok: number,
  cacheHitCostPerMtok: number,
) {
  const metrics = await stagehand.metrics;

  const toDollars = (tokens: number, ratePerMillion: number) =>
    (tokens * ratePerMillion) / 1000000;

  const actInputCost = toDollars(metrics.totalPromptTokens, inputCostPerMtok);
  const actOutputCost = toDollars(
    metrics.totalCompletionTokens + metrics.totalReasoningTokens,
    outputCostPerMtok,
  );
  const actCacheHitCost = toDollars(
    metrics.totalCachedInputTokens,
    cacheHitCostPerMtok,
  );

  console.log(``);
  console.log(`----------Total token usage----------`);
  console.log(`  promptTokens: ${metrics.totalPromptTokens}`);
  console.log(`  completionTokens: ${metrics.totalCompletionTokens}`);
  console.log(`  reasoningTokens: ${metrics.totalReasoningTokens}`);
  console.log(`  cachedInputTokens: ${metrics.totalCachedInputTokens}`);

  console.log(`----------Total cost estimate (Claude Sonnet 4.5)----------`);
  console.log(
    `  total: $${(actInputCost + actOutputCost + actCacheHitCost).toFixed(6)}`,
  );
  console.log(`  input: $${actInputCost.toFixed(6)}`);
  console.log(`  output: $${actOutputCost.toFixed(6)}`);
  console.log(`  cacheHit: $${actCacheHitCost.toFixed(6)}`);
}

export async function logActResults(actResults: ActResult[]) {
  console.log(``);
  console.log(`----------Act results----------`);
  actResults.forEach((result, index) => {
    console.log(`act result ${index + 1}`);
    console.log(`  success: ${result.success}`);
    console.log(`  message: ${result.message}`);
    console.log(`  actionDescription: ${result.actionDescription}`);
    console.log(`  actions: ${JSON.stringify(result.actions)}`);
    console.log(`  cacheStatus: ${result.cacheStatus}`);
  });
}
