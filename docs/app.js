import { technicalMetrics } from "./data/metrics.js";
import { scoringMatrix } from "./data/scoringMatrix.js";
import { scoringJustification } from "./data/scoringJustification.js";
import { environmentInfo } from "./data/environment.js";
import { demoDataset } from "./data/demoDataset.js";

const demoItems = demoDataset.slice(0, 500);

const technicalColumnLabels = {
  technology: "Технология",
  bundle_size_kb: "Размер сборки, КБ",
  initial_render_ms: "Первичный рендеринг, мс",
  search_update_ms: "Поиск, мс",
  filter_update_ms: "Фильтрация, мс",
  sort_update_ms: "Сортировка, мс",
  fcp_ms: "FCP, мс",
  lcp_ms: "LCP, мс",
  tbt_ms: "TBT, мс",
  cls: "CLS",
  style_isolation: "Изоляция стилей",
  integration_result: "Интеграция",
  evidence_status: "Статус доказательства",
  status: "Статус"
};

const scoringColumnLabels = {
  technology: "Технология",
  status: "Статус"
};

const valueLabels = {
  passed: "пройдена",
  failed: "не пройдена",
  measured: "измерено",
  manual_observation: "ручное наблюдение",
  html: "HTML",
  react: "React",
  vue: "Vue",
  "html/react/vue": "HTML / React / Vue",
  react_runtime_required: "требуется React runtime",
  vue_runtime_required: "требуется Vue runtime",
  compiled_component_or_wrapper_required: "требуется сборка или обёртка",
  measured_and_manual_observation_justified: "измерено и обосновано",
  measured_and_justified: "измерено и обосновано",
  awaiting_test_run: "ожидает запуска тестов"
};

const environmentLabels = {
  runDate: "Дата запуска",
  os: "Операционная система",
  nodeVersion: "Версия Node.js",
  browser: "Браузер",
  browserVersion: "Версия браузера",
  datasetSize: "Размер датасета",
  testRunner: "Средство запуска",
  notes: "Примечание"
};

const scenarios = {
  widgets: {
    label: "Рекомендуемый подход",
    title: "Web Components или Lit",
    text: "Для встраиваемых компонентов и виджетов приоритетны переносимость, независимость от экосистемы, инкапсуляция DOM и изоляция стилей.",
    points: [
      "использование в разных приложениях и технических стеках;",
      "минимизация конфликтов с кодом хост-приложения;",
      "стабильный публичный контракт компонента."
    ]
  },
  spa: {
    label: "Рекомендуемый подход",
    title: "Angular, React или Vue.js",
    text: "Для корпоративных SPA важны маршрутизация, управление состоянием, tooling, командные соглашения и развитая экосистема прикладной разработки.",
    points: [
      "единая архитектура приложения;",
      "готовые решения для состояния и маршрутов;",
      "быстрая командная разработка."
    ]
  },
  design: {
    label: "Рекомендуемый подход",
    title: "Web Components или Lit",
    text: "Для дизайн-системы, которая должна жить дольше отдельных приложений, полезны стандартизованный DOM-контракт и переносимость между фреймворками.",
    points: [
      "переиспользование в нескольких продуктах;",
      "изоляция стилей и стабильность API;",
      "меньшая зависимость от смены фронтенд-стека."
    ]
  },
  interactive: {
    label: "Рекомендуемый подход",
    title: "React, Vue.js или Svelte",
    text: "Для высокоинтерактивных интерфейсов важны реактивная модель, удобное управление состоянием, tooling и производительность обновлений.",
    points: [
      "частые обновления UI;",
      "сложная клиентская логика;",
      "развитая отладка и компонентная модель."
    ]
  }
};

