import type {
  ColumnDef,
  SortingState,
  VisibilityState,
  ColumnSizingState,
  RowSelectionState,
} from '@tanstack/react-table';

export type GridId = string;

export type GridSettings = {
  version: number;
  columnSizing: ColumnSizingState;
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
  onSettingsChange: (next: GridSettings) => void;

  rowHeight?: number;
  overscan?: number;
};
