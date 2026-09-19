import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore, persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/es/storage';

import authReducer from '../features/auth/authSlice';
import onboardingReducer from '../features/onboarding/onboardingSlice';
import metaReducer from '../features/meta/metaSlice';
import storiesReducer from '../features/stories/storiesSlice';
import playerReducer from '../features/player/playerSlice';
import billingReducer from '../features/billing/billingSlice';
import toastReducer from '../features/toast/toastSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  onboarding: onboardingReducer,
  meta: metaReducer,
  stories: storiesReducer,
  player: playerReducer,
  billing: billingReducer,
  toast: toastReducer,
});

const persistConfig = { key: 'nuzio', storage, whitelist: ['auth', 'onboarding'] };

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);