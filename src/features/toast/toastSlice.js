import { createSlice, nanoid } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: { items: [] },
  reducers: {
    showToast: {
      reducer: (state, { payload }) => {
        state.items.push(payload);
        if (state.items.length > 3) state.items.shift();
      },
      prepare: ({ type = 'info', message }) => ({ payload: { id: nanoid(), type, message } }),
    },
    removeToast: (state, { payload }) => {
      state.items = state.items.filter((t) => t.id !== payload);
    },
  },
});

export const { showToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;