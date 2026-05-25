<script>
  import dataset from "../../../data/dataset-500.json";

  const categories = ["Компоненты", "Данные", "Формы", "Навигация", "Обратная связь"];
  let query = "";
  let category = "all";
  let sort = "rating";

  $: normalized = query.trim().toLowerCase();
  $: visibleItems = [...dataset]
    .filter((item) => {
      const matchesQuery = !normalized || item.title.toLowerCase().includes(normalized) || item.description.toLowerCase().includes(normalized);
      const matchesCategory = category === "all" || item.category === category;
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title);
      if (sort === "complexity") return b.complexity - a.complexity;
      return b.rating - a.rating;
    });

  function reset() {
    query = "";
    category = "all";
    sort = "rating";
  }
</script>

<section class="catalog-shell">
  <div class="toolbar">
    <input data-testid="search-input" bind:value={query} placeholder="Поиск по каталогу" />
    <select data-testid="category-filter" bind:value={category}>
      <option value="all">Все категории</option>
      {#each categories as item}
        <option value={item}>{item}</option>
      {/each}
    </select>
    <select data-testid="sort-select" bind:value={sort}>
      <option value="rating">По рейтингу</option>
      <option value="name">По названию</option>
      <option value="complexity">По сложности</option>
    </select>
    <button data-testid="reset-button" type="button" on:click={reset}>Сброс</button>
  </div>
  <p class="summary" data-testid="result-count">Найдено: {visibleItems.length}</p>
  <div class="grid" data-testid="catalog-grid">
    {#each visibleItems.slice(0, 80) as item (item.id)}
      <article class="card" data-testid="catalog-card">
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        <div class="meta">
          <span class="pill">{item.category}</span>
          <span>Рейтинг: {item.rating}</span>
          <span>Сложность: {item.complexity}</span>
        </div>
      </article>
    {/each}
  </div>
</section>
