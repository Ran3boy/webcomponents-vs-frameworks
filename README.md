# UI Technology Comparison Experiment

Репозиторий содержит воспроизводимый экспериментальный стенд для ВКР «Сравнительный анализ технологии Web Components и современных фронтенд-фреймворков для разработки пользовательских интерфейсов».

Это не статическая витрина: в репозитории есть исходный код пяти реализаций одного компонента, единый датасет, скрипты проверки, raw JSON, processed CSV/JSON, диаграммы, матрица K1-K10 и GitHub Pages сайт.

## Как воспроизвести эксперимент

Установить зависимости:

```bash
npm install
```

Собрать все реализации компонента:

```bash
npm run build:apps
```

Запустить полный эксперимент одной командой:

```bash
npm run experiment
```

Команда `npm run experiment` выполняет полный цикл:

1. генерирует единые датасеты;
2. собирает Web Components, React, Vue.js, Svelte и Lit приложения через Vite;
3. измеряет производительность через Playwright и браузерный Performance API;
4. проверяет конфликтующие CSS-стили;
5. формирует semi-automatic evidence по переносимости;
6. собирает processed CSV/JSON;
7. генерирует SVG-диаграммы;
8. синхронизирует данные и артефакты для GitHub Pages сайта.

Отдельные этапы можно запускать так:

```bash
npm run test:performance
npm run test:style
npm run test:integration
npm run collect-results
npm run generate-charts
npm run sync-docs-data
```

Raw-результаты находятся в:

```text
results/raw/
```

Processed-таблицы находятся в:

```text
results/processed/technical-metrics.csv
results/processed/technical-metrics.json
results/processed/scoring-matrix.csv
results/processed/scoring-matrix.json
results/processed/scoring-justification.md
```

Сведения о среде запуска:

```text
results/environment.json
```

Диаграммы:

```text
results/charts/
```

## Реализации компонента

Один и тот же UI-компонент «Каталог элементов» реализован в пяти вариантах:

- `apps/web-components/`
- `apps/react/`
- `apps/vue/`
- `apps/svelte/`
- `apps/lit/`

Все реализации используют единый датасет из `data/dataset-500.json` и поддерживают одинаковые сценарии: первичный рендеринг, поиск, фильтрацию, сортировку и сброс.

## Команды

Основные команды корневого `package.json`:

```bash
npm run build:apps
npm run test:performance
npm run test:style
npm run test:integration
npm run collect-results
npm run generate-charts
npm run experiment
```

Локальный запуск GitHub Pages сайта:

```bash
npm run serve:docs
```

## Публикация на GitHub Pages

Сайт расположен в папке `docs/`.

Для публикации:

1. загрузить репозиторий на GitHub;
2. открыть `Settings -> Pages`;
3. выбрать `Deploy from a branch`;
4. выбрать ветку `main`;
5. выбрать папку `/docs`;
6. нажать `Save`.

Папка `docs/artifacts/` содержит копии ключевых артефактов, чтобы ссылки на сайте работали после публикации GitHub Pages из `/docs`.

## Как доказать эксперимент комиссии

Показывать нужно цепочку:

```text
код реализаций -> запуск тестов -> raw JSON -> processed CSV/JSON -> диаграммы -> матрица K1-K10 -> выводы
```

Практически это выглядит так:

1. открыть `apps/` и показать пять реализаций одного компонента;
2. показать единые датасеты в `data/`;
3. запустить `npm run experiment`;
4. открыть `results/raw/` и показать необработанные JSON;
5. открыть `results/processed/` и показать CSV/JSON таблицы;
6. открыть `results/charts/` и показать диаграммы;
7. открыть `results/processed/scoring-justification.md`;
8. открыть GitHub Pages сайт из `docs/`.

## Политика результатов

Финальные числовые значения технических метрик не внесены вручную. Они появляются после запуска скриптов измерения и сохраняются в `results/raw/`, затем преобразуются в `results/processed/technical-metrics.csv` и `results/processed/technical-metrics.json`.

Если значение основано не на автоматическом измерении, а на наблюдаемом признаке, соответствующий raw-файл помечается статусом `manual_observation`. Демонстрационные данные не должны использоваться как финальное доказательство эксперимента.
