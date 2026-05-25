import fs from "node:fs";
import path from "node:path";
import { ensureDir, readJson } from "./server-utils.js";

const root = process.cwd();
const docsData = path.join(root, "docs", "data");
const artifactsDir = path.join(root, "docs", "artifacts");
ensureDir(docsData);

function writeModule(file, exportName, data) {
  fs.writeFileSync(path.join(docsData, file), `export const ${exportName} = ${JSON.stringify(data, null, 2)};\n`);
}

writeModule("metrics.js", "technicalMetrics", readJson(path.join(root, "results", "processed", "technical-metrics.json"), []));
writeModule("scoringMatrix.js", "scoringMatrix", readJson(path.join(root, "results", "processed", "scoring-matrix.json"), []));
writeModule("demoDataset.js", "demoDataset", readJson(path.join(root, "data", "dataset-500.json"), []).slice(0, 20));
const justificationPath = path.join(root, "results", "processed", "scoring-justification.md");
writeModule("scoringJustification.js", "scoringJustification", fs.existsSync(justificationPath) ? fs.readFileSync(justificationPath, "utf8") : "Ожидает запуска тестов.");
writeModule("environment.js", "environmentInfo", readJson(path.join(root, "results", "environment.json"), {}));

function copyRecursive(source, target, options = {}) {
  if (!fs.existsSync(source)) return;
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    ensureDir(target);
    for (const entry of fs.readdirSync(source)) {
      if (options.exclude?.some((pattern) => pattern.test(entry))) continue;
      copyRecursive(path.join(source, entry), path.join(target, entry), options);
    }
    return;
  }
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
}

fs.rmSync(artifactsDir, { recursive: true, force: true });
copyRecursive(path.join(root, "results"), path.join(artifactsDir, "results"));
copyRecursive(path.join(root, "data"), path.join(artifactsDir, "data"));
copyRecursive(path.join(root, "tests"), path.join(artifactsDir, "tests"));
copyRecursive(path.join(root, "apps"), path.join(artifactsDir, "apps"), {
  exclude: [/^dist$/, /^node_modules$/]
});
copyRecursive(path.join(root, "results", "charts"), path.join(root, "docs", "charts"));

console.log("Docs data modules and self-contained artifacts synced.");
