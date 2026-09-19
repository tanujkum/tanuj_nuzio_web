import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setField } from '../../../features/onboarding/onboardingSlice';
import Button from '../../../components/ui/Button/Button';
import Toggle from '../../../components/ui/Toggle/Toggle';
import './Language.css';

const LANGUAGES = [
  { code: 'en', label: 'English', sub: 'Briefings delivered in English' },
  { code: 'hi', label: 'हिन्दी', sub: 'ब्रीफ़िंग हिन्दी में' },
];

export default function Language() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { language, locationEnabled } = useSelector((s) => s.onboarding);

  return (
    <div className="lang">
      <div className="lang__logo">◉ Nuzio<span>.ai</span></div>

      <div className="lang__body">
        <h1 className="lang__title">Choose your <em>language</em></h1>
        <p className="lang__sub">Select the language for your daily brief</p>

        <div className="lang__list">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`lang__card ${language === l.code ? 'lang__card--active' : ''}`}
              onClick={() => dispatch(setField({ language: l.code }))}
            >
              <div>
                <strong>{l.label}</strong>
                <small>{l.sub}</small>
              </div>
              <span className="lang__radio" />
            </button>
          ))}
        </div>

        <div className="lang__loc">
          <div>
            <strong>Enable Location</strong>
            <small>Get personal local news tailored to your city</small>
          </div>
          <Toggle
            checked={locationEnabled}
            onChange={(v) => dispatch(setField({ locationEnabled: v }))}
          />
        </div>
      </div>

      <Button onClick={() => navigate('/login')}>Continue →</Button>
    </div>
  );
}