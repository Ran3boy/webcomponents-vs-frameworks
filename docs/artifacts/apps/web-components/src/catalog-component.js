import dataset from "../../../data/dataset-500.json";
import styles from "./styles.css?inline";

const categories = ["Компоненты", "Данные", "Формы", "Навигация", "Обратная связь"];

class ItemCatalog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = { query: "", category: "all", sort: "rating" };
    this.items = dataset;
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  get visibleItems() {
    const query = this.state.query.trim().toLowerCase();
    return this.items
      .filter((item) => {
        const matchesQuery = !query || item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
        const matchesCategory = this.state.category === "all" || item.category === this.state.category;
        return matchesQuery && matchesCategory;
      })
      .sort((a, b) => {
        if (this.state.sort === "name") return a.title.localeCompare(b.title);
        if (this.state.sort === "complexity") return b.complexity - a.complexity;
        return b.rating - a.rating;
      });
  }

  bindEvents() {
    this.shadowRoot.querySelector("[data-testid='search-input']").addEventListener("input", (event) => {
      this.state.query = event.target.value;
      this.render();
      this.bindEvents();
    });
    this.shadowRoot.querySelector("[data-testid='category-filter']").addEventListener("change", (event) => {
      this.state.category = event.target.value;
      this.render();
      this.bindEvents();
    });
    this.shadowRoot.querySelector("[data-testid='sort-select']").addEventListener("change", (event) => {
      this.state.sort = event.target.value;
      this.render();
      this.bindEvents();
    });
    this.shadowRoot.querySelector("[data-testid='reset-button']").addEventListener("click", () => {
      this.state = { query: "", category: "all", sort: "rating" };
      this.render();
      this.bindEvents();
    });
  }

  render() {
    const visible = this.visibleItems;
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <section class="catalog-shell">
        <div class="toolbar">
          <input data-testid="search-input" value="${this.state.query}" placeholder="Поиск по каталогу" />
          <select data-testid="category-filter">
            <option value="all"${this.state.category === "all" ? " selected" : ""}>Все категории</option>
            ${categories.map((category) => `<option value="${category}"${this.state.category === category ? " selected" : ""}>${category}</option>`).join("")}
          </select>
          <select data-testid="sort-select">
            <option value="rating"${this.state.sort === "rating" ? " selected" : ""}>По рейтингу</option>
            <option value="name"${this.state.sort === "name" ? " selected" : ""}>По названию</option>
            <option value="complexity"${this.state.sort === "complexity" ? " selected" : ""}>По сложности</option>
          </select>
          <button data-testid="reset-button" type="button">Сброс</button>
        </div>
        <p class="summary" data-testid="result-count">Найдено: ${visible.length}</p>
        <div class="grid" data-testid="catalog-grid">
          ${visible.slice(0, 80).map((item) => this.renderCard(item)).join("")}
        </div>
      </section>
    `;
  }

  renderCard(item) {
    return `
      <article class="card" data-testid="catalog-card">
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <div class="meta">
          <span class="pill">${item.category}</span>
          <span>Рейтинг: ${item.rating}</span>
          <span>Сложность: ${item.complexity}</span>
        </div>
      </article>
    `;
  }
}

customElements.define("item-catalog", ItemCatalog);
