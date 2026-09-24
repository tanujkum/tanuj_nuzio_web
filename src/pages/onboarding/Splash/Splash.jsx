import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useT from '../../../hooks/useT';
import Rich from '../../../components/ui/Rich';
import Icon from '../../../components/ui/Icon/Icon';
import './Splash.css';

export default function Splash() {
  const navigate = useNavigate();
  const { token, user } = useSelector((s) => s.auth);
  const { t } = useT();

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
      <div className="splash__logo"><Icon name="logo" size={28} strokeWidth={2} /></div>
      <h2 className="splash__brand">Nuzio<span>.ai</span></h2>
      <p className="splash__tag"><Rich text={t('splash.tag')} /></p>
      <p className="splash__foot">{t('splash.foot')}</p>
    </div>
  );
}