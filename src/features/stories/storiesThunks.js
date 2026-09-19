import { createAsyncThunk } from '@reduxjs/toolkit';
import { getBriefApi, listStoriesApi, saveStoryApi, unsaveStoryApi } from '../../api/stories.api';
import getError from '../../utils/getError';

export const fetchBrief = createAsyncThunk('stories/fetchBrief', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getBriefApi();
    return data.data;
  } catch (err) {
    return rejectWithValue(getError(err));
  }
});

export const fetchStories = createAsyncThunk(
  'stories/fetchStories',
  async ({ q, topic, page = 1 }, { rejectWithValue }) => {
    try {
      const params = { page, limit: 8 };
      if (q) params.q = q;
      if (topic && topic !== 'all') params.topic = topic;
      const { data } = await listStoriesApi(params);
      return data.data; // { stories, pagination }
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

export const toggleSave = createAsyncThunk(
  'stories/toggleSave',
  async ({ id, save }, { rejectWithValue }) => {
    try {
      if (save) await saveStoryApi(id);
      else await unsaveStoryApi(id);
      return { id, isSaved: save };
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);