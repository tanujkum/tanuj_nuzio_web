import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setField } from '../../../features/onboarding/onboardingSlice';
import { deliveryTimeSchema } from '../../../validation/onboarding.schema';
import { toMin, toStr, fmt12, period } from '../../../utils/time';
import OnboardingLayout from '../../../components/layout/OnboardingLayout/OnboardingLayout';
import Button from '../../../components/ui/Button/Button';
import Rich from '../../../components/ui/Rich';
import useT from '../../../hooks/useT';
import './DeliveryTime.css';

const OFFSETS = [-60, -30, 0, 30, 60];

export default function DeliveryTime() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const time = useSelector((s) => s.onboarding.deliveryTime);
  const [error, setError] = useState('');
  const { t } = useT();

  const cur = toMin(time);
  const setTime = (t) => { setError(''); dispatch(setField({ deliveryTime: t })); };
  const flip = (p) => { if (period(time) !== p) setTime(toStr(cur + 720)); };

  const onContinue = async () => {
    try {
      await deliveryTimeSchema.validate({ deliveryTime: time });
      navigate('/onboarding/notifications');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <OnboardingLayout
      step={4}
      title={<Rich text={t('time.title')} />}
      subtitle={t('time.sub')}
      onBack={() => navigate('/onboarding/voice')}
      footer={<Button onClick={onContinue}>{t('continue')}</Button>}
    >
      <div className="ampm">
        {['AM', 'PM'].map((p) => (
          <button
            key={p}
            type="button"
            className={`ampm__btn ${period(time) === p ? 'ampm__btn--active' : ''}`}
            onClick={() => flip(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="wheel">
        <button type="button" className="wheel__arrow" onClick={() => setTime(toStr(cur - 30))}>▲</button>
        {OFFSETS.map((o) => {
          const t = toStr(cur + o);
          return (
            <button
              key={o}
              type="button"
              className={`wheel__item ${o === 0 ? 'wheel__item--sel' : ''} ${Math.abs(o) === 60 ? 'wheel__item--far' : ''}`}
              onClick={() => setTime(t)}
            >
              {fmt12(t)}{o === 0 && <small> {period(t)}</small>}
            </button>
          );
        })}
        <button type="button" className="wheel__arrow" onClick={() => setTime(toStr(cur + 30))}>▼</button>
      </div>

      {error && <p className="form-error">{error}</p>}
    </OnboardingLayout>
  );
}