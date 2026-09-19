import './Chip.css';

export default function Chip({ active = false, icon, children, ...rest }) {
  return (
    <button type="button" className={`chip ${active ? 'chip--active' : ''}`} {...rest}>
      {icon && <span className="chip__icon">{icon}</span>}
      <span>{children}</span>
      {active && <span className="chip__check">✓</span>}
    </button>
  );
}