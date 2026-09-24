import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProgress, trackEnded, playbackFailed } from '../../features/player/playerSlice';
import { VOICE_PITCH } from '../../utils/constants';

const CHARS_PER_SEC = 14; // boundary event na aaye to progress ka andaaza

export default function PlayerEngine() {
  const dispatch = useDispatch();
  const { queue, index, isPlaying, nonce, voiceName } = useSelector((s) => s.player);
  const story = queue[index];
  const current = useRef(null);
  const clock = useRef({ elapsed: 0, since: null, gotBoundary: false });
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Naya track ya restart: naya utterance bolo
  useEffect(() => {
    if (!supported) return undefined;
    const synth = window.speechSynthesis;
    current.current = null;
    synth.cancel();
    if (!story) return undefined;

    synth.resume(); // pehle ka paused state clear
    const text = story.script || story.summary;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN';
    u.pitch = VOICE_PITCH[voiceName] ?? 1;
    clock.current = { elapsed: 0, since: Date.now(), gotBoundary: false };

    u.onboundary = (e) => {
      if (current.current !== u) return;
      clock.current.gotBoundary = true;
      dispatch(setProgress(e.charIndex / text.length));
    };
    u.onend = () => { if (current.current === u) dispatch(trackEnded()); };
    u.onerror = (e) => {
      // cancel() se aane wala 'interrupted'/'canceled' error ignore karo
      if (current.current === u && !['interrupted', 'canceled'].includes(e.error)) {
        console.warn('Speech failed:', e.error);
        dispatch(playbackFailed());
      }
    };
    current.current = u;
    synth.speak(u);

    // Kuch voices (jaise Chrome ki Google network voices) boundary event nahi bhejti:
    // tab waveform/progress time ke hisaab se chalao
    const estSec = Math.max(3, text.length / CHARS_PER_SEC);
    const timer = setInterval(() => {
      const c = clock.current;
      if (c.gotBoundary || current.current !== u || c.since === null) return;
      const sec = c.elapsed + (Date.now() - c.since) / 1000;
      dispatch(setProgress(Math.min(0.97, sec / estSec)));
    }, 300);

    return () => { clearInterval(timer); current.current = null; synth.cancel(); };
  }, [story?.id, nonce]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pause / resume
  useEffect(() => {
    if (!supported || !story) return;
    const synth = window.speechSynthesis;
    const c = clock.current;
    if (isPlaying) {
      synth.resume();
      if (c.since === null) c.since = Date.now();
    } else {
      if (synth.speaking) synth.pause();
      if (c.since !== null) { c.elapsed += (Date.now() - c.since) / 1000; c.since = null; }
    }
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
