import fs from "node:fs";
import path from "node:path";
import { categories } from "./catalog-utils.js";

const root = process.cwd();
const dataDir = path.join(root, "data");
fs.mkdirSync(dataDir, { recursive: true });

const titles = [
  "Адаптивная карточка", "Таблица данных", "Панель поиска", "Фильтр-чип", "Модальное окно",
  "Индикатор прогресса", "Навигационная панель", "Поле формы", "Всплывающее уведомление", "Дерево разделов"
];

const descriptions = [
  "Переиспользуемый элемент для интерфейсных панелей",
  "Интерактивный блок с фильтрацией и сортировкой",
  "Компактный UI-элемент для прикладных интерфейсов",
  "Компонент для интеграции в дизайн-систему",
  "Элемент с управлением с клавиатуры и стабильной раскладкой"
];

function makeItem(index) {
  const category = categories[index % categories.length];
  const title = `${titles[index % titles.length]} ${String(index + 1).padStart(4, "0")}`;
  return {
    id: `catalog-${String(index + 1).padStart(4, "0")}`,
    title,
    category,
    description: descriptions[index % descriptions.length],
    complexity: (index % 5) + 1,
    rating: Number((3.5 + ((index * 17) % 15) / 10).toFixed(1)),
    updated: `2026-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 27) + 1).padStart(2, "0")}`
  };
}

for (const size of [100, 500, 1000]) {
  const items = Array.from({ length: size }, (_, index) => makeItem(index));
  fs.writeFileSync(path.join(dataDir, `dataset-${size}.json`), `${JSON.stringify(items, null, 2)}\n`);
}

console.log("Generated datasets: 100, 500, 1000");
