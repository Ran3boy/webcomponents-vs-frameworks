import path from "node:path";
import { writeJson } from "./server-utils.js";
import { technologies } from "./catalog-utils.js";

const root = process.cwd();

const integrationEvidence = {
  "web-components": {
    result: "html/react/vue",
    portabilityLevel: "high",
    requiresFrameworkRuntime: false,
    evidence: [
      "Custom element can be used from plain HTML after loading its JavaScript module.",
      "React and Vue can render custom elements as native DOM tags.",
      "Shadow DOM keeps internal structure independent from host application."
    ]
  },
  react: {
    result: "react_runtime_required",
    portabilityLevel: "medium",
    requiresFrameworkRuntime: true,
    evidence: [
      "Component source is a React function component.",
      "Use outside React requires React runtime or a wrapper/export as Web Component.",
      "Integration is strong inside React UI-kit ecosystems."
    ]
  },
  vue: {
    result: "vue_runtime_required",
    portabilityLevel: "medium",
    requiresFrameworkRuntime: true,
    evidence: [
      "Component source is a Vue single-file component.",
      "Use outside Vue requires Vue runtime, build step, or custom-element compilation.",
      "Integration is strong inside Vue application architecture."
    ]
  },
  svelte: {
    result: "compiled_component_or_wrapper_required",
    portabilityLevel: "medium",
    requiresFrameworkRuntime: true,
    evidence: [
      "Component source is compiled by Svelte tooling.",
      "Use outside Svelte is possible after compilation, but source-level reuse depends on Svelte build tooling.",
      "Custom-element output is possible with additional configuration."
    ]
  },
  lit: {
    result: "html/react/vue",
    portabilityLevel: "high",
    requiresFrameworkRuntime: false,
    evidence: [
      "Lit component is a standards-based custom element.",
      "It can be used from plain HTML after module loading.",
      "React and Vue can host it as a native DOM custom element."
    ]
  }
};

for (const tech of technologies) {
  const result = {
    technology: tech.name,
    technologyId: tech.id,
    status: "manual_observation",
    runDate: new Date().toISOString(),
    sourceFilesInspected: [
      `apps/${tech.id}/index.html`,
      tech.id === "web-components" ? "apps/web-components/src/catalog-component.js" :
      tech.id === "lit" ? "apps/lit/src/catalog-element.js" :
      tech.id === "react" ? "apps/react/src/Catalog.jsx" :
      tech.id === "vue" ? "apps/vue/src/Catalog.vue" :
      "apps/svelte/src/Catalog.svelte"
    ],
    ...integrationEvidence[tech.id]
  };
  writeJson(path.join(root, "results", "raw", tech.id, "integration.json"), result);
  writeJson(path.join(root, "results", "raw", tech.id, "tooling.json"), {
    technology: tech.name,
    technologyId: tech.id,
    status: "manual_observation",
    runDate: new Date().toISOString(),
    packageFile: `apps/${tech.id}/package.json`,
    buildCommand: `npm run build -w apps/${tech.id}`,
    notes: "Tooling score is derived from package scripts, framework conventions, and source structure."
  });
}

console.log("Integration and tooling evidence written to results/raw/<technology>/");
