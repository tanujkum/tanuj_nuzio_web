import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  queue: [],
  index: 0,
  isPlaying: false,
  progress: 0,     // 0 se 1
  nonce: 0,        // har naye play/restart pe badhta hai
  ended: false,    // queue khatam ho gayi (play dabane pe shuru se chalao)
  voiceName: null,
  autoAdvance: true,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playQueue: (state, { payload }) => {
      const { queue, index = 0, voiceName = null, autoAdvance = true } = payload;
      Object.assign(state, { queue, index, voiceName, autoAdvance, isPlaying: true, progress: 0, ended: false });
      state.nonce += 1;
    },
    togglePlay: (state) => {
      if (!state.queue.length) return;
      state.isPlaying = !state.isPlaying;
      // Sirf khatam ho chuki story dobara shuru karo. Pehle "progress === 0" check tha, jo un voices pe
      // galat tha jo boundary event nahi bhejti (pause -> play story ko shuru se chala deta tha)
      if (state.isPlaying && state.ended) { state.ended = false; state.progress = 0; state.nonce += 1; }
    },
    next: (state) => {
      if (state.index < state.queue.length - 1) {
        state.index += 1; state.progress = 0; state.isPlaying = true; state.ended = false; state.nonce += 1;
      }
    },
    prev: (state) => {
      if (state.index > 0 && state.progress < 0.1) state.index -= 1; // shuru mein ho to pichli, warna restart
      state.progress = 0; state.isPlaying = true; state.ended = false; state.nonce += 1;
    },
    setProgress: (state, { payload }) => { state.progress = Math.min(1, Math.max(state.progress, payload)); },
    trackEnded: (state) => {
      if (state.autoAdvance && state.index < state.queue.length - 1) {
        state.index += 1; state.progress = 0; state.nonce += 1;
      } else {
        state.isPlaying = false; state.progress = 1; state.ended = true;
      }
    },
    // TTS fail (voice na mile / browser block kare): poori queue skip karne ki jagah ruk jao
    playbackFailed: (state) => { state.isPlaying = false; state.progress = 0; state.ended = true; },
    stopPlayer: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase('auth/logout', () => initialState);
  },
});

export const {
  playQueue, togglePlay, next, prev, setProgress, trackEnded, playbackFailed, stopPlayer,
} = playerSlice.actions;
export default playerSlice.reducer;