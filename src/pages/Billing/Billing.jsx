import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPlans, fetchCurrentPlan, subscribePlan } from '../../features/billing/billingThunks';
import { showToast } from '../../features/toast/toastSlice';
import PlanCard from '../../components/billing/PlanCard/PlanCard';
import './Billing.css';

export default function Billing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plans, current, status, error, subscribingId } = useSelector((s) => s.billing);

  useEffect(() => {
    dispatch(fetchPlans());
    dispatch(fetchCurrentPlan());
  }, [dispatch]);

  const onSelect = async (plan) => {
    const price = plan.price ? ` for ₹${plan.price.toLocaleString('en-IN')}` : '';
    if (!window.confirm(`Switch to ${plan.name}${price}?\n(Demo only, no real payment)`)) return;
    try {
      await dispatch(subscribePlan(plan.id)).unwrap();
      dispatch(showToast({ type: 'success', message: `You're now on ${plan.name}` }));
    } catch (msg) {
      dispatch(showToast({ type: 'error', message: typeof msg === 'string' ? msg : 'Could not update plan' }));
    }
  };

  return (
    <div className="bill">
      <button type="button" className="bill__back" onClick={() => navigate('/settings')}>← Settings</button>
      <p className="bill__kicker">PLAN &amp; BILLING</p>
      <h1 className="bill__title">Start <em>Free.</em></h1>
      <p className="bill__sub">Upgrade when your mornings pay for themselves.</p>

      {status === 'loading' && plans.length === 0 && <p className="bill__state">Loading plans…</p>}
      {status === 'failed' && (
        <div>
          <p className="form-error">{error}</p>
          <button type="button" className="bill__retry" onClick={() => dispatch(fetchPlans())}>Retry</button>
        </div>
      )}

      <div className="bill__list">
        {plans.map((p) => (
          <PlanCard
            key={p.id}
            plan={p}
            isCurrent={current?.plan?.id === p.id}
            loading={subscribingId === p.id}
            onSelect={() => onSelect(p)}
          />
        ))}
      </div>

      <p className="bill__note">Demo payment flow. Koi real paisa nahi kat-ta.</p>
    </div>
  );
}