import './Button.css';

export default function Button({
  variant = 'primary', loading = false, disabled, className = '', children, ...rest
}) {
  return (
    <button
      type="button"
      className={`btn btn--${variant} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}