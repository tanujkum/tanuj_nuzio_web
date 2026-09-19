import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleTopic } from '../../../features/onboarding/onboardingSlice';
import { retryMeta } from '../../../features/meta/metaSlice';
import { topicsSchema } from '../../../validation/onboarding.schema';
import useMeta from '../../../hooks/useMeta';
import OnboardingLayout from '../../../components/layout/OnboardingLayout/OnboardingLayout';
import Chip from '../../../components/ui/Chip/Chip';
import Button from '../../../components/ui/Button/Button';

const MAX = 7;

export default function Topics() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { topics, status, error: metaError } = useMeta();
  const topicIds = useSelector((s) => s.onboarding.topicIds);
  const [error, setError] = useState('');

  const onToggle = (id) => {
    const selected = topicIds.includes(id);
    if (!selected && topicIds.length >= MAX) {
      setError(`You can pick up to ${MAX} topics`);
      return;
    }
    setError('');
    dispatch(toggleTopic(id));
  };

  const onContinue = async () => {
    try {
      await topicsSchema.validate({ topicIds });
      navigate('/onboarding/voice');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <OnboardingLayout
      step={2}
      title={<>What moves <em>your world?</em></>}
      subtitle={`Pick up to ${MAX} topics · ${topicIds.length}/${MAX} selected`}
      onBack={() => navigate('/onboarding/profession')}
      footer={<Button onClick={onContinue}>Continue →</Button>}
    >
      {status === 'loading' && <p className="onb__sub">Loading…</p>}
      {status === 'failed' && (
        <div>
          <p className="form-error">{metaError}</p>
          <Button variant="ghost" onClick={() => dispatch(retryMeta())}>Retry</Button>
        </div>
      )}

      <div className="chip-grid">
        {topics.map((t) => (
          <Chip key={t.id} icon={t.icon} active={topicIds.includes(t.id)} onClick={() => onToggle(t.id)}>
            {t.name}
          </Chip>
        ))}
      </div>

      {error && <p className="form-error">{error}</p>}
    </OnboardingLayout>
  );
}