import { createAsyncThunk } from '@reduxjs/toolkit';
import { getPlansApi, getCurrentSubscriptionApi, subscribeApi } from '../../api/billing.api';
import getError from '../../utils/getError';

export const fetchPlans = createAsyncThunk('billing/fetchPlans', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getPlansApi();
    return data.data;
  } catch (err) {
    return rejectWithValue(getError(err));
  }
});

export const fetchCurrentPlan = createAsyncThunk('billing/fetchCurrent', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getCurrentSubscriptionApi();
    return data.data; // { plan, subscription }
  } catch (err) {
    return rejectWithValue(getError(err));
  }
});

export const subscribePlan = createAsyncThunk('billing/subscribe', async (planId, { rejectWithValue }) => {
  try {
    const { data } = await subscribeApi(planId);
    return data.data; // { plan, subscription }
  } catch (err) {
    return rejectWithValue(getError(err));
  }
});