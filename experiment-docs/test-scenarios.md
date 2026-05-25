# Сценарии проверки

## 1. Первичный рендеринг

Скрипт: `tests/run-performance-tests.js`.

Проверяется загрузка страницы и появление первой карточки каталога. Сохраняются:

- `initialRenderMs`;
- `fcpMs`;
- `lcpMs`;
- `tbtMs`;
- `cls`;
- `bundleSizeKb`.

Raw-файлы: `results/raw/<technology>/performance.json` и `results/raw/<technology>/lighthouse.json`.

## 2. Обновление состояния

Через Playwright выполняются одинаковые действия:

- ввод текста в поиск;
- выбор категории;
- выбор сортировки;
- сброс.

Сохраняются средние значения `searchUpdateMs`, `filterUpdateMs`, `sortUpdateMs`.

## 3. Конфликтующие CSS-стили

Скрипт: `tests/run-style-isolation-tests.js`.

На страницу добавляются внешние правила:

```css
.card {
  background: red !important;
  font-size: 40px !important;
}

button {
  border: 10px solid black !important;
}

div {
  box-sizing: content-box !important;
}
```

Скрипт сравнивает computed styles до и после вставки CSS.

## 4. Переносимость

Скрипт: `tests/run-integration-tests.js`.

Формируется semi-automatic evidence по использованию компонента вне родной среды:

- Web Components и Lit рассматриваются как custom elements;
- React, Vue.js и Svelte фиксируются как реализации, требующие runtime, сборки или обертки.

## 5. Tooling и DX

Формируются raw-файлы `tooling.json` с командами сборки, package-файлами и наблюдаемыми признаками.
