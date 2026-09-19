import { createAsyncThunk } from '@reduxjs/toolkit';
import { devLoginApi, googleLoginApi, meApi } from '../../api/auth.api';
import getError from '../../utils/getError';

export const devLogin = createAsyncThunk('auth/devLogin', async (body, { rejectWithValue }) => {
  try {
    const { data } = await devLoginApi(body);
    return data.data;
  } catch (err) {
    return rejectWithValue(getError(err));
  }
});

export const googleLogin = createAsyncThunk('auth/googleLogin', async (body, { rejectWithValue }) => {
  try {
    const { data } = await googleLoginApi(body);
    return data.data;
  } catch (err) {
    return rejectWithValue(getError(err));
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await meApi();
    return data.data;
  } catch (err) {
    return rejectWithValue(getError(err));
  }
});