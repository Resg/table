import React from 'react';
import type { Table } from '@tanstack/react-table';

type ColumnReorderOptions = {
  disabledColumnIds?: string[];
};

export function useColumnReorder<TData>(table: Table<TData>, options: ColumnReorderOptions = {}) {
  const disabledColumnIds = React.useMemo(
    () => new Set(options.disabledColumnIds ?? []),
    [options.disabledColumnIds]
  );
  const isReorderable = React.useCallback(
    (columnId: string) => !disabledColumnIds.has(columnId),
    [disabledColumnIds]
  );
  const handleHeaderDragStart = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
      if (!isReorderable(columnId)) return;
      e.dataTransfer.setData('text/plain', columnId);
      e.dataTransfer.effectAllowed = 'move';
    },
    [isReorderable]
  );

  const handleHeaderDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
      if (!isReorderable(targetId)) return;
      e.preventDefault();
      const sourceId = e.dataTransfer.getData('text/plain');
      if (!sourceId || sourceId === targetId) return;
      if (!isReorderable(sourceId)) return;

      const orderedIds = table.getAllLeafColumns().map((col) => col.id);
      const fromIndex = orderedIds.indexOf(sourceId);
      const toIndex = orderedIds.indexOf(targetId);
      if (fromIndex === -1 || toIndex === -1) return;

      const next = [...orderedIds];
      next.splice(fromIndex, 1);
      next.splice(toIndex, 0, sourceId);
      table.setColumnOrder(next);
    },
    [isReorderable, table]
  );

  return { handleHeaderDragStart, handleHeaderDrop, isReorderable };
}
