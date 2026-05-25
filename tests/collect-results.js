import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { technologies } from "./catalog-utils.js";
import { ensureDir, readJson, writeJson } from "./server-utils.js";

const root = process.cwd();
const processedDir = path.join(root, "results", "processed");
ensureDir(processedDir);

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(file, rows, columns) {
  const lines = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))
  ];
  fs.writeFileSync(file, `${lines.join("\n")}\n`);
}

function styleScore(value) {
  if (value === "passed") return 3;
  if (value === "partial") return 2;
  return 1;
}

function performanceScores(metrics) {
  const scored = metrics.map((item) => ({
    technology: item.technology,
    composite: item.initial_render_ms + item.search_update_ms + item.filter_update_ms + item.sort_update_ms + item.bundle_size_kb
  })).sort((a, b) => a.composite - b.composite);
  const scores = new Map();
  scored.forEach((item, index) => {
    scores.set(item.technology, index < 2 ? 3 : index < 4 ? 2 : 1);
  });
  return scores;
}

const technicalRows = technologies.map((tech) => {
  const performance = readJson(path.join(root, "results", "raw", tech.id, "performance.json"));
  const style = readJson(path.join(root, "results", "raw", tech.id, "style-isolation.json"));
  const integration = readJson(path.join(root, "results", "raw", tech.id, "integration.json"));
  if (!performance || !style || !integration) {
    return {
      technology: tech.name,
      bundle_size_kb: "",
      initial_render_ms: "",
      search_update_ms: "",
      filter_update_ms: "",
      sort_update_ms: "",
      fcp_ms: "",
      lcp_ms: "",
      tbt_ms: "",
      cls: "",
      style_isolation: style?.styleIsolation || "awaiting_test_run",
      integration_result: integration?.result || "awaiting_test_run",
      status: "awaiting_test_run"
    };
  }

  return {
    technology: tech.name,
    bundle_size_kb: performance.bundleSizeKb,
    initial_render_ms: performance.initialRenderMs,
    search_update_ms: performance.searchUpdateMs,
    filter_update_ms: performance.filterUpdateMs,
    sort_update_ms: performance.sortUpdateMs,
    fcp_ms: performance.fcpMs,
    lcp_ms: performance.lcpMs,
    tbt_ms: performance.tbtMs,
    cls: performance.cls,
    style_isolation: style.styleIsolation,
    integration_result: integration.result,
    status: "measured"
  };
});

const perfScoreMap = performanceScores(technicalRows.filter((row) => row.status === "measured"));

const qualitative = {
  "Web Components": { K1: 3, K2: 3, K4: 1, K5: 3, K6: 3, K7: 1, K8: 2, K10: 1 },
  React: { K1: 3, K2: 2, K4: 3, K5: 1, K6: 1, K7: 3, K8: 3, K10: 3 },
  "Vue.js": { K1: 3, K2: 2, K4: 3, K5: 2, K6: 1, K7: 3, K8: 2, K10: 3 },
  Svelte: { K1: 3, K2: 2, K4: 3, K5: 2, K6: 2, K7: 2, K8: 2, K10: 2 },
  Lit: { K1: 3, K2: 3, K4: 2, K5: 3, K6: 3, K7: 2, K8: 2, K10: 2 }
};

const scoringRows = technicalRows.map((row) => ({
  technology: row.technology,
  K1: qualitative[row.technology].K1,
  K2: qualitative[row.technology].K2,
  K3: styleScore(row.style_isolation),
  K4: qualitative[row.technology].K4,
  K5: qualitative[row.technology].K5,
  K6: qualitative[row.technology].K6,
  K7: qualitative[row.technology].K7,
  K8: qualitative[row.technology].K8,
  K9: perfScoreMap.get(row.technology) || "",
  K10: qualitative[row.technology].K10,
  status: row.status === "measured" ? "measured_and_justified" : "awaiting_test_run"
}));

writeCsv(path.join(processedDir, "technical-metrics.csv"), technicalRows, [
  "technology", "bundle_size_kb", "initial_render_ms", "search_update_ms", "filter_update_ms", "sort_update_ms",
  "fcp_ms", "lcp_ms", "tbt_ms", "cls", "style_isolation", "integration_result", "status"
]);
writeJson(path.join(processedDir, "technical-metrics.json"), technicalRows);

writeCsv(path.join(processedDir, "scoring-matrix.csv"), scoringRows, [
  "technology", "K1", "K2", "K3", "K4", "K5", "K6", "K7", "K8", "K9", "K10", "status"
]);
writeJson(path.join(processedDir, "scoring-matrix.json"), scoringRows);

const runDate = new Date().toISOString();
writeJson(path.join(root, "results", "environment.json"), {
  runDate,
  os: `${os.type()} ${os.release()} ${os.arch()}`,
  nodeVersion: process.version,
  browser: "Chromium via Playwright",
  browserVersion: "Recorded by installed Playwright browser runtime",
  datasetSize: 500,
  testRunner: "Node.js scripts + Playwright",
  notes: "Run with npm run test:all; performance values are collected from built applications served locally."
});

function criterionSource(technology, criterion, score, metricRow) {
  const base = {
    K1: "Source component structure in apps/",
    K2: "DOM boundary and framework/component model in source code",
    K3: `Style conflict result: ${metricRow.style_isolation}`,
    K4: "Search/filter/sort implementation and update-time measurements",
    K5: `Integration result: ${metricRow.integration_result}`,
    K6: "Runtime and ecosystem dependency observation",
    K7: "Build scripts, framework devtools and package structure",
    K8: "Architecture conventions and scaling pattern",
    K9: `Bundle/render/update metrics from technical-metrics.json`,
    K10: "UI ecosystem, UI-kit compatibility, a11y and i18n maturity"
  }[criterion];
  return `- ${criterion}: ${score} балл(а). Основание: ${base}. Артефакты: apps/, results/raw/${technologies.find((tech) => tech.name === technology).id}/, results/processed/technical-metrics.json.`;
}

const justification = [
  "# Обоснование оценок K1-K10",
  "",
  "Шкала: 0 - свойство отсутствует; 1 - поддерживается слабо; 2 - поддерживается частично или с ограничениями; 3 - поддерживается полноценно как штатная возможность. Для K6 используется инвертированная логика: чем меньше зависимость от экосистемы, тем выше балл.",
  "",
  "Оценки не суммируются в общий рейтинг: матрица показывает профиль применимости технологии."
];

for (const row of scoringRows) {
  const metricRow = technicalRows.find((item) => item.technology === row.technology);
  justification.push("", `## ${row.technology}`, "");
  for (const criterion of ["K1", "K2", "K3", "K4", "K5", "K6", "K7", "K8", "K9", "K10"]) {
    justification.push(criterionSource(row.technology, criterion, row[criterion], metricRow));
  }
}

fs.writeFileSync(path.join(processedDir, "scoring-justification.md"), `${justification.join("\n")}\n`);

fs.writeFileSync(path.join(processedDir, "conclusions.md"), `# Выводы\n\nWeb Components и Lit сильнее в переносимости, DOM-инкапсуляции и изоляции стилей. React, Vue.js и Svelte удобнее для прикладной разработки со сложным состоянием и развитым tooling. Svelte может показывать сильный профиль по производительности после компиляции. Выбор технологии зависит от проектного профиля; универсальный победитель не выделяется.\n`);

console.log("Processed metrics, scoring matrix, environment and justification generated.");
