import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setField } from '../../../features/onboarding/onboardingSlice';
import { retryMeta } from '../../../features/meta/metaSlice';
import { voiceLengthSchema } from '../../../validation/onboarding.schema';
import { calcStories } from '../../../utils/constants';
import useMeta from '../../../hooks/useMeta';
import useSpeech from '../../../hooks/useSpeech';
import OnboardingLayout from '../../../components/layout/OnboardingLayout/OnboardingLayout';
import Button from '../../../components/ui/Button/Button';
import './VoiceLength.css';

const PRESETS = [5, 10, 15];
const PITCH = { Aria: 1.15, Kai: 0.85, Meera: 1.3 }; // browser TTS mein alag "feel" ke liye

export default function VoiceLength() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { voices, status, error: metaError } = useMeta();
  const { voiceId, briefMinutes } = useSelector((s) => s.onboarding);
  const { speak, stop, speaking, supported } = useSpeech();

  const [playingId, setPlayingId] = useState(null);
  const [custom, setCustom] = useState(!PRESETS.includes(briefMinutes));
  const [customValue, setCustomValue] = useState(PRESETS.includes(briefMinutes) ? '' : String(briefMinutes));
  const [error, setError] = useState('');

  // Pehli voice by default select
  useEffect(() => {
    if (voices.length && !voiceId) dispatch(setField({ voiceId: voices[0].id }));
  }, [voices, voiceId, dispatch]);

  const selectedVoice = voices.find((v) => v.id === voiceId);
  const minutes = custom ? Number(customValue) : briefMinutes;
  const stories = minutes >= 3 && minutes <= 30 ? calcStories(minutes) : null;

  const onPlay = (e, v) => {
    e.stopPropagation();
    if (speaking && playingId === v.id) return stop();
    setPlayingId(v.id);
    speak(v.sampleText, { pitch: PITCH[v.name] ?? 1 });
  };

  const onContinue = async () => {
    try {
      await voiceLengthSchema.validate({ voiceId, briefMinutes: minutes });
      stop();
      dispatch(setField({ briefMinutes: minutes }));
      navigate('/onboarding/time');
    } catch (e) {
      setError(e.message);
    }
  };

  const label = selectedVoice
    ? `Continue with ${selectedVoice.name}${stories ? ` · ${stories} stories` : ''} →`
    : 'Continue →';

  return (
    <OnboardingLayout
      step={3}
      title={<>Pick a narrator <em>voice.</em></>}
      subtitle="Tap ▶ to hear a sample."
      onBack={() => { stop(); navigate('/onboarding/topics'); }}
      footer={<Button onClick={onContinue}>{label}</Button>}
    >
      {status === 'loading' && <p className="onb__sub">Loading…</p>}
      {status === 'failed' && (
        <div>
          <p className="form-error">{metaError}</p>
          <Button variant="ghost" onClick={() => dispatch(retryMeta())}>Retry</Button>
        </div>
      )}

      <div className="voices">
        {voices.map((v) => (
          <div
            key={v.id}
            role="button"
            tabIndex={0}
            className={`voice ${voiceId === v.id ? 'voice--active' : ''}`}
            onClick={() => { setError(''); dispatch(setField({ voiceId: v.id })); }}
          >
            <span className="voice__avatar">{v.name[0]}</span>
            <div className="voice__info">
              <strong>{v.name}</strong>
              <small>{v.description}</small>
            </div>
            {supported && (
              <button type="button" className="voice__play" onClick={(e) => onPlay(e, v)} aria-label={`Play ${v.name}`}>
                {speaking && playingId === v.id ? '■' : '▶'}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="length">
        <p className="onb__kicker">BRIEF LENGTH</p>
        <h2 className="length__title">How long is <em>your morning?</em></h2>
        <p className="onb__sub">Set your ideal brief length.</p>

        <div className="length__row">
          {PRESETS.map((m) => (
            <button
              key={m}
              type="button"
              className={`length__pill ${!custom && briefMinutes === m ? 'length__pill--active' : ''}`}
              onClick={() => { setError(''); setCustom(false); dispatch(setField({ briefMinutes: m })); }}
            >
              {m} min
            </button>
          ))}
          <button
            type="button"
            className={`length__pill ${custom ? 'length__pill--active' : ''}`}
            onClick={() => { setError(''); setCustom(true); }}
          >
            Custom
          </button>
        </div>

        {custom && (
          <input
            className="length__input"
            type="number"
            min="3"
            max="30"
            placeholder="Minutes (3-30)"
            value={customValue}
            onChange={(e) => { setError(''); setCustomValue(e.target.value); }}
          />
        )}
      </div>

      {error && <p className="form-error">{error}</p>}
    </OnboardingLayout>
  );
}