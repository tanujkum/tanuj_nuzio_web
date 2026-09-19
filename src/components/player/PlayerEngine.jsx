import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProgress, trackEnded } from '../../features/player/playerSlice';
import { VOICE_PITCH } from '../../utils/constants';

export default function PlayerEngine() {
  const dispatch = useDispatch();
  const { queue, index, isPlaying, nonce, voiceName } = useSelector((s) => s.player);
  const story = queue[index];
  const current = useRef(null);
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
    u.onboundary = (e) => { if (current.current === u) dispatch(setProgress(e.charIndex / text.length)); };
    u.onend = () => { if (current.current === u) dispatch(trackEnded()); };
    current.current = u;
    synth.speak(u);

    return () => { current.current = null; synth.cancel(); };
  }, [story?.id, nonce]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pause / resume
  useEffect(() => {
    if (!supported || !story) return;
    const synth = window.speechSynthesis;
    if (isPlaying) synth.resume();
    else if (synth.speaking) synth.pause();
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}