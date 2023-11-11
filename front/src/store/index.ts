import { combineReducers, configureStore } from '@reduxjs/toolkit';

import modalSlice from './modal';
import authSlice from './auth';

const rootReducer = combineReducers({
  modal: modalSlice.reducer,
  auth: authSlice.reducer,
});
const store = configureStore({
  reducer: rootReducer,
});

export type RootStoreType = ReturnType<typeof store.getState>;
export default store;