const artifacts = [
  {
    title: "Исходный код Web Components",
    description: "Реализация каталога элементов на нативных Web Components.",
    path: "artifacts/apps/web-components/src/catalog-component.js",
    viewer: true
  },
  {
    title: "Исходный код React",
    description: "Реализация каталога элементов на React.",
    path: "artifacts/apps/react/src/Catalog.jsx",
    viewer: true
  },
  {
    title: "Исходный код Vue",
    description: "Реализация каталога элементов на Vue.js.",
    path: "artifacts/apps/vue/src/Catalog.vue",
    viewer: true
  },
  {
    title: "Исходный код Svelte",
    description: "Реализация каталога элементов на Svelte.",
    path: "artifacts/apps/svelte/src/Catalog.svelte",
    viewer: true
  },
  {
    title: "Исходный код Lit",
    description: "Реализация каталога элементов на Lit.",
    path: "artifacts/apps/lit/src/catalog-element.js",
    viewer: true
  },
  {
    title: "Единый датасет",
    description: "Данные каталога, общие для всех реализаций.",
    path: "artifacts/data/dataset-500.json",
    viewer: true
  },
  {
    title: "Скрипт performance-тестов",
    description: "Playwright-сценарий измерения рендеринга и обновлений.",
    path: "artifacts/tests/run-performance-tests.js",
    viewer: true
  },
  {
    title: "Скрипт проверки стилей",
    description: "Проверка устойчивости к конфликтующим CSS-правилам.",
    path: "artifacts/tests/run-style-isolation-tests.js",
    viewer: true
  },
  {
    title: "Скрипт проверки интеграции",
    description: "Фиксация переносимости и runtime-зависимостей.",
    path: "artifacts/tests/run-integration-tests.js",
    viewer: true
  },
  {
    title: "Описание среды запуска",
    description: "Дата, ОС, Node.js, браузер и параметры запуска тестов.",
    path: "artifacts/results/environment.json",
    viewer: true
  },
  {
    title: "Сырые результаты Web Components",
    description: "Raw JSON с измерениями производительности.",
    path: "artifacts/results/raw/web-components/performance.json",
    viewer: true
  },
  {
    title: "Сырые результаты React",
    description: "Raw JSON с измерениями производительности.",
    path: "artifacts/results/raw/react/performance.json",
    viewer: true
  },
  {
    title: "Сырые результаты Vue",
    description: "Raw JSON с измерениями производительности.",
    path: "artifacts/results/raw/vue/performance.json",
    viewer: true
  },
  {
    title: "Сырые результаты Svelte",
    description: "Raw JSON с измерениями производительности.",
    path: "artifacts/results/raw/svelte/performance.json",
    viewer: true
  },
  {
    title: "Сырые результаты Lit",
    description: "Raw JSON с измерениями производительности.",
    path: "artifacts/results/raw/lit/performance.json",
    viewer: true
  },
  {
    title: "Итоговые метрики CSV",
    description: "Обработанная таблица технических метрик.",
    path: "artifacts/results/processed/technical-metrics.csv",
    viewer: true
  },
  {
    title: "Итоговые метрики JSON",
    description: "Обработанные технические метрики для сайта.",
    path: "artifacts/results/processed/technical-metrics.json",
    viewer: true
  },
  {
    title: "Матрица K1-K10 CSV",
    description: "Оценочная матрица по критериям раздела 3.1.",
    path: "artifacts/results/processed/scoring-matrix.csv",
    viewer: true
  },
  {
    title: "Матрица K1-K10 JSON",
    description: "Оценочная матрица для визуализации.",
    path: "artifacts/results/processed/scoring-matrix.json",
    viewer: true
  },
  {
    title: "Обоснование баллов",
    description: "Текстовые основания оценок по технологиям.",
    path: "artifacts/results/processed/scoring-justification.md",
    viewer: true
  },
  {
    title: "Тепловая карта K1-K10",
    description: "SVG-диаграмма, построенная по матрице оценивания.",
    path: "artifacts/results/charts/scoring-heatmap.svg",
    viewer: false
  }
];

function localizeValue(value) {
  if (typeof value !== "string") return value;
  if (valueLabels[value]) return valueLabels[value];
  return value
    .replaceAll("performance=measured", "производительность: измерено")
    .replaceAll("style_isolation=measured", "изоляция стилей: измерено")
    .replaceAll("integration_result=manual_observation", "интеграция: ручное наблюдение");
}

function localizeText(text) {
  return text
    .replaceAll("passed", "пройдена")
    .replaceAll("failed", "не пройдена")
    .replaceAll("html/react/vue", "HTML / React / Vue")
    .replaceAll("react_runtime_required", "требуется React runtime")
    .replaceAll("vue_runtime_required", "требуется Vue runtime")
    .replaceAll("compiled_component_or_wrapper_required", "требуется сборка или обёртка");
}

