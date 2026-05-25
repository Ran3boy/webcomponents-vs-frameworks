import { LitElement, css, html } from "lit";
import dataset from "../../../data/dataset-500.json";

const categories = ["Компоненты", "Данные", "Формы", "Навигация", "Обратная связь"];

class LitCatalog extends LitElement {
  static properties = {
    query: { type: String },
    category: { type: String },
    sort: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      color: #1f2937;
      font-family: Inter, Arial, sans-serif;
    }

    * {
      box-sizing: border-box;
    }

    .catalog-shell {
      max-width: 1180px;
      margin: 0 auto;
      padding: 24px;
    }

    .toolbar {
      display: grid;
      grid-template-columns: 1fr 180px 180px auto;
      gap: 12px;
      align-items: center;
      margin-bottom: 18px;
    }

    input,
    select,
    button {
      min-height: 42px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 0 12px;
      background: #fff;
      color: #1f2937;
      font: inherit;
    }

    button {
      cursor: pointer;
      background: #7c3aed;
      border-color: #7c3aed;
      color: #fff;
      font-weight: 700;
    }

    .summary {
      margin: 0 0 16px;
      color: #475569;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
    }

    .card {
      min-height: 154px;
      border: 1px solid #d8dee9;
      border-radius: 8px;
      padding: 14px;
      background: #ffffff;
      box-shadow: 0 1px 2px rgb(15 23 42 / 0.08);
    }

    .card h2 {
      margin: 0 0 8px;
      font-size: 18px;
    }

    .card p {
      margin: 0 0 12px;
      color: #475569;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 13px;
    }

    .pill {
      border-radius: 999px;
      padding: 4px 8px;
      background: #ede9fe;
      color: #5b21b6;
    }

    @media (max-width: 760px) {
      .toolbar {
        grid-template-columns: 1fr;
      }
    }
  `;

  constructor() {
    super();
    this.query = "";
    this.category = "all";
    this.sort = "rating";
  }

  get visibleItems() {
    const normalized = this.query.trim().toLowerCase();
    return [...dataset]
      .filter((item) => {
        const matchesQuery = !normalized || item.title.toLowerCase().includes(normalized) || item.description.toLowerCase().includes(normalized);
        const matchesCategory = this.category === "all" || item.category === this.category;
        return matchesQuery && matchesCategory;
      })
      .sort((a, b) => {
        if (this.sort === "name") return a.title.localeCompare(b.title);
        if (this.sort === "complexity") return b.complexity - a.complexity;
        return b.rating - a.rating;
      });
  }

  reset() {
    this.query = "";
    this.category = "all";
    this.sort = "rating";
  }

  render() {
    const visible = this.visibleItems;
    return html`
      <section class="catalog-shell">
        <div class="toolbar">
          <input data-testid="search-input" .value=${this.query} @input=${(event) => { this.query = event.target.value; }} placeholder="Поиск по каталогу" />
          <select data-testid="category-filter" .value=${this.category} @change=${(event) => { this.category = event.target.value; }}>
            <option value="all">Все категории</option>
            ${categories.map((item) => html`<option value=${item}>${item}</option>`)}
          </select>
          <select data-testid="sort-select" .value=${this.sort} @change=${(event) => { this.sort = event.target.value; }}>
            <option value="rating">По рейтингу</option>
            <option value="name">По названию</option>
            <option value="complexity">По сложности</option>
          </select>
          <button data-testid="reset-button" type="button" @click=${this.reset}>Сброс</button>
        </div>
        <p class="summary" data-testid="result-count">Найдено: ${visible.length}</p>
        <div class="grid" data-testid="catalog-grid">
          ${visible.slice(0, 80).map((item) => html`
            <article class="card" data-testid="catalog-card">
              <h2>${item.title}</h2>
              <p>${item.description}</p>
              <div class="meta">
                <span class="pill">${item.category}</span>
                <span>Рейтинг: ${item.rating}</span>
                <span>Сложность: ${item.complexity}</span>
              </div>
            </article>
          `)}
        </div>
      </section>
    `;
  }
}

customElements.define("lit-catalog", LitCatalog);
