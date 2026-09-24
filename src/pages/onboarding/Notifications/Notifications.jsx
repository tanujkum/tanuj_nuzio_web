import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setNotification } from '../../../features/onboarding/onboardingSlice';
import { calcStories } from '../../../utils/constants';
import useMeta from '../../../hooks/useMeta';
import useT from '../../../hooks/useT';
import OnboardingLayout from '../../../components/layout/OnboardingLayout/OnboardingLayout';
import Button from '../../../components/ui/Button/Button';
import Toggle from '../../../components/ui/Toggle/Toggle';
import Rich from '../../../components/ui/Rich';
import Icon from '../../../components/ui/Icon/Icon';
import './Notifications.css';

const ITEMS = [
  { key: 'briefReady', icon: 'bell', color: 'emerald' },
  { key: 'breaking', icon: 'zap', color: 'violet' },
  { key: 'weekly', icon: 'barChart', color: 'blue' },
];
const ALL_OFF = { briefReady: false, breaking: false, weekly: false };

export default function Notifications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, tn } = useT();
  const { topics } = useMeta();
  const { notifications, topicIds, briefMinutes } = useSelector((s) => s.onboarding);

  // Preview mein user ki asli choice dikhao (pehle "4 stories · Tech, Markets" hardcoded tha)
  const picked = topics.filter((x) => topicIds.includes(x.id)).slice(0, 2).map((x) => tn('topic', x));
  const previewSub = picked.length
    ? t('notif.previewSubLive', { n: calcStories(briefMinutes), topics: picked.join(', '), m: briefMinutes })
    : t('notif.previewSub');

  const onAllow = async () => {
    try {
      if ('Notification' in window) {
        const result = await Notification.requestPermission();
        // Browser ne mana kar diya to toggles bhi off karo, warna settings "on" dikhati hain par aata kuch nahi
        if (result === 'denied') dispatch(setNotification(ALL_OFF));
      }
    } catch { /* browser permission fail ho to bhi aage badho */ }
    navigate('/onboarding/ready');
  };

  const onSkip = () => {
    dispatch(setNotification(ALL_OFF));
    navigate('/onboarding/ready');
  };

  return (
    <OnboardingLayout
      step={5}
      title={<Rich text={t('notif.title')} />}
      subtitle={t('notif.sub')}
      onBack={() => navigate('/onboarding/time')}
      footer={
        <div className="notif__footer">
          <Button onClick={onAllow}>{t('notif.allow')}</Button>
          <Button variant="text" onClick={onSkip}>{t('notif.skip')}</Button>
        </div>
      }
    >
      <div className="notif__preview">
        <span className="swatch swatch--violet notif__icon"><Icon name="mic" /></span>
        <div>
          <strong>{t('notif.previewTitle')}</strong>
          <small>{previewSub}</small>
        </div>
      </div>

      <p className="onb__kicker notif__label">{t('notif.label')}</p>
      <div className="notif__list">
        {ITEMS.map(({ key, icon, color }) => (
          <div key={key} className="notif__row">
            <span className={`swatch swatch--${color}`}><Icon name={icon} size={16} /></span>
            <div className="notif__row-text">
              <strong>{t(`notif.${key}`)}</strong>
              <small>{t(`notif.${key}Sub`)}</small>
            </div>
            <Toggle
              checked={notifications[key]}
              onChange={(v) => dispatch(setNotification({ [key]: v }))}
            />
          </div>
        ))}
      </div>
    </OnboardingLayout>
  );
}
