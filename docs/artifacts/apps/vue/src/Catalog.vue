<script setup>
import { computed, ref } from "vue";
import dataset from "../../../data/dataset-500.json";

const categories = ["Компоненты", "Данные", "Формы", "Навигация", "Обратная связь"];
const query = ref("");
const category = ref("all");
const sort = ref("rating");

const visibleItems = computed(() => {
  const normalized = query.value.trim().toLowerCase();
  return [...dataset]
    .filter((item) => {
      const matchesQuery = !normalized || item.title.toLowerCase().includes(normalized) || item.description.toLowerCase().includes(normalized);
      const matchesCategory = category.value === "all" || item.category === category.value;
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => {
      if (sort.value === "name") return a.title.localeCompare(b.title);
      if (sort.value === "complexity") return b.complexity - a.complexity;
      return b.rating - a.rating;
    });
});

function reset() {
  query.value = "";
  category.value = "all";
  sort.value = "rating";
}
</script>

<template>
  <section class="catalog-shell">
    <div class="toolbar">
      <input data-testid="search-input" v-model="query" placeholder="Поиск по каталогу" />
      <select data-testid="category-filter" v-model="category">
        <option value="all">Все категории</option>
        <option v-for="item in categories" :key="item" :value="item">{{ item }}</option>
      </select>
      <select data-testid="sort-select" v-model="sort">
        <option value="rating">По рейтингу</option>
        <option value="name">По названию</option>
        <option value="complexity">По сложности</option>
      </select>
      <button data-testid="reset-button" type="button" @click="reset">Сброс</button>
    </div>
    <p class="summary" data-testid="result-count">Найдено: {{ visibleItems.length }}</p>
    <div class="grid" data-testid="catalog-grid">
      <article v-for="item in visibleItems.slice(0, 80)" :key="item.id" class="card" data-testid="catalog-card">
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
        <div class="meta">
          <span class="pill">{{ item.category }}</span>
          <span>Рейтинг: {{ item.rating }}</span>
          <span>Сложность: {{ item.complexity }}</span>
        </div>
      </article>
    </div>
  </section>
</template>
