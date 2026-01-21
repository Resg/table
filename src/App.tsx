import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Grid } from '@/components/Grid/core/Grid';
import type { GridSettings } from '@/components/Grid/core/types';
import { createSelectColumn } from '@/components/Grid/ui';
import { useGetPeopleQuery, useGetSettingsQuery, useSaveSettingsMutation } from '@/store/gridApi';
import type { PersonRow } from '@/mocks/people';

const GRID_ID = 'people-grid';

const DEFAULT_SETTINGS: GridSettings = {
  version: 1,
  columnSizing: { select: 46, name: 220, age: 80, country: 100, department: 140 },
  columnOrder: [],
  columnVisibility: {},
  sorting: [],
  rowSelection: {},
  columnFilters: [],
};

function useDebounced<T extends (..._args: any[]) => void>(fn: T, wait = 250) {
  const fnRef = React.useRef(fn);
  const timeoutRef = React.useRef<number | undefined>(undefined);
  React.useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return React.useMemo(() => {
    return (...args: Parameters<T>) => {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => fnRef.current(...args), wait);
    };
  }, [wait]);
}

export function App() {
  const { data: people = [], isFetching: isFetchingPeople } = useGetPeopleQuery({ count: 20000 });

  const { data: settingsData, isFetching: isFetchingSettings } = useGetSettingsQuery({
    gridId: GRID_ID,
  });
  const [saveSettings] = useSaveSettingsMutation();

  const [localSettings, setLocalSettings] = React.useState<GridSettings>(DEFAULT_SETTINGS);

  React.useEffect(() => {
    if (settingsData) {
      setLocalSettings({
        ...DEFAULT_SETTINGS,
        ...settingsData,
        columnSizing: settingsData.columnSizing ?? DEFAULT_SETTINGS.columnSizing,
        columnOrder: settingsData.columnOrder ?? DEFAULT_SETTINGS.columnOrder,
        columnVisibility: settingsData.columnVisibility ?? DEFAULT_SETTINGS.columnVisibility,
        sorting: settingsData.sorting ?? DEFAULT_SETTINGS.sorting,
        rowSelection: settingsData.rowSelection ?? DEFAULT_SETTINGS.rowSelection,
        columnFilters: settingsData.columnFilters ?? DEFAULT_SETTINGS.columnFilters,
      });
    } else {
      setLocalSettings(DEFAULT_SETTINGS);
    }
  }, [settingsData]);

  const debouncedSave = useDebounced((next: GridSettings) => {
    saveSettings({ gridId: GRID_ID, settings: next });
  }, 300);

  const settings = localSettings;

  const columns = React.useMemo<ColumnDef<PersonRow, any>[]>(() => {
    return [
      createSelectColumn(),
      { accessorKey: 'name', id: 'name', header: 'Name', size: 220 },
      {
        accessorKey: 'age',
        id: 'age',
        header: 'Age',
        size: 80,
        filterFn: (row, columnId, value) =>
          String(row.getValue(columnId) ?? '').includes(String(value ?? '')),
      },
      { accessorKey: 'country', id: 'country', header: 'Country', size: 100 },
      { accessorKey: 'department', id: 'department', header: 'Department', size: 140 },
    ];
  }, []);

  const isLoading = isFetchingPeople || isFetchingSettings;

  const onSettingsChange = React.useCallback(
    (next: GridSettings) => {
      setLocalSettings(next);
      debouncedSave(next);
    },
    [debouncedSave]
  );

  const [showFilters, setShowFilters] = React.useState(true);

  return (
    <div className="container">
      <div className="card">
        <h1 className="h1">TanStack Grid Mini</h1>
        <div style={{ opacity: 0.75, marginBottom: 10 }}>
          rows: {people.length.toLocaleString()} • loading: {String(isLoading)}
        </div>
        <button
          className="filter-toggle"
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {showFilters ? 'Hide filters' : 'Show filters'}
        </button>

        <Grid<PersonRow>
          gridId={GRID_ID}
          data={people}
          columns={columns}
          isLoading={isLoading}
          settings={settings}
          onSettingsChange={onSettingsChange}
          showFilters={showFilters}
          rowHeight={36}
          overscan={14}
        />
      </div>
    </div>
  );
}
