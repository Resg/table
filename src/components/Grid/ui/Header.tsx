import React from 'react';
import { flexRender } from '@tanstack/react-table';
import type { Table } from '@tanstack/react-table';
import { FilterInput } from '../features/filtering/FilterInput';
import { SortIndicator } from '../features/sorting/SortIndicator';

type HeaderProps<TData> = {
  table: Table<TData>;
  showFilters: boolean;
  onHeaderDragStart: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
  onHeaderDrop: (e: React.DragEvent<HTMLDivElement>, targetId: string) => void;
  isReorderableColumn: (columnId: string) => boolean;
};

export function Header<TData>(props: HeaderProps<TData>) {
  const { table, showFilters, onHeaderDragStart, onHeaderDrop, isReorderableColumn } = props;

  return (
    <div className="grid-header">
      {table.getHeaderGroups().map((hg) => (
        <div key={hg.id} className="row">
          {hg.headers.map((header) => {
            const col = header.column;
            const size = col.getSize();
            const canSort = col.getCanSort();
            const sort = col.getIsSorted();
            const canReorder = !header.isPlaceholder && isReorderableColumn(col.id);

            return (
              <div
                key={header.id}
                className="cell header-cell"
                style={{ width: size, position: 'relative' }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onHeaderDrop(e, col.id)}
                draggable={canReorder}
                onDragStart={(e) => onHeaderDragStart(e, col.id)}
              >
                <button onClick={canSort ? col.getToggleSortingHandler() : undefined}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(col.columnDef.header, header.getContext())}
                  <SortIndicator sort={sort} />
                </button>
                {showFilters && col.getCanFilter() && <FilterInput column={col} />}

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
  );
}
