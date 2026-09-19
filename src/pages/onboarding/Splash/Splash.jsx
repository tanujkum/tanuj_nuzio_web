import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Splash.css';

export default function Splash() {
  const navigate = useNavigate();
  const { token, user } = useSelector((s) => s.auth);

  useEffect(() => {
    const t = setTimeout(() => {
      if (token && user?.onboardingCompleted) navigate('/home', { replace: true });
      else if (token) navigate('/onboarding/profession', { replace: true });
      else navigate('/onboarding/language', { replace: true });
    }, 1800);
    return () => clearTimeout(t);
  }, [token, user, navigate]);

  return (
    <div className="splash">
      <div className="splash__logo">◉</div>
      <h2 className="splash__brand">Nuzio<span>.ai</span></h2>
      <p className="splash__tag">News <em>on go.</em></p>
      <p className="splash__foot">YOUR DAILY AUDIO BRIEF</p>
    </div>
  );
}