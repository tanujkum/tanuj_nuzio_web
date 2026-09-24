import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setField } from '../../../features/onboarding/onboardingSlice';
import { retryMeta } from '../../../features/meta/metaSlice';
import { professionSchema } from '../../../validation/onboarding.schema';
import useMeta from '../../../hooks/useMeta';
import OnboardingLayout from '../../../components/layout/OnboardingLayout/OnboardingLayout';
import Chip from '../../../components/ui/Chip/Chip';
import { professionTag } from '../../../utils/tagMap';
import Button from '../../../components/ui/Button/Button';
import Rich from '../../../components/ui/Rich';
import useT from '../../../hooks/useT';

export default function Profession() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { professions, status, error: metaError } = useMeta();
  const professionId = useSelector((s) => s.onboarding.professionId);
  const [error, setError] = useState('');
  const { t, tn } = useT();

  const onContinue = async () => {
    try {
      await professionSchema.validate({ professionId });
      navigate('/onboarding/topics');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <OnboardingLayout
      step={1}
      title={<Rich text={t('prof.title')} />}
      subtitle={t('prof.sub')}
      onBack={() => navigate('/onboarding/language')}
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
        {professions.map((p) => (
          <Chip
            key={p.id}
            icon={professionTag(p.slug).icon}
            color={professionTag(p.slug).color}
            active={professionId === p.id}
            onClick={() => { setError(''); dispatch(setField({ professionId: p.id })); }}
          >
            {tn('profession', p)}
          </Chip>
        ))}
      </div>

      {error && <p className="form-error">{error}</p>}
    </OnboardingLayout>
  );
}
