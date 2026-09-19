import { createSlice } from '@reduxjs/toolkit';
import { devLogin, googleLogin, fetchMe } from './authThunks';
import { saveOnboarding } from '../onboarding/onboardingThunks';
import { updateSettings } from '../settings/settingsThunks';

const initialState = { token: null, user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.token = payload.token;
      state.user = payload.user;
    },
    setUser: (state, { payload }) => { state.user = payload; },
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    const onLogin = (state, { payload }) => {
      state.token = payload.token;
      state.user = payload.user;
    };
    builder
      .addCase(devLogin.fulfilled, onLogin)
      .addCase(googleLogin.fulfilled, onLogin)
      .addCase(saveOnboarding.fulfilled, (state, { payload }) => { state.user = payload; })
      .addCase(fetchMe.fulfilled, (state, { payload }) => { state.user = payload; })
      .addCase(updateSettings.fulfilled, (state, { payload }) => {
        if (!state.user) return;
        const { language, ...preference } = payload;
        state.user.language = language;
        state.user.preference = preference;
      });
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;