import React, { useMemo, useState } from "react";
import dataset from "../../../data/dataset-500.json";

const categories = ["Компоненты", "Данные", "Формы", "Навигация", "Обратная связь"];

export function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("rating");

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return dataset
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
  }, [query, category, sort]);

  function reset() {
    setQuery("");
    setCategory("all");
    setSort("rating");
  }

  return (
    <section className="catalog-shell">
      <div className="toolbar">
        <input data-testid="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по каталогу" />
        <select data-testid="category-filter" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">Все категории</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select data-testid="sort-select" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="rating">По рейтингу</option>
          <option value="name">По названию</option>
          <option value="complexity">По сложности</option>
        </select>
        <button data-testid="reset-button" type="button" onClick={reset}>Сброс</button>
      </div>
      <p className="summary" data-testid="result-count">Найдено: {visibleItems.length}</p>
      <div className="grid" data-testid="catalog-grid">
        {visibleItems.slice(0, 80).map((item) => (
          <article className="card" data-testid="catalog-card" key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div className="meta">
              <span className="pill">{item.category}</span>
              <span>Рейтинг: {item.rating}</span>
              <span>Сложность: {item.complexity}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
