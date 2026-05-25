export const technologies = [
  { id: "web-components", name: "Web Components", port: 4211, dist: "apps/web-components/dist" },
  { id: "react", name: "React", port: 4212, dist: "apps/react/dist" },
  { id: "vue", name: "Vue.js", port: 4213, dist: "apps/vue/dist" },
  { id: "svelte", name: "Svelte", port: 4214, dist: "apps/svelte/dist" },
  { id: "lit", name: "Lit", port: 4215, dist: "apps/lit/dist" }
];

export const categories = ["Components", "Data", "Forms", "Navigation", "Feedback"];

export function filterCatalog(items, state) {
  const query = state.query.trim().toLowerCase();
  const filtered = items.filter((item) => {
    const matchesQuery = !query || item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
    const matchesCategory = state.category === "all" || item.category === state.category;
    return matchesQuery && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (state.sort === "name") return a.title.localeCompare(b.title);
    if (state.sort === "complexity") return b.complexity - a.complexity;
    return b.rating - a.rating;
  });

  return sorted;
}
