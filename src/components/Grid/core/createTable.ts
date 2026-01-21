import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef, Table } from '@tanstack/react-table';
import type { GridSettings } from './types';
import { updateSettings } from './settings';

type CreateTableArgs<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  settings: GridSettings;
  onSettingsChange: (next: GridSettings) => void;
  showFilters: boolean;
};

export function useGridTable<TData>(args: CreateTableArgs<TData>): Table<TData> {
  const { data, columns, settings, onSettingsChange, showFilters } = args;

  return useReactTable({
    data,
    columns,
    state: {
      sorting: settings.sorting,
      columnVisibility: settings.columnVisibility,
      columnSizing: settings.columnSizing,
      columnOrder: settings.columnOrder,
      rowSelection: settings.rowSelection,
      columnFilters: settings.columnFilters,
    },
    enableColumnFilters: showFilters,
    enableColumnResizing: true,
    enableMultiSort: true,
    isMultiSortEvent: (e) => {
      if (!e || typeof e !== 'object') return false;
      return 'ctrlKey' in e && Boolean((e as MouseEvent).ctrlKey);
    },
    enableRowSelection: true,
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(settings.sorting) : updater;
      onSettingsChange(updateSettings(settings, { sorting: next }));
    },
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === 'function' ? updater(settings.columnVisibility) : updater;
      onSettingsChange(updateSettings(settings, { columnVisibility: next }));
    },
    onColumnSizingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(settings.columnSizing) : updater;
      onSettingsChange(updateSettings(settings, { columnSizing: next }));
    },
    onColumnOrderChange: (updater) => {
      const next = typeof updater === 'function' ? updater(settings.columnOrder) : updater;
      onSettingsChange(updateSettings(settings, { columnOrder: next }));
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(settings.rowSelection) : updater;
      onSettingsChange(updateSettings(settings, { rowSelection: next }));
    },
    onColumnFiltersChange: (updater) => {
      const next = typeof updater === 'function' ? updater(settings.columnFilters) : updater;
      onSettingsChange(updateSettings(settings, { columnFilters: next }));
    },
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
}
