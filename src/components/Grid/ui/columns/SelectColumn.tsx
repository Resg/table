/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import type { ColumnDef, Row, Table } from '@tanstack/react-table';

type SelectColumnOptions = {
  id?: string;
  size?: number;
};

function SelectAllCheckbox<TData>({ table }: { table: Table<TData> }) {
  return (
    <input
      className="checkbox"
      type="checkbox"
      checked={table.getIsAllRowsSelected()}
      ref={(el) => {
        if (!el) return;
        el.indeterminate = table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected();
      }}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  );
}

function SelectRowCheckbox<TData>({ row }: { row: Row<TData> }) {
  return (
    <input
      className="checkbox"
      type="checkbox"
      checked={row.getIsSelected()}
      ref={(el) => {
        if (!el) return;
        el.indeterminate = row.getIsSomeSelected() && !row.getIsSelected();
      }}
      onChange={row.getToggleSelectedHandler()}
    />
  );
}

export function createSelectColumn<TData>(
  options: SelectColumnOptions = {}
): ColumnDef<TData, unknown> {
  const { id = 'select', size = 46 } = options;

  return {
    id,
    header: ({ table }) => <SelectAllCheckbox table={table} />,
    cell: ({ row }) => <SelectRowCheckbox row={row} />,
    size,
    enableSorting: false,
    enableResizing: false,
    enableColumnFilter: false,
  };
}
