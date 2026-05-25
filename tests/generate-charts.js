import fs from "node:fs";
import path from "node:path";
import { ensureDir, readJson } from "./server-utils.js";

const root = process.cwd();
const chartsDir = path.join(root, "results", "charts");
ensureDir(chartsDir);

const metrics = readJson(path.join(root, "results", "processed", "technical-metrics.json"), []);
const scoring = readJson(path.join(root, "results", "processed", "scoring-matrix.json"), []);

function barChart(file, title, key, unit) {
  const width = 860;
  const height = 360;
  const margin = { left: 150, top: 48, right: 36, bottom: 48 };
  const max = Math.max(...metrics.map((item) => Number(item[key]) || 0), 1);
  const rowHeight = 44;
  const bars = metrics.map((item, index) => {
    const value = Number(item[key]) || 0;
    const y = margin.top + index * rowHeight;
    const barWidth = ((width - margin.left - margin.right) * value) / max;
    return `
      <text x="20" y="${y + 24}" font-size="14" fill="#334155">${item.technology}</text>
      <rect x="${margin.left}" y="${y}" width="${barWidth}" height="28" rx="4" fill="#0f766e" />
      <text x="${margin.left + barWidth + 8}" y="${y + 20}" font-size="13" fill="#334155">${value} ${unit}</text>`;
  }).join("");
  fs.writeFileSync(path.join(chartsDir, file), `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" role="img" aria-label="${title}">
    <rect width="100%" height="100%" fill="#ffffff" />
    <text x="20" y="28" font-size="20" font-weight="700" fill="#0f172a">${title}</text>
    ${bars}
  </svg>\n`);
}

function updateChart() {
  const width = 920;
  const height = 390;
  const keys = ["search_update_ms", "filter_update_ms", "sort_update_ms"];
  const labels = ["Search", "Filter", "Sort"];
  const colors = ["#2563eb", "#16a34a", "#d97706"];
  const max = Math.max(...metrics.flatMap((item) => keys.map((key) => Number(item[key]) || 0)), 1);
  const groups = metrics.map((item, groupIndex) => {
    const y = 58 + groupIndex * 58;
    const bars = keys.map((key, index) => {
      const value = Number(item[key]) || 0;
      const widthValue = (value / max) * 560;
      return `<rect x="170" y="${y + index * 14}" width="${widthValue}" height="10" fill="${colors[index]}" /><text x="${178 + widthValue}" y="${y + 9 + index * 14}" font-size="11" fill="#334155">${value}</text>`;
    }).join("");
    return `<text x="20" y="${y + 22}" font-size="14" fill="#334155">${item.technology}</text>${bars}`;
  }).join("");
  const legend = labels.map((label, index) => `<rect x="${170 + index * 110}" y="350" width="14" height="14" fill="${colors[index]}" /><text x="${190 + index * 110}" y="362" font-size="12" fill="#334155">${label}</text>`).join("");
  fs.writeFileSync(path.join(chartsDir, "update-time.svg"), `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" role="img" aria-label="Update time">
    <rect width="100%" height="100%" fill="#ffffff" />
    <text x="20" y="28" font-size="20" font-weight="700" fill="#0f172a">Update time, ms</text>
    ${groups}
    ${legend}
  </svg>\n`);
}

function heatmap() {
  const width = 980;
  const height = 360;
  const cell = 54;
  const criteria = ["K1", "K2", "K3", "K4", "K5", "K6", "K7", "K8", "K9", "K10"];
  const palette = ["#f8fafc", "#fee2e2", "#fde68a", "#bbf7d0"];
  const header = criteria.map((criterion, index) => `<text x="${185 + index * cell}" y="58" font-size="13" text-anchor="middle" fill="#334155">${criterion}</text>`).join("");
  const rows = scoring.map((row, rowIndex) => {
    const y = 76 + rowIndex * cell;
    const cells = criteria.map((criterion, index) => {
      const value = Number(row[criterion]) || 0;
      const x = 158 + index * cell;
      return `<rect x="${x}" y="${y}" width="44" height="38" rx="4" fill="${palette[value]}" stroke="#cbd5e1" /><text x="${x + 22}" y="${y + 24}" font-size="15" text-anchor="middle" fill="#0f172a">${value}</text>`;
    }).join("");
    return `<text x="20" y="${y + 24}" font-size="14" fill="#334155">${row.technology}</text>${cells}`;
  }).join("");
  fs.writeFileSync(path.join(chartsDir, "scoring-heatmap.svg"), `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" role="img" aria-label="K1-K10 scoring heatmap">
    <rect width="100%" height="100%" fill="#ffffff" />
    <text x="20" y="28" font-size="20" font-weight="700" fill="#0f172a">K1-K10 heatmap</text>
    ${header}
    ${rows}
  </svg>\n`);
}

barChart("bundle-size.svg", "Bundle size, KB", "bundle_size_kb", "KB");
barChart("initial-render.svg", "Initial render, ms", "initial_render_ms", "ms");
updateChart();
heatmap();

console.log("Charts generated in results/charts/");
