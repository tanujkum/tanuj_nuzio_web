import useT from '../../../hooks/useT';
import Icon from '../../ui/Icon/Icon';
import './PlanCard.css';

const INTERVAL = { forever: '/forever', month: '/mo', year: '/yr' };

export default function PlanCard({ plan, isCurrent, loading, onSelect }) {
  const { t } = useT();
  const label = isCurrent
    ? t('bill.current')
    : plan.price === 0 ? t('bill.switchFree') : t('bill.upgrade', { plan: plan.name });

  return (
    <div className={`plan ${plan.isPopular ? 'plan--pro' : ''} ${isCurrent ? 'plan--current' : ''}`}>
      {plan.isPopular && <span className="plan__badge">{t('bill.popular')}</span>}
      <h3 className="plan__name">{plan.name}</h3>
      <p className="plan__price">
        ₹{plan.price.toLocaleString('en-IN')}<small>{INTERVAL[plan.interval]}</small>
      </p>
      <ul className="plan__features">
        {(plan.features || []).map((f) => (
          <li key={f}>
            <span className="plan__check"><Icon name="check" size={11} strokeWidth={2.4} /></span>
            {f}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`plan__btn ${plan.isPopular && !isCurrent ? 'plan__btn--pro' : ''}`}
        disabled={isCurrent || loading}
        onClick={onSelect}
      >
        {loading ? t('wait') : label}
      </button>
    </div>
  );
}