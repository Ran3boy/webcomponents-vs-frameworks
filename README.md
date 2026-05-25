# UI Technology Comparison Experiment

Репозиторий содержит экспериментальный стенд для ВКР «Сравнительный анализ технологии Web Components и современных фронтенд-фреймворков для разработки пользовательских интерфейсов».

Цель стенда - показать практическое применение критериев K1-K10 и шкалы 0-3 на одном компоненте «Каталог элементов», реализованном на Web Components, React, Vue.js, Svelte и Lit.

## Быстрый запуск

```bash
npm install
npm run test:all
```

Команда `npm run test:all` выполняет полный цикл:

1. генерирует единые датасеты;
2. собирает все пять реализаций;
3. запускает измерения производительности;
4. проверяет конфликтующие CSS-стили;
5. формирует проверку переносимости;
6. собирает processed CSV/JSON;
7. генерирует SVG-диаграммы;
8. синхронизирует данные для GitHub Pages сайта.

## Повторный запуск отдельных этапов

```bash
npm run setup:data
npm run build:apps
npm run test:performance
npm run test:style
npm run test:integration
npm run collect-results
npm run generate-charts
npm run sync-docs-data
```

## Структура

- `apps/` - пять реализаций компонента.
- `data/` - единые датасеты на 100, 500 и 1000 элементов.
- `tests/` - скрипты измерений и обработки результатов.
- `results/raw/` - необработанные JSON-результаты.
- `results/processed/` - итоговые CSV/JSON и обоснование оценок.
- `results/charts/` - SVG-диаграммы, построенные по processed данным.
- `docs/` - GitHub Pages сайт для демонстрации комиссии.
- `experiment-docs/` - методические документы эксперимента.

## GitHub Pages

Сайт расположен в `docs/`.

Для публикации:

1. загрузить репозиторий на GitHub;
2. открыть `Settings -> Pages`;
3. выбрать `Deploy from a branch`;
4. выбрать ветку `main`;
5. выбрать папку `/docs`;
6. нажать `Save`.

Локальная проверка сайта:

```bash
npm run serve:docs
```

## Политика результатов

Финальные числовые значения технических метрик не внесены вручную. Они появляются после запуска скриптов измерения и сохраняются в `results/raw/`, затем преобразуются в `results/processed/technical-metrics.csv` и `results/processed/technical-metrics.json`.

Оценочная матрица K1-K10 формируется из измерений, наблюдаемых признаков и правил в `tests/collect-results.js`; текстовые основания сохраняются в `results/processed/scoring-justification.md`.
