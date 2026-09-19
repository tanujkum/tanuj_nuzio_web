import { useCallback, useEffect, useRef, useState } from 'react';

export default function useSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [speaking, setSpeaking] = useState(false);
  const current = useRef(null);

  const stop = useCallback(() => {
    if (!supported) return;
    current.current = null;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback((text, { lang = 'en-IN', rate = 1, pitch = 1 } = {}) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.pitch = pitch;
    const done = () => { if (current.current === u) setSpeaking(false); };
    u.onend = done;
    u.onerror = done;
    current.current = u;
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }, [supported]);

  useEffect(() => () => { if (supported) window.speechSynthesis.cancel(); }, [supported]);

  return { speak, stop, speaking, supported };
}