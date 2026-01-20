import { createApi } from '@reduxjs/toolkit/query/react';
import type { GridSettings } from '@/components/Grid/core/types';
import { makePeople, type PersonRow } from '@/mocks/people';

type PeopleArgs = { count: number };
type SettingsArgs = { gridId: string };
type SaveSettingsArgs = { gridId: string; settings: GridSettings };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const mockDb = {
  people: makePeople(20000),
  settingsByGridId: new Map<string, GridSettings>(),
};

export const gridApi = createApi({
  reducerPath: 'gridApi',
  baseQuery: async (arg: any) => {
    const { url, method = 'GET', body, params } = arg ?? {};
    await sleep(120);

    try {
      if (url === '/people' && method === 'GET') {
        const count = Number(params?.count ?? mockDb.people.length);
        return { data: mockDb.people.slice(0, count) as PersonRow[] };
      }

      if (url === '/settings' && method === 'GET') {
        const gridId = String(params?.gridId ?? '');
        const data = mockDb.settingsByGridId.get(gridId) ?? null;
        return { data };
      }

      if (url === '/settings' && method === 'POST') {
        const { gridId, settings } = body as SaveSettingsArgs;
        mockDb.settingsByGridId.set(gridId, settings);
        return { data: { ok: true } };
      }

      return { error: { status: 404, data: 'Not found' } as any };
    } catch (e: any) {
      return { error: { status: 500, data: String(e?.message ?? e) } as any };
    }
  },
  endpoints: (build) => ({
    getPeople: build.query<PersonRow[], PeopleArgs>({
      query: ({ count }) => ({ url: '/people', method: 'GET', params: { count } }),
    }),
    getSettings: build.query<GridSettings | null, SettingsArgs>({
      query: ({ gridId }) => ({ url: '/settings', method: 'GET', params: { gridId } }),
    }),
    saveSettings: build.mutation<{ ok: true }, SaveSettingsArgs>({
      query: ({ gridId, settings }) => ({ url: '/settings', method: 'POST', body: { gridId, settings } }),
    }),
  }),
});

export const { useGetPeopleQuery, useGetSettingsQuery, useSaveSettingsMutation } = gridApi;
