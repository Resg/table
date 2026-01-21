import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { VirtualItem } from '@tanstack/react-virtual';
import type { Table, Row } from '@tanstack/react-table';

type RowVirtualizerArgs<TData> = {
  table: Table<TData>;
  rowHeight: number;
  overscan: number;
};

type RowVirtualizerResult<TData> = {
  parentRef: React.RefObject<HTMLDivElement>;
  rows: Row<TData>[];
  totalSize: number;
  virtualItems: VirtualItem[];
};

export function useRowVirtualizer<TData>(
  args: RowVirtualizerArgs<TData>
): RowVirtualizerResult<TData> {
  const { table, rowHeight, overscan } = args;
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  return {
    parentRef,
    rows,
    totalSize: rowVirtualizer.getTotalSize(),
    virtualItems: rowVirtualizer.getVirtualItems(),
  };
}
