import React from 'react';
import { flexRender } from '@tanstack/react-table';
import type { Cell as TableCell } from '@tanstack/react-table';

type CellProps<TData> = {
  cell: TableCell<TData, unknown>;
};

export function Cell<TData>({ cell }: CellProps<TData>) {
  return (
    <div
      className="cell"
      style={{ width: cell.column.getSize() }}
      title={String(cell.getValue() ?? '')}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  );
}
