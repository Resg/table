import type { GridSettings } from './types';

export function updateSettings(settings: GridSettings, patch: Partial<GridSettings>): GridSettings {
  return { ...settings, ...patch };
}
