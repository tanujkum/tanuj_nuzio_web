import './PlanCard.css';

const INTERVAL = { forever: '/forever', month: '/mo', year: '/yr' };

export default function PlanCard({ plan, isCurrent, loading, onSelect }) {
  const label = isCurrent
    ? 'Current plan'
    : plan.price === 0 ? 'Switch to Free' : `Upgrade to ${plan.name}`;

  return (
    <div className={`plan ${plan.isPopular ? 'plan--pro' : ''} ${isCurrent ? 'plan--current' : ''}`}>
      {plan.isPopular && <span className="plan__badge">Most popular</span>}
      <h3 className="plan__name">{plan.name}</h3>
      <p className="plan__price">
        ₹{plan.price.toLocaleString('en-IN')}<small>{INTERVAL[plan.interval]}</small>
      </p>
      <ul className="plan__features">
        {(plan.features || []).map((f) => <li key={f}>✓ {f}</li>)}
      </ul>
      <button
        type="button"
        className={`plan__btn ${plan.isPopular && !isCurrent ? 'plan__btn--pro' : ''}`}
        disabled={isCurrent || loading}
        onClick={onSelect}
      >
        {loading ? 'Please wait…' : label}
      </button>
    </div>
  );
}