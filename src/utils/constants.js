// Backend ke calcStories jaisa hi (5 min -> 4 stories)
export const calcStories = (minutes) => Math.max(2, Math.round(minutes * 0.8));

// Browser TTS mein voices ka alag "feel" (pitch se)
export const VOICE_PITCH = { Aria: 1.15, Kai: 0.85, Meera: 1.3 };