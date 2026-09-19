import StepProgress from '../../ui/StepProgress/StepProgress';
import './OnboardingLayout.css';

export default function OnboardingLayout({
  step, total = 5, title, subtitle, onBack, footer, children,
}) {
  return (
    <div className="onb">
      <header className="onb__top">
        <button type="button" className="onb__back" onClick={onBack} aria-label="Back">←</button>
        <StepProgress step={step} total={total} />
      </header>

      <div className="onb__head">
        <p className="onb__kicker">STEP {String(step).padStart(2, '0')} OF {String(total).padStart(2, '0')}</p>
        <h1 className="onb__title">{title}</h1>
        {subtitle && <p className="onb__sub">{subtitle}</p>}
      </div>

      <div className="onb__body">{children}</div>
      <footer className="onb__footer">{footer}</footer>
    </div>
  );
}
