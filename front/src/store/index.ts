import { configureStore } from '@reduxjs/toolkit';

import modalSlice from './modal';

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
  },
});

export type RootStoreType = ReturnType<typeof store.getState>;
export default store;
