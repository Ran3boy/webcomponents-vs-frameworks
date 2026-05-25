import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { directorySizeKb, startStaticServer, stopServer, writeJson } from "./server-utils.js";
import { technologies } from "./catalog-utils.js";

const root = process.cwd();

async function average(values) {
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

async function measureUpdate(page, action) {
  const start = await page.evaluate(() => performance.now());
  await action();
  await page.waitForFunction(() => document.querySelector("[data-testid='catalog-root']") || document.body.textContent.includes("Найдено"));
  await page.waitForTimeout(40);
  const end = await page.evaluate(() => performance.now());
  return Number((end - start).toFixed(2));
}

async function measureTechnology(browser, tech) {
  const server = await startStaticServer(path.join(root, tech.dist), tech.port);
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.addInitScript(() => {
    window.__experimentMetrics = { lcp: 0, cls: 0, longTasks: [] };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__experimentMetrics.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__experimentMetrics.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__experimentMetrics.longTasks.push(entry.duration);
    }).observe({ type: "longtask", buffered: true });
  });

  const url = `http://127.0.0.1:${tech.port}/`;
  const start = Date.now();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator("[data-testid='catalog-card']").first().waitFor({ state: "visible" });
  const initialRenderMs = Date.now() - start;
  await page.waitForTimeout(250);

  const browserMetrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    const paint = performance.getEntriesByType("paint");
    const fcp = paint.find((entry) => entry.name === "first-contentful-paint")?.startTime || 0;
    const tbt = (window.__experimentMetrics.longTasks || []).reduce((sum, duration) => sum + Math.max(0, duration - 50), 0);
    return {
      fcpMs: Number(fcp.toFixed(2)),
      lcpMs: Number((window.__experimentMetrics.lcp || navigation.domContentLoadedEventEnd || 0).toFixed(2)),
      tbtMs: Number(tbt.toFixed(2)),
      cls: Number((window.__experimentMetrics.cls || 0).toFixed(4))
    };
  });

  const searchTimes = [];
  const filterTimes = [];
  const sortTimes = [];
  for (let i = 0; i < 5; i += 1) {
    searchTimes.push(await measureUpdate(page, () => page.locator("[data-testid='search-input']").fill(`grid ${i}`)));
    filterTimes.push(await measureUpdate(page, () => page.locator("[data-testid='category-filter']").selectOption("Data")));
    sortTimes.push(await measureUpdate(page, () => page.locator("[data-testid='sort-select']").selectOption(i % 2 ? "name" : "complexity")));
    await page.locator("[data-testid='reset-button']").click();
  }

  await page.close();
  await stopServer(server);

  const result = {
    technology: tech.name,
    technologyId: tech.id,
    status: "measured",
    runDate: new Date().toISOString(),
    datasetSize: 500,
    browser: "chromium",
    os: `${os.type()} ${os.release()}`,
    bundleSizeKb: directorySizeKb(path.join(root, tech.dist)),
    initialRenderMs,
    searchUpdateMs: await average(searchTimes),
    filterUpdateMs: await average(filterTimes),
    sortUpdateMs: await average(sortTimes),
    ...browserMetrics,
    samples: {
      searchTimes,
      filterTimes,
      sortTimes
    }
  };

  writeJson(path.join(root, "results", "raw", tech.id, "performance.json"), result);
  writeJson(path.join(root, "results", "raw", tech.id, "lighthouse.json"), {
    technology: tech.name,
    status: "measured_via_playwright_navigation_timing",
    note: "The experiment records browser Performance API values instead of running Lighthouse CLI.",
    fcpMs: result.fcpMs,
    lcpMs: result.lcpMs,
    tbtMs: result.tbtMs,
    cls: result.cls
  });

  return result;
}

const browser = await chromium.launch();
const results = [];
try {
  for (const tech of technologies) {
    results.push(await measureTechnology(browser, tech));
  }
} finally {
  await browser.close();
}

console.table(results.map(({ technology, bundleSizeKb, initialRenderMs, searchUpdateMs, filterUpdateMs, sortUpdateMs }) => ({
  technology,
  bundleSizeKb,
  initialRenderMs,
  searchUpdateMs,
  filterUpdateMs,
  sortUpdateMs
})));
