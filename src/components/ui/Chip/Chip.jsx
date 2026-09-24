import Icon from '../Icon/Icon';
import './Chip.css';

export default function Chip({ active = false, icon, color = 'slate', children, ...rest }) {
  return (
    <button type="button" className={`chip ${active ? 'chip--active' : ''}`} {...rest}>
      {icon && (
        <span className={`chip__icon swatch swatch--${color}`}>
          <Icon name={icon} size={16} />
        </span>
      )}
      <span className="chip__label">{children}</span>
      {active && (
        <span className="chip__check">
          <Icon name="check" size={10} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}
