import fs from "node:fs";
import path from "node:path";
import { categories } from "./catalog-utils.js";

const root = process.cwd();
const dataDir = path.join(root, "data");
fs.mkdirSync(dataDir, { recursive: true });

const titles = [
  "Adaptive card", "Data grid", "Search panel", "Filter chip", "Modal window",
  "Progress indicator", "Navigation rail", "Form field", "Toast message", "Tree view"
];

const descriptions = [
  "Reusable interface element for dashboard scenarios",
  "Interactive block with stateful filtering and sorting",
  "Compact UI pattern for production applications",
  "Component prepared for design-system integration",
  "Element with keyboard-friendly controls and stable layout"
];

function makeItem(index) {
  const category = categories[index % categories.length];
  const title = `${titles[index % titles.length]} ${String(index + 1).padStart(4, "0")}`;
  return {
    id: `catalog-${String(index + 1).padStart(4, "0")}`,
    title,
    category,
    description: descriptions[index % descriptions.length],
    complexity: (index % 5) + 1,
    rating: Number((3.5 + ((index * 17) % 15) / 10).toFixed(1)),
    updated: `2026-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 27) + 1).padStart(2, "0")}`
  };
}

for (const size of [100, 500, 1000]) {
  const items = Array.from({ length: size }, (_, index) => makeItem(index));
  fs.writeFileSync(path.join(dataDir, `dataset-${size}.json`), `${JSON.stringify(items, null, 2)}\n`);
}

console.log("Generated datasets: 100, 500, 1000");
