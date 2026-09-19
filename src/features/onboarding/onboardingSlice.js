import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: 'en',
  locationEnabled: false,
  professionId: null,
  topicIds: [],
  voiceId: null,
  briefMinutes: 5,
  deliveryTime: '07:00',
  notifications: { briefReady: true, breaking: true, weekly: true },
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setField: (state, { payload }) => { Object.assign(state, payload); },
    setNotification: (state, { payload }) => {
      state.notifications = { ...state.notifications, ...payload };
    },
    toggleTopic: (state, { payload: id }) => {
      state.topicIds = state.topicIds.includes(id)
        ? state.topicIds.filter((t) => t !== id)
        : [...state.topicIds, id];
    },
    resetOnboarding: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase('auth/logout', () => initialState);
  },
});

export const { setField, setNotification, toggleTopic, resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;