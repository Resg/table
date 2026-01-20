import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Grid } from './components/Grid/core/Grid';
import type { GridSettings } from './components/Grid/core/types';
import { useGetPeopleQuery, useGetSettingsQuery, useSaveSettingsMutation } from './store/gridApi';
import type { PersonRow } from './mocks/people';

const GRID_ID = 'people-grid';

const DEFAULT_SETTINGS: GridSettings = {
  version: 1,
  columnSizing: { select: 46, name: 220, age: 80, country: 100, department: 140 },
  columnVisibility: {},
  sorting: [],
  rowSelection: {},
};

function useDebounced<T extends (...args: any[]) => void>(fn: T, wait = 250) {
  const fnRef = React.useRef(fn);
  fnRef.current = fn;

  return React.useMemo(() => {
    let t: number | undefined;
    return (...args: Parameters<T>) => {
      window.clearTimeout(t);
      t = window.setTimeout(() => fnRef.current(...args), wait);
    };
  }, [wait]);
}

export function App() {
  const { data: people = [], isFetching: isFetchingPeople } = useGetPeopleQuery({ count: 20000 });

  const { data: settingsData, isFetching: isFetchingSettings } = useGetSettingsQuery({ gridId: GRID_ID });
  const [saveSettings] = useSaveSettingsMutation();

  const settings: GridSettings = settingsData ?? DEFAULT_SETTINGS;

  const debouncedSave = useDebounced((next: GridSettings) => {
    saveSettings({ gridId: GRID_ID, settings: next });
  }, 300);

  const columns = React.useMemo<ColumnDef<PersonRow, any>[]>(() => {
    return [
      {
        id: 'select',
        header: ({ table }) => (
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
        ),
        cell: ({ row }) => (
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
        ),
        size: 46,
        enableSorting: false,
        enableResizing: false,
      },
      { accessorKey: 'name', id: 'name', header: 'Name', size: 220 },
      { accessorKey: 'age', id: 'age', header: 'Age', size: 80 },
      { accessorKey: 'country', id: 'country', header: 'Country', size: 100 },
      { accessorKey: 'department', id: 'department', header: 'Department', size: 140 },
    ];
  }, []);

  const isLoading = isFetchingPeople || isFetchingSettings;

  const onSettingsChange = React.useCallback(
    (next: GridSettings) => {
      debouncedSave(next);
    },
    [debouncedSave]
  );

  return (
    <div className="container">
      <div className="card">
        <h1 className="h1">TanStack Grid Mini</h1>
        <div style={{ opacity: 0.75, marginBottom: 10 }}>
          rows: {people.length.toLocaleString()} • loading: {String(isLoading)}
        </div>

        <Grid<PersonRow>
          gridId={GRID_ID}
          data={people}
          columns={columns}
          isLoading={isLoading}
          settings={settings}
          onSettingsChange={onSettingsChange}
          rowHeight={36}
          overscan={14}
        />
      </div>
    </div>
  );
}
