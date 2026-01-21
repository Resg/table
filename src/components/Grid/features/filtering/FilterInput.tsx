import React from 'react';
import type { Column } from '@tanstack/react-table';

type FilterInputProps<TData> = {
  column: Column<TData, unknown>;
};

export function FilterInput<TData>({ column }: FilterInputProps<TData>) {
  const rawValue = column.getFilterValue();
  const [localValue, setLocalValue] = React.useState(String(rawValue ?? ''));

  React.useEffect(() => {
    setLocalValue(String(rawValue ?? ''));
  }, [rawValue]);

  React.useEffect(() => {
    const handle = window.setTimeout(() => {
      if (localValue !== String(rawValue ?? '')) {
        column.setFilterValue(localValue);
      }
    }, 200);

    return () => window.clearTimeout(handle);
  }, [column, localValue, rawValue]);

  return (
    <input
      className="filter-input"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder="Filter…"
    />
  );
}
