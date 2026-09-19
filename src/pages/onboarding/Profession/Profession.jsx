import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setField } from '../../../features/onboarding/onboardingSlice';
import { retryMeta } from '../../../features/meta/metaSlice';
import { professionSchema } from '../../../validation/onboarding.schema';
import useMeta from '../../../hooks/useMeta';
import OnboardingLayout from '../../../components/layout/OnboardingLayout/OnboardingLayout';
import Chip from '../../../components/ui/Chip/Chip';
import Button from '../../../components/ui/Button/Button';

export default function Profession() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { professions, status, error: metaError } = useMeta();
  const professionId = useSelector((s) => s.onboarding.professionId);
  const [error, setError] = useState('');

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
      title={<>What's your <em>profession?</em></>}
      subtitle="We'll tune your brief to what actually moves your day."
      onBack={() => navigate('/login')}
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
        {professions.map((p) => (
          <Chip
            key={p.id}
            icon={p.icon}
            active={professionId === p.id}
            onClick={() => { setError(''); dispatch(setField({ professionId: p.id })); }}
          >
            {p.name}
          </Chip>
        ))}
      </div>

      {error && <p className="form-error">{error}</p>}
    </OnboardingLayout>
  );
}