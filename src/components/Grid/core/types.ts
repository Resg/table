import type {
  ColumnDef,
  SortingState,
  VisibilityState,
  ColumnSizingState,
  RowSelectionState,
  ColumnOrderState,
} from '@tanstack/react-table';

export type GridId = string;

export type GridSettings = {
  version: number;
  columnSizing: ColumnSizingState;
  columnOrder: ColumnOrderState;
  columnVisibility: VisibilityState;
  sorting: SortingState;
  rowSelection: RowSelectionState;
};

export type GridProps<TData> = {
  gridId: GridId;
  data: TData[];
  columns: ColumnDef<TData, any>[];
  isLoading?: boolean;

  settings: GridSettings;
  onSettingsChange: (_next: GridSettings) => void;

  rowHeight?: number;
  overscan?: number;
};
