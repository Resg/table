import React from 'react';
import type { Column } from '@tanstack/react-table';

type FilterInputProps<TData> = {
  column: Column<TData, unknown>;
};

export function FilterInput<TData>({ column }: FilterInputProps<TData>) {
  return (
    <input
      className="filter-input"
      value={String(column.getFilterValue() ?? '')}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Filter…"
    />
  );
}
