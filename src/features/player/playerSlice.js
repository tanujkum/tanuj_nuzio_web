import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  queue: [],
  index: 0,
  isPlaying: false,
  progress: 0,     // 0 se 1
  nonce: 0,        // har naye play/restart pe badhta hai
  voiceName: null,
  autoAdvance: true,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playQueue: (state, { payload }) => {
      const { queue, index = 0, voiceName = null, autoAdvance = true } = payload;
      Object.assign(state, { queue, index, voiceName, autoAdvance, isPlaying: true, progress: 0 });
      state.nonce += 1;
    },
    togglePlay: (state) => {
      if (!state.queue.length) return;
      state.isPlaying = !state.isPlaying;
      if (state.isPlaying && state.progress === 0) state.nonce += 1; // khatam ho chuki story dobara chalao
    },
    next: (state) => {
      if (state.index < state.queue.length - 1) {
        state.index += 1; state.progress = 0; state.isPlaying = true; state.nonce += 1;
      }
    },
    prev: (state) => {
      if (state.index > 0 && state.progress < 0.1) state.index -= 1; // shuru mein ho to pichli, warna restart
      state.progress = 0; state.isPlaying = true; state.nonce += 1;
    },
    setProgress: (state, { payload }) => { state.progress = payload; },
    trackEnded: (state) => {
      if (state.autoAdvance && state.index < state.queue.length - 1) {
        state.index += 1; state.progress = 0; state.nonce += 1;
      } else {
        state.isPlaying = false; state.progress = 0;
      }
    },
    stopPlayer: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase('auth/logout', () => initialState);
  },
});

export const { playQueue, togglePlay, next, prev, setProgress, trackEnded, stopPlayer } = playerSlice.actions;
export default playerSlice.reducer;