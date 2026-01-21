# План разработки (TanStack Grid Mini)

Цель: разработать новый компонент таблицы на базе **@tanstack/react-table** + **@tanstack/react-virtual**.
Проект автономный (Vite + React + TS). Данные и настройки — через RTK Query (моки).

## Итерация 0 — инфраструктура (сделано)

- Vite + React + TS
- Redux store
- RTK Query mock API (данные + настройки)
- Базовый Grid с виртуализацией, сортировкой, selection, ресайзом колонок

## Итерация 1 — “MVP таблицы”

- Виртуализация строк (фиксированный rowHeight)
- Sticky header
- Сортировка (client)
- Выбор строк (multi, checkbox)
- Column sizing (ресайз)
- Column reordering (dnd)
- Сохранение настроек: columnSizing, columnVisibility, sorting, rowSelection

## Итерация 2 — фильтры

- Text filter (debounce)
- Set/exclude filter
- UI для фильтров в header или popover

## Итерация 3 — дерево Parent

- Построение дерева по parentId -> subRows
- Expand/collapse + expand all/collapse all
- Selection propagation (родители/дети)

## Итерация 4 — grouping tree

- Grouping по выбранным колонкам
- Групповые строки + счетчики

## Итерация 5 — контекстное меню, экспорт, хоткеи

- Контекстное меню (на строке/хедере)
- Экспорт (CSV)
- Клавиатурная навигация (базовая)

## Правила производительности

- columns/data — стабилизировать (useMemo)
- Row/Cell — memo
- тяжелые вычисления (tree/group) — memo + кеши
- overscan 10–20, rowHeight фиксированный по умолчанию
