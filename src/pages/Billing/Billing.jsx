import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPlans, fetchCurrentPlan, subscribePlan } from '../../features/billing/billingThunks';
import { showToast } from '../../features/toast/toastSlice';
import useT from '../../hooks/useT';
import Rich from '../../components/ui/Rich';
import Icon from '../../components/ui/Icon/Icon';
import PlanCard from '../../components/billing/PlanCard/PlanCard';
import './Billing.css';

export default function Billing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plans, current, status, error, subscribingId } = useSelector((s) => s.billing);
  const { t } = useT();

  useEffect(() => {
    dispatch(fetchPlans());
    dispatch(fetchCurrentPlan());
  }, [dispatch]);

  const onSelect = async (plan) => {
    const price = plan.price ? ` for ₹${plan.price.toLocaleString('en-IN')}` : '';
    if (!window.confirm(t('bill.confirm', { plan: plan.name, price }))) return;
    try {
      await dispatch(subscribePlan(plan.id)).unwrap();
      dispatch(showToast({ type: 'success', message: t('bill.nowOn', { plan: plan.name }) }));
    } catch (msg) {
      dispatch(showToast({ type: 'error', message: typeof msg === 'string' ? msg : t('bill.fail') }));
    }
  };

  return (
    <div className="bill">
      <button type="button" className="bill__back" onClick={() => navigate('/settings')}>
        <Icon name="chevronLeft" size={15} /> {t('bill.back')}
      </button>
      <p className="bill__kicker">{t('bill.kicker')}</p>
      <h1 className="bill__title"><Rich text={t('bill.title')} /></h1>
      <p className="bill__sub">{t('bill.sub')}</p>

      {status === 'loading' && plans.length === 0 && <p className="bill__state">{t('bill.loading')}</p>}
      {status === 'failed' && (
        <div>
          <p className="form-error">{error}</p>
          <button type="button" className="bill__retry" onClick={() => dispatch(fetchPlans())}>{t('retry')}</button>
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

      <p className="bill__note">{t('bill.note')}</p>
    </div>
  );
}