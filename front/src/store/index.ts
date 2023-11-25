import { combineReducers, configureStore } from '@reduxjs/toolkit';

import modalSlice from './Modal/modal';
import authSlice from './Auth/auth';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import notificationSlice from './Notification/notification';

const rootReducer = combineReducers({
  modal: modalSlice.reducer,
  auth: authSlice.reducer,
  notification: notificationSlice.reducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootStoreType = ReturnType<typeof store.getState>;
export default store;