function renderTable(target, rows, labels) {
  if (!rows.length) {
    target.innerHTML = "<tbody><tr><td>Ожидает запуска тестов</td></tr></tbody>";
    return;
  }
  const columns = Object.keys(rows[0]);
  target.innerHTML = `
    <thead><tr>${columns.map((column) => `<th>${labels[column] || column}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((row) => `<tr>${columns.map((column) => `<td>${localizeValue(row[column])}</td>`).join("")}</tr>`).join("")}</tbody>
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
    ? entries.map(([key, value]) => `<div><strong>${environmentLabels[key] || key}</strong><br>${value}</div>`).join("")
    : "<div>Ожидает формирования results/environment.json</div>";
}

function renderDemo() {
  const category = document.getElementById("demo-category");
  const search = document.getElementById("demo-search");
  const sort = document.getElementById("demo-sort");
  const grid = document.getElementById("demo-grid");
  const count = document.getElementById("demo-count");
  const more = document.getElementById("demo-more");
  const pageSize = 20;
  let visibleCount = pageSize;
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
    const visibleItems = sorted.slice(0, visibleCount);
    count.textContent = `Показано: ${visibleItems.length} из ${sorted.length}`;
    grid.innerHTML = visibleItems.map((item) => `
      <article class="demo-card">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <span class="pill">${item.category}</span>
      </article>
    `).join("");
    more.hidden = visibleItems.length >= sorted.length;
  }

  function resetAndUpdate() {
    visibleCount = pageSize;
    update();
  }

  search.addEventListener("input", resetAndUpdate);
  category.addEventListener("change", resetAndUpdate);
  sort.addEventListener("change", resetAndUpdate);
  more.addEventListener("click", () => {
    visibleCount += pageSize;
    update();
  });
  update();
}

function renderEvidenceLinks() {
  const target = document.getElementById("evidence-links");
  target.innerHTML = artifacts.map((artifact) => {
    const href = artifact.viewer
      ? `./source-viewer.html?file=${encodeURIComponent(artifact.path)}`
      : `./${artifact.path}`;
    return `
      <article class="artifact-card">
        <h3>${artifact.title}</h3>
        <p>${artifact.description}</p>
        <code class="artifact-path">${artifact.path}</code>
        <a class="artifact-button" href="${href}">Открыть файл</a>
      </article>
    `;
  }).join("");
}

function renderScenario(key) {
  const target = document.getElementById("scenario-result");
  if (!target) return;
  const scenario = scenarios[key] || scenarios.widgets;
  target.innerHTML = `
    <span class="tag">${scenario.label}</span>
    <h3>${scenario.title}</h3>
    <p>${scenario.text}</p>
    <ul>${scenario.points.map((point) => `<li>${point}</li>`).join("")}</ul>
  `;
}

function bindScenarioTabs() {
  const tabs = [...document.querySelectorAll(".scenario-tab")];
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      renderScenario(tab.dataset.scenario);
    });
  });
  renderScenario("widgets");
}

function renderJustification() {
  const target = document.getElementById("justification");
  const sections = scoringJustification
    .split(/\n## /)
    .map((part, index) => index === 0 ? part : `## ${part}`)
    .filter((part) => part.startsWith("## "));

  target.innerHTML = sections.map((section) => {
    const [titleLine, ...body] = section.split("\n");
    const title = titleLine.replace(/^##\s*/, "").trim();
    const items = body
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => `<li>${localizeText(line.replace(/^-\s*/, ""))}</li>`)
      .join("");
    return `
      <details>
        <summary>${title}</summary>
        <ul>${items}</ul>
      </details>
    `;
  }).join("");
}

renderDemo();
renderStatus();
renderEnvironment();
renderTable(document.getElementById("metrics-table"), technicalMetrics, technicalColumnLabels);
renderTable(document.getElementById("scoring-table"), scoringMatrix, scoringColumnLabels);
renderJustification();
renderEvidenceLinks();
bindScenarioTabs();
