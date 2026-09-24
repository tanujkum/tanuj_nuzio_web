import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleTopic } from '../../../features/onboarding/onboardingSlice';
import { retryMeta } from '../../../features/meta/metaSlice';
import { topicsSchema } from '../../../validation/onboarding.schema';
import useMeta from '../../../hooks/useMeta';
import OnboardingLayout from '../../../components/layout/OnboardingLayout/OnboardingLayout';
import Chip from '../../../components/ui/Chip/Chip';
import { topicTag } from '../../../utils/tagMap';
import Button from '../../../components/ui/Button/Button';
import Rich from '../../../components/ui/Rich';
import useT from '../../../hooks/useT';

const MAX = 7;

export default function Topics() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { topics, status, error: metaError } = useMeta();
  const topicIds = useSelector((s) => s.onboarding.topicIds);
  const [error, setError] = useState('');
  const { t, tn } = useT();

  const onToggle = (id) => {
    const selected = topicIds.includes(id);
    if (!selected && topicIds.length >= MAX) {
      setError(t('topics.max', { max: MAX }));
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
      title={<Rich text={t('topics.title')} />}
      subtitle={t('topics.sub', { max: MAX, n: topicIds.length })}
      onBack={() => navigate('/onboarding/profession')}
      footer={<Button onClick={onContinue}>{t('continue')}</Button>}
    >
      {status === 'loading' && <p className="onb__sub">{t('loading')}</p>}
      {status === 'failed' && (
        <div>
          <p className="form-error">{metaError}</p>
          <Button variant="ghost" onClick={() => dispatch(retryMeta())}>{t('retry')}</Button>
        </div>
      )}

      <div className="chip-grid">
        {topics.map((topic) => (
          <Chip
            key={topic.id}
            icon={topicTag(topic.slug).icon}
            color={topicTag(topic.slug).color}
            active={topicIds.includes(topic.id)}
            onClick={() => onToggle(topic.id)}
          >
            {tn('topic', topic)}
          </Chip>
        ))}
      </div>

      {error && <p className="form-error">{error}</p>}
    </OnboardingLayout>
  );
}
