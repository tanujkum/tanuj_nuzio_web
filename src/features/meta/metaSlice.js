import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOnboardingMetaApi } from '../../api/meta.api';
import getError from '../../utils/getError';

export const fetchMeta = createAsyncThunk('meta/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getOnboardingMetaApi();
    return data.data; // { professions, topics, voices }
  } catch (err) {
    return rejectWithValue(getError(err));
  }
});

const metaSlice = createSlice({
  name: 'meta',
  initialState: { professions: [], topics: [], voices: [], status: 'idle', error: null },
  reducers: { retryMeta: (state) => { state.status = 'idle'; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeta.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchMeta.fulfilled, (state, { payload }) => {
        state.professions = payload.professions;
        state.topics = payload.topics;
        state.voices = payload.voices;
        state.status = 'done';
      })
      .addCase(fetchMeta.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      });
  },
});

export const { retryMeta } = metaSlice.actions;
export default metaSlice.reducer;