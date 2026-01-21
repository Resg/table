import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { GridProps } from './types';

export function Grid<TData>(props: GridProps<TData>) {
  const {
    data,
    columns,
    settings,
    onSettingsChange,
    isLoading = false,
    rowHeight = 36,
    overscan = 12,
  } = props;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: settings.sorting,
      columnVisibility: settings.columnVisibility,
      columnSizing: settings.columnSizing,
      columnOrder: settings.columnOrder,
      rowSelection: settings.rowSelection,
    },
    enableColumnResizing: true,
    enableMultiSort: true,
    isMultiSortEvent: (e) => {
      if (!e || typeof e !== 'object') return false;
      return 'ctrlKey' in e && Boolean((e as MouseEvent).ctrlKey);
    },
    enableRowSelection: true,
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(settings.sorting) : updater;
      onSettingsChange({ ...settings, sorting: next });
    },
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === 'function' ? updater(settings.columnVisibility) : updater;
      onSettingsChange({ ...settings, columnVisibility: next });
    },
    onColumnSizingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(settings.columnSizing) : updater;
      onSettingsChange({ ...settings, columnSizing: next });
    },
    onColumnOrderChange: (updater) => {
      const next = typeof updater === 'function' ? updater(settings.columnOrder) : updater;
      onSettingsChange({ ...settings, columnOrder: next });
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(settings.rowSelection) : updater;
      onSettingsChange({ ...settings, rowSelection: next });
    },
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  const totalSize = rowVirtualizer.getTotalSize();
  const virtualItems = rowVirtualizer.getVirtualItems();

  const handleHeaderDragStart = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
      e.dataTransfer.setData('text/plain', columnId);
      e.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const handleHeaderDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
      e.preventDefault();
      const sourceId = e.dataTransfer.getData('text/plain');
      if (!sourceId || sourceId === targetId) return;

      const orderedIds = table.getAllLeafColumns().map((col) => col.id);
      const fromIndex = orderedIds.indexOf(sourceId);
      const toIndex = orderedIds.indexOf(targetId);
      if (fromIndex === -1 || toIndex === -1) return;

      const next = [...orderedIds];
      next.splice(fromIndex, 1);
      next.splice(toIndex, 0, sourceId);
      table.setColumnOrder(next);
    },
    [table]
  );

  return (
    <div className="grid-shell">
      <div className="grid-header">
        {table.getHeaderGroups().map((hg) => (
          <div key={hg.id} className="row">
            {hg.headers.map((header) => {
              const col = header.column;
              const size = col.getSize();
              const canSort = col.getCanSort();
              const sort = col.getIsSorted();
              return (
                <div
                  key={header.id}
                  className="cell header-cell"
                  style={{ width: size, position: 'relative' }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleHeaderDrop(e, col.id)}
                  draggable={!header.isPlaceholder}
                  onDragStart={(e) => handleHeaderDragStart(e, col.id)}
                >
                  <button onClick={canSort ? col.getToggleSortingHandler() : undefined}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(col.columnDef.header, header.getContext())}
                    {sort === 'asc' ? ' ▲' : sort === 'desc' ? ' ▼' : ''}
                  </button>

                  {col.getCanResize() && (
                    <div
                      className="resizer"
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div ref={parentRef} className="scroll">
        <div style={{ height: totalSize, position: 'relative' }}>
          {isLoading ? (
            <div style={{ padding: 12, opacity: 0.8 }}>Загрузка…</div>
          ) : (
            virtualItems.map((vi) => {
              const row = rows[vi.index];
              const top = vi.start;

              return (
                <div
                  key={row.id}
                  className="row"
                  style={{
                    position: 'absolute',
                    top,
                    left: 0,
                    right: 0,
                    height: rowHeight,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div
                      key={cell.id}
                      className="cell"
                      style={{ width: cell.column.getSize() }}
                      title={String(cell.getValue() ?? '')}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
