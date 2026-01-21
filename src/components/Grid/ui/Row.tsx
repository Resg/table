import React from 'react';
import type { Row as TableRow } from '@tanstack/react-table';
import { Cell } from './Cell';

type RowProps<TData> = {
  row: TableRow<TData>;
  top: number;
  rowHeight: number;
};

export function Row<TData>({ row, top, rowHeight }: RowProps<TData>) {
  return (
    <div
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
        <Cell key={cell.id} cell={cell} />
      ))}
    </div>
  );
}
