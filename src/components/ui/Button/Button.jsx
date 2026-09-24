import useT from '../../../hooks/useT';
import './Button.css';

export default function Button({
  variant = 'primary', loading = false, disabled, className = '', children, ...rest
}) {
  const { t } = useT();
  return (
    <button
      type="button"
      className={`btn btn--${variant} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? t('wait') : children}
    </button>
  );
}