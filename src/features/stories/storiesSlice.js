import { createSlice } from '@reduxjs/toolkit';
import { fetchBrief, fetchStories, toggleSave } from './storiesThunks';

const initialState = {
  brief: { data: null, status: 'idle', error: null },
  discover: { items: [], pagination: null, status: 'idle', error: null, requestId: null },
};

const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
       .addCase('auth/logout', () => initialState)
      // ---- brief ----
      .addCase(fetchBrief.pending, (state) => { state.brief.status = 'loading'; state.brief.error = null; })
      .addCase(fetchBrief.fulfilled, (state, { payload }) => { state.brief.data = payload; state.brief.status = 'done'; })
      .addCase(fetchBrief.rejected, (state, { payload }) => { state.brief.status = 'failed'; state.brief.error = payload; })

      // ---- discover ----
      .addCase(fetchStories.pending, (state, action) => {
        state.discover.status = (action.meta.arg.page || 1) > 1 ? 'loadingMore' : 'loading';
        state.discover.requestId = action.meta.requestId; // purani request ka response ignore karne ke liye
        state.discover.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        if (state.discover.requestId !== action.meta.requestId) return;
        const { stories, pagination } = action.payload;
        state.discover.items = (action.meta.arg.page || 1) > 1
          ? [...state.discover.items, ...stories]
          : stories;
        state.discover.pagination = pagination;
        state.discover.status = 'done';
      })
      .addCase(fetchStories.rejected, (state, action) => {
        if (state.discover.requestId !== action.meta.requestId) return;
        state.discover.status = 'failed';
        state.discover.error = action.payload;
      })

      // ---- save / unsave (dono jagah update) ----
      .addCase(toggleSave.fulfilled, (state, { payload }) => {
        const mark = (s) => { if (s.id === payload.id) s.isSaved = payload.isSaved; };
        state.brief.data?.stories.forEach(mark);
        state.discover.items.forEach(mark);
      });
  },
});

export default storiesSlice.reducer;