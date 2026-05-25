import { technicalMetrics } from "./data/metrics.js";
import { scoringMatrix } from "./data/scoringMatrix.js";
import { scoringJustification } from "./data/scoringJustification.js";
import { environmentInfo } from "./data/environment.js";

const demoItems = [
  { title: "Adaptive card 0001", category: "Components", description: "Reusable interface element", rating: 4.7, complexity: 2 },
  { title: "Data grid 0002", category: "Data", description: "Interactive block with sorting", rating: 4.5, complexity: 5 },
  { title: "Search panel 0003", category: "Forms", description: "Stateful filtering scenario", rating: 4.1, complexity: 3 },
  { title: "Navigation rail 0004", category: "Navigation", description: "Application navigation pattern", rating: 4.2, complexity: 4 },
  { title: "Toast message 0005", category: "Feedback", description: "Compact notification element", rating: 4.8, complexity: 1 }
];

function renderTable(target, rows) {
  if (!rows.length) {
    target.innerHTML = "<tbody><tr><td>Ожидает запуска тестов</td></tr></tbody>";
    return;
  }
  const columns = Object.keys(rows[0]);
  target.innerHTML = `
    <thead><tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((row) => `<tr>${columns.map((column) => `<td>${row[column]}</td>`).join("")}</tr>`).join("")}</tbody>
  `;
}

function renderStatus() {
  const statuses = new Set(technicalMetrics.map((item) => item.status));
  const status = document.getElementById("data-status");
  if (!technicalMetrics.length || statuses.has("awaiting_test_run")) {
    status.textContent = "Экспериментальный стенд подготовлен, но тесты ожидают запуска.";
  } else if (statuses.has("demo") || statuses.has("placeholder")) {
    status.textContent = "Часть значений демонстрационная и не используется как финальное доказательство эксперимента.";
  } else {
    status.textContent = "Результаты получены после запуска тестов в указанной среде.";
  }
}

function renderEnvironment() {
  const target = document.getElementById("environment");
  const entries = Object.entries(environmentInfo);
  target.innerHTML = entries.length
    ? entries.map(([key, value]) => `<div><strong>${key}</strong><br>${value}</div>`).join("")
    : "<div>Ожидает формирования results/environment.json</div>";
}

function renderDemo() {
  const category = document.getElementById("demo-category");
  const search = document.getElementById("demo-search");
  const sort = document.getElementById("demo-sort");
  const grid = document.getElementById("demo-grid");
  const count = document.getElementById("demo-count");
  const categories = [...new Set(demoItems.map((item) => item.category))];
  category.insertAdjacentHTML("beforeend", categories.map((item) => `<option value="${item}">${item}</option>`).join(""));

  function update() {
    const query = search.value.trim().toLowerCase();
    const selected = category.value;
    const sorted = demoItems
      .filter((item) => (!query || item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)) && (selected === "all" || item.category === selected))
      .sort((a, b) => {
        if (sort.value === "name") return a.title.localeCompare(b.title);
        if (sort.value === "complexity") return b.complexity - a.complexity;
        return b.rating - a.rating;
      });
    count.textContent = `Найдено: ${sorted.length}`;
    grid.innerHTML = sorted.map((item) => `<article class="demo-card"><h3>${item.title}</h3><p>${item.description}</p><span class="pill">${item.category}</span></article>`).join("");
  }

  search.addEventListener("input", update);
  category.addEventListener("change", update);
  sort.addEventListener("change", update);
  update();
}

function renderEvidenceLinks() {
  const links = [
    "artifacts/apps/web-components/", "artifacts/apps/react/", "artifacts/apps/vue/", "artifacts/apps/svelte/", "artifacts/apps/lit/",
    "artifacts/data/", "artifacts/tests/", "artifacts/results/environment.json", "artifacts/results/raw/",
    "artifacts/results/processed/technical-metrics.csv", "artifacts/results/processed/technical-metrics.json",
    "artifacts/results/processed/scoring-matrix.csv", "artifacts/results/processed/scoring-matrix.json",
    "artifacts/results/processed/scoring-justification.md", "artifacts/results/charts/"
  ];
  document.getElementById("evidence-links").innerHTML = links.map((href) => `<a href="./${href}">${href}</a>`).join("");
}

renderDemo();
renderStatus();
renderEnvironment();
renderTable(document.getElementById("metrics-table"), technicalMetrics);
renderTable(document.getElementById("scoring-table"), scoringMatrix);
document.getElementById("justification").textContent = scoringJustification;
renderEvidenceLinks();
