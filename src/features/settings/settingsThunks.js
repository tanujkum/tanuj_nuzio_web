import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateSettingsApi } from '../../api/settings.api';
import getError from '../../utils/getError';

export const updateSettings = createAsyncThunk('settings/update', async (body, { rejectWithValue }) => {
  try {
    const { data } = await updateSettingsApi(body);
    return data.data; // { language, ...preference }
  } catch (err) {
    return rejectWithValue(getError(err));
  }
});