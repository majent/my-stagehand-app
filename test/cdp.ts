import CDP from "chrome-remote-interface";
import { writeFile } from "node:fs/promises";
import path from "node:path";

async function cdp() {
  const client = await CDP();
  const { Accessibility, DOM, Page } = client;
  await Page.enable();
  await DOM.enable();
  await Accessibility.enable();

  try {
    await Page.navigate({ url: "http://app.nearme.jp/airport-shuttle/" });
    await Page.loadEventFired();

    const result = await DOM.getDocument({ depth: -1, pierce: true });
    const axTree = await Accessibility.getFullAXTree({});

    const outputDir = path.join(process.cwd(), "output");

    await writeFile(
      path.join(outputDir, "dom.json"),
      JSON.stringify(result.root, null, 2),
      "utf8",
    );
    await writeFile(
      path.join(outputDir, "ax-tree.json"),
      JSON.stringify(axTree.nodes, null, 2),
      "utf8",
    );

    console.log(`Saved DOM and AX tree to ${outputDir}`);
  } finally {
    await client.close();
  }
}

cdp();
