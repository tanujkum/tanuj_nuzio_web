import { createSlice } from '@reduxjs/toolkit';
import { fetchPlans, fetchCurrentPlan, subscribePlan } from './billingThunks';

const initialState = { plans: [], current: null, status: 'idle', error: null, subscribingId: null };

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase('auth/logout', () => initialState)
      .addCase(fetchPlans.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchPlans.fulfilled, (state, { payload }) => { state.plans = payload; state.status = 'done'; })
      .addCase(fetchPlans.rejected, (state, { payload }) => { state.status = 'failed'; state.error = payload; })
      .addCase(fetchCurrentPlan.fulfilled, (state, { payload }) => { state.current = payload; })
      .addCase(subscribePlan.pending, (state, action) => { state.subscribingId = action.meta.arg; })
      .addCase(subscribePlan.fulfilled, (state, { payload }) => { state.current = payload; state.subscribingId = null; })
      .addCase(subscribePlan.rejected, (state) => { state.subscribingId = null; });
  },
});

export default billingSlice.reducer;