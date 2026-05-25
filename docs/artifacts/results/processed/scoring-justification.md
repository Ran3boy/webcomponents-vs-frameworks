# Обоснование оценок K1-K10

Шкала: 0 - свойство отсутствует; 1 - поддерживается слабо; 2 - поддерживается частично или с ограничениями; 3 - поддерживается полноценно как штатная возможность. Для K6 используется инвертированная логика: чем меньше зависимость от экосистемы, тем выше балл.

Оценки не суммируются в общий рейтинг: матрица показывает профиль применимости технологии.

## Web Components

- K1: 3 балл(а). Основание: структура компонента и возможность повторного использования в apps/. Артефакты: apps/, results/raw/web-components/, results/processed/technical-metrics.json.
- K2: 3 балл(а). Основание: граница DOM и модель инкапсуляции в исходном коде. Артефакты: apps/, results/raw/web-components/, results/processed/technical-metrics.json.
- K3: 3 балл(а). Основание: результат проверки конфликтующих стилей: passed. Артефакты: apps/, results/raw/web-components/, results/processed/technical-metrics.json.
- K4: 1 балл(а). Основание: реализация поиска, фильтрации, сортировки и измерения времени обновления. Артефакты: apps/, results/raw/web-components/, results/processed/technical-metrics.json.
- K5: 3 балл(а). Основание: результат проверки переносимости: html/react/vue. Артефакты: apps/, results/raw/web-components/, results/processed/technical-metrics.json.
- K6: 3 балл(а). Основание: наблюдаемая зависимость от runtime и экосистемы. Артефакты: apps/, results/raw/web-components/, results/processed/technical-metrics.json.
- K7: 1 балл(а). Основание: скрипты сборки, tooling и структура package.json. Артефакты: apps/, results/raw/web-components/, results/processed/technical-metrics.json.
- K8: 2 балл(а). Основание: архитектурные соглашения и масштабируемость процесса разработки. Артефакты: apps/, results/raw/web-components/, results/processed/technical-metrics.json.
- K9: 3 балл(а). Основание: размер сборки, первичный рендеринг и время обновлений из technical-metrics.json. Артефакты: apps/, results/raw/web-components/, results/processed/technical-metrics.json.
- K10: 1 балл(а). Основание: совместимость с UI-экосистемой, UI-kit, a11y и i18n. Артефакты: apps/, results/raw/web-components/, results/processed/technical-metrics.json.

## React

- K1: 3 балл(а). Основание: структура компонента и возможность повторного использования в apps/. Артефакты: apps/, results/raw/react/, results/processed/technical-metrics.json.
- K2: 2 балл(а). Основание: граница DOM и модель инкапсуляции в исходном коде. Артефакты: apps/, results/raw/react/, results/processed/technical-metrics.json.
- K3: 1 балл(а). Основание: результат проверки конфликтующих стилей: failed. Артефакты: apps/, results/raw/react/, results/processed/technical-metrics.json.
- K4: 3 балл(а). Основание: реализация поиска, фильтрации, сортировки и измерения времени обновления. Артефакты: apps/, results/raw/react/, results/processed/technical-metrics.json.
- K5: 1 балл(а). Основание: результат проверки переносимости: react_runtime_required. Артефакты: apps/, results/raw/react/, results/processed/technical-metrics.json.
- K6: 1 балл(а). Основание: наблюдаемая зависимость от runtime и экосистемы. Артефакты: apps/, results/raw/react/, results/processed/technical-metrics.json.
- K7: 3 балл(а). Основание: скрипты сборки, tooling и структура package.json. Артефакты: apps/, results/raw/react/, results/processed/technical-metrics.json.
- K8: 3 балл(а). Основание: архитектурные соглашения и масштабируемость процесса разработки. Артефакты: apps/, results/raw/react/, results/processed/technical-metrics.json.
- K9: 1 балл(а). Основание: размер сборки, первичный рендеринг и время обновлений из technical-metrics.json. Артефакты: apps/, results/raw/react/, results/processed/technical-metrics.json.
- K10: 3 балл(а). Основание: совместимость с UI-экосистемой, UI-kit, a11y и i18n. Артефакты: apps/, results/raw/react/, results/processed/technical-metrics.json.

## Vue.js

- K1: 3 балл(а). Основание: структура компонента и возможность повторного использования в apps/. Артефакты: apps/, results/raw/vue/, results/processed/technical-metrics.json.
- K2: 2 балл(а). Основание: граница DOM и модель инкапсуляции в исходном коде. Артефакты: apps/, results/raw/vue/, results/processed/technical-metrics.json.
- K3: 1 балл(а). Основание: результат проверки конфликтующих стилей: failed. Артефакты: apps/, results/raw/vue/, results/processed/technical-metrics.json.
- K4: 3 балл(а). Основание: реализация поиска, фильтрации, сортировки и измерения времени обновления. Артефакты: apps/, results/raw/vue/, results/processed/technical-metrics.json.
- K5: 2 балл(а). Основание: результат проверки переносимости: vue_runtime_required. Артефакты: apps/, results/raw/vue/, results/processed/technical-metrics.json.
- K6: 1 балл(а). Основание: наблюдаемая зависимость от runtime и экосистемы. Артефакты: apps/, results/raw/vue/, results/processed/technical-metrics.json.
- K7: 3 балл(а). Основание: скрипты сборки, tooling и структура package.json. Артефакты: apps/, results/raw/vue/, results/processed/technical-metrics.json.
- K8: 2 балл(а). Основание: архитектурные соглашения и масштабируемость процесса разработки. Артефакты: apps/, results/raw/vue/, results/processed/technical-metrics.json.
- K9: 2 балл(а). Основание: размер сборки, первичный рендеринг и время обновлений из technical-metrics.json. Артефакты: apps/, results/raw/vue/, results/processed/technical-metrics.json.
- K10: 3 балл(а). Основание: совместимость с UI-экосистемой, UI-kit, a11y и i18n. Артефакты: apps/, results/raw/vue/, results/processed/technical-metrics.json.

## Svelte

- K1: 3 балл(а). Основание: структура компонента и возможность повторного использования в apps/. Артефакты: apps/, results/raw/svelte/, results/processed/technical-metrics.json.
- K2: 2 балл(а). Основание: граница DOM и модель инкапсуляции в исходном коде. Артефакты: apps/, results/raw/svelte/, results/processed/technical-metrics.json.
- K3: 1 балл(а). Основание: результат проверки конфликтующих стилей: failed. Артефакты: apps/, results/raw/svelte/, results/processed/technical-metrics.json.
- K4: 3 балл(а). Основание: реализация поиска, фильтрации, сортировки и измерения времени обновления. Артефакты: apps/, results/raw/svelte/, results/processed/technical-metrics.json.
- K5: 2 балл(а). Основание: результат проверки переносимости: compiled_component_or_wrapper_required. Артефакты: apps/, results/raw/svelte/, results/processed/technical-metrics.json.
- K6: 2 балл(а). Основание: наблюдаемая зависимость от runtime и экосистемы. Артефакты: apps/, results/raw/svelte/, results/processed/technical-metrics.json.
- K7: 2 балл(а). Основание: скрипты сборки, tooling и структура package.json. Артефакты: apps/, results/raw/svelte/, results/processed/technical-metrics.json.
- K8: 2 балл(а). Основание: архитектурные соглашения и масштабируемость процесса разработки. Артефакты: apps/, results/raw/svelte/, results/processed/technical-metrics.json.
- K9: 2 балл(а). Основание: размер сборки, первичный рендеринг и время обновлений из technical-metrics.json. Артефакты: apps/, results/raw/svelte/, results/processed/technical-metrics.json.
- K10: 2 балл(а). Основание: совместимость с UI-экосистемой, UI-kit, a11y и i18n. Артефакты: apps/, results/raw/svelte/, results/processed/technical-metrics.json.

## Lit

- K1: 3 балл(а). Основание: структура компонента и возможность повторного использования в apps/. Артефакты: apps/, results/raw/lit/, results/processed/technical-metrics.json.
- K2: 3 балл(а). Основание: граница DOM и модель инкапсуляции в исходном коде. Артефакты: apps/, results/raw/lit/, results/processed/technical-metrics.json.
- K3: 3 балл(а). Основание: результат проверки конфликтующих стилей: passed. Артефакты: apps/, results/raw/lit/, results/processed/technical-metrics.json.
- K4: 2 балл(а). Основание: реализация поиска, фильтрации, сортировки и измерения времени обновления. Артефакты: apps/, results/raw/lit/, results/processed/technical-metrics.json.
- K5: 3 балл(а). Основание: результат проверки переносимости: html/react/vue. Артефакты: apps/, results/raw/lit/, results/processed/technical-metrics.json.
- K6: 3 балл(а). Основание: наблюдаемая зависимость от runtime и экосистемы. Артефакты: apps/, results/raw/lit/, results/processed/technical-metrics.json.
- K7: 2 балл(а). Основание: скрипты сборки, tooling и структура package.json. Артефакты: apps/, results/raw/lit/, results/processed/technical-metrics.json.
- K8: 2 балл(а). Основание: архитектурные соглашения и масштабируемость процесса разработки. Артефакты: apps/, results/raw/lit/, results/processed/technical-metrics.json.
- K9: 3 балл(а). Основание: размер сборки, первичный рендеринг и время обновлений из technical-metrics.json. Артефакты: apps/, results/raw/lit/, results/processed/technical-metrics.json.
- K10: 2 балл(а). Основание: совместимость с UI-экосистемой, UI-kit, a11y и i18n. Артефакты: apps/, results/raw/lit/, results/processed/technical-metrics.json.
