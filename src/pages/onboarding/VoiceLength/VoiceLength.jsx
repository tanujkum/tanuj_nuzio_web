import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setField } from '../../../features/onboarding/onboardingSlice';
import { retryMeta } from '../../../features/meta/metaSlice';
import { voiceLengthSchema } from '../../../validation/onboarding.schema';
import { calcStories, VOICE_PITCH } from '../../../utils/constants';
import useMeta from '../../../hooks/useMeta';
import useSpeech from '../../../hooks/useSpeech';
import OnboardingLayout from '../../../components/layout/OnboardingLayout/OnboardingLayout';
import Button from '../../../components/ui/Button/Button';
import Rich from '../../../components/ui/Rich';
import Icon from '../../../components/ui/Icon/Icon';
import { voiceColor } from '../../../utils/tagMap';
import useT from '../../../hooks/useT';
import './VoiceLength.css';

const PRESETS = [5, 10, 15];

export default function VoiceLength() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { voices, status, error: metaError } = useMeta();
  const { voiceId, briefMinutes } = useSelector((s) => s.onboarding);
  const { speak, stop, speaking, supported } = useSpeech();
  const { t } = useT();

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
    speak(v.sampleText, { pitch: VOICE_PITCH[v.name] ?? 1 });
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

  const label = selectedVoice && stories
    ? t('voice.contWith', { voice: selectedVoice.name, n: stories })
    : t('continue');

  return (
    <OnboardingLayout
      step={3}
      title={<Rich text={t('voice.title')} />}
      subtitle={t('voice.sub')}
      onBack={() => { stop(); navigate('/onboarding/topics'); }}
      footer={<Button onClick={onContinue}>{label}</Button>}
    >
      {status === 'loading' && <p className="onb__sub">{t('loading')}</p>}
      {status === 'failed' && (
        <div>
          <p className="form-error">{metaError}</p>
          <Button variant="ghost" onClick={() => dispatch(retryMeta())}>{t('retry')}</Button>
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
            <span className={`voice__avatar swatch swatch--${voiceColor(v.name)}`}>{v.name[0]}</span>
            <div className="voice__info">
              <strong>{v.name}</strong>
              <small>{v.description}</small>
            </div>
            {supported && (
              <button
                type="button"
                className={`voice__play ${speaking && playingId === v.id ? 'voice__play--on' : ''}`}
                onClick={(e) => onPlay(e, v)}
                aria-label={`Play ${v.name}`}
              >
                <Icon name={speaking && playingId === v.id ? 'pause' : 'play'} size={13} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="length">
        <p className="onb__kicker">{t('voice.lenKicker')}</p>
        <h2 className="length__title"><Rich text={t('voice.lenTitle')} /></h2>
        <p className="onb__sub">{t('voice.lenSub')}</p>

        <div className="length__row">
          {PRESETS.map((m) => (
            <button
              key={m}
              type="button"
              className={`length__pill ${!custom && briefMinutes === m ? 'length__pill--active' : ''}`}
              onClick={() => { setError(''); setCustom(false); dispatch(setField({ briefMinutes: m })); }}
            >
              {t('voice.min', { n: m })}
            </button>
          ))}
          <button
            type="button"
            className={`length__pill ${custom ? 'length__pill--active' : ''}`}
            onClick={() => { setError(''); setCustom(true); }}
          >
            {t('voice.custom')}
          </button>
        </div>

        {custom && (
          <input
            className="length__input"
            type="number"
            min="3"
            max="30"
            placeholder={t('voice.customPh')}
            value={customValue}
            onChange={(e) => { setError(''); setCustomValue(e.target.value); }}
          />
        )}
      </div>

      {error && <p className="form-error">{error}</p>}
    </OnboardingLayout>
  );
}
