import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveOnboarding } from '../../../features/onboarding/onboardingThunks';
import { resetOnboarding } from '../../../features/onboarding/onboardingSlice';
import { fullOnboardingSchema } from '../../../validation/onboarding.schema';
import { calcStories } from '../../../utils/constants';
import { fmt12, period } from '../../../utils/time';
import useMeta from '../../../hooks/useMeta';
import Button from '../../../components/ui/Button/Button';
import './Ready.css';

export default function Ready() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { professions, topics, voices } = useMeta();
  const onb = useSelector((s) => s.onboarding);
  const user = useSelector((s) => s.auth.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const profession = professions.find((p) => p.id === onb.professionId)?.name || '-';
  const topicNames = topics.filter((t) => onb.topicIds.includes(t.id)).map((t) => t.name);
  const voice = voices.find((v) => v.id === onb.voiceId)?.name || '-';
  const firstName = user?.name?.split(' ')[0] || 'there';

  const rows = [
    ['PROFESSION', profession],
    ['TOPICS', topicNames.length > 2 ? `${topicNames.slice(0, 2).join(', ')} +${topicNames.length - 2}` : topicNames.join(', ') || '-'],
    ['VOICE', voice],
    ['LENGTH', `${calcStories(onb.briefMinutes)} stories · ~${onb.briefMinutes} min`],
    ['DELIVERY', `Daily at ${fmt12(onb.deliveryTime)} ${period(onb.deliveryTime)}`],
  ];

  const onStart = async () => {
    setError('');
    try {
      await fullOnboardingSchema.validate(onb, { abortEarly: true });
    } catch (e) {
      return setError(`${e.message}. Please go back and complete the previous steps.`);
    }

    setLoading(true);
    try {
      await dispatch(saveOnboarding()).unwrap();
      navigate('/home', { replace: true });
      dispatch(resetOnboarding());
    } catch (msg) {
      setError(typeof msg === 'string' ? msg : 'Could not save. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="ready">
      <div className="ready__top">
        <div className="ready__check">✓</div>
        <p className="onb__kicker">ALL SET</p>
        <h1 className="ready__title">You're ready, <em>{firstName}.</em></h1>
        <p className="ready__sub">Your first brief will be waiting for you. We'll ping you when it's ready.</p>
      </div>

      <div className="ready__list">
        {rows.map(([k, v]) => (
          <div key={k} className="ready__row">
            <span>{k}</span>
            <strong>{v}</strong>
            <em>✓</em>
          </div>
        ))}
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="ready__footer">
        <Button loading={loading} onClick={onStart}>Start listening →</Button>
      </div>
    </div>
  );
}