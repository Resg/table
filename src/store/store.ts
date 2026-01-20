import { configureStore } from '@reduxjs/toolkit';
import { gridApi } from './gridApi';

export const store = configureStore({
  reducer: {
    [gridApi.reducerPath]: gridApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(gridApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
