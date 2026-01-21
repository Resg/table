import React from 'react';
import type { GridProps } from './types';
import { useGridTable } from './createTable';
import { useRowVirtualizer } from '../features/virtualization/useRowVirtualizer';
import { useColumnReorder } from '../features/columns/useColumnReorder';
import { Header } from '../ui/Header';
import { Row } from '../ui/Row';

export function Grid<TData>(props: GridProps<TData>) {
  const {
    data,
    columns,
    settings,
    onSettingsChange,
    isLoading = false,
    rowHeight = 36,
    overscan = 12,
    showFilters = true,
  } = props;

  const table = useGridTable({
    data,
    columns,
    settings,
    onSettingsChange,
    showFilters,
  });

  const { handleHeaderDragStart, handleHeaderDrop, isReorderable } = useColumnReorder(table, {
    disabledColumnIds: ['select'],
  });
  const { parentRef, rows, totalSize, virtualItems } = useRowVirtualizer({
    table,
    rowHeight,
    overscan,
  });

  return (
    <div className="grid-shell">
      <Header
        table={table}
        showFilters={showFilters}
        onHeaderDragStart={handleHeaderDragStart}
        onHeaderDrop={handleHeaderDrop}
        isReorderableColumn={isReorderable}
      />

      <div ref={parentRef} className="scroll">
        <div style={{ height: totalSize, position: 'relative' }}>
          {isLoading ? (
            <div style={{ padding: 12, opacity: 0.8 }}>Загрузка…</div>
          ) : (
            virtualItems.map((vi) => {
              const row = rows[vi.index];
              if (!row) return null;
              return <Row key={row.id} row={row} top={vi.start} rowHeight={rowHeight} />;
            })
          )}
        </div>
      </div>
    </div>
  );
}
