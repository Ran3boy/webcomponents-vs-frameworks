import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopServer, writeJson } from "./server-utils.js";
import { technologies } from "./catalog-utils.js";

const root = process.cwd();
const conflictCss = `
  .card {
    background: red !important;
    font-size: 40px !important;
  }

  button {
    border: 10px solid black !important;
  }

  div {
    box-sizing: content-box !important;
  }
`;

async function getSignature(page) {
  return page.locator("[data-testid='catalog-card']").first().evaluate((card) => {
    const button = document.querySelector("[data-testid='reset-button']") || card.getRootNode().querySelector("[data-testid='reset-button']");
    const cardStyles = getComputedStyle(card);
    const buttonStyles = getComputedStyle(button);
    return {
      cardBackground: cardStyles.backgroundColor,
      cardFontSize: cardStyles.fontSize,
      buttonBorderWidth: buttonStyles.borderTopWidth,
      gridBoxSizing: getComputedStyle(card.parentElement).boxSizing
    };
  });
}

function classify(before, after) {
  const changed = Object.keys(before).filter((key) => before[key] !== after[key]);
  if (changed.length === 0) return { result: "passed", changed };
  if (changed.length <= 2) return { result: "partial", changed };
  return { result: "failed", changed };
}

const browser = await chromium.launch();
const results = [];
try {
  for (const tech of technologies) {
    const server = await startStaticServer(path.join(root, tech.dist), tech.port);
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    await page.goto(`http://127.0.0.1:${tech.port}/`, { waitUntil: "networkidle" });
    await page.locator("[data-testid='catalog-card']").first().waitFor({ state: "visible" });
    const before = await getSignature(page);
    await page.addStyleTag({ content: conflictCss });
    await page.waitForTimeout(150);
    const after = await getSignature(page);
    const verdict = classify(before, after);
    const result = {
      technology: tech.name,
      technologyId: tech.id,
      status: "measured",
      runDate: new Date().toISOString(),
      conflictCss,
      before,
      after,
      styleIsolation: verdict.result,
      changedProperties: verdict.changed
    };
    writeJson(path.join(root, "results", "raw", tech.id, "style-isolation.json"), result);
    results.push(result);
    await page.close();
    await stopServer(server);
  }
} finally {
  await browser.close();
}

console.table(results.map(({ technology, styleIsolation, changedProperties }) => ({
  technology,
  styleIsolation,
  changedProperties: changedProperties.join(", ")
})));
