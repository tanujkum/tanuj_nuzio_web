import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setNotification } from '../../../features/onboarding/onboardingSlice';
import OnboardingLayout from '../../../components/layout/OnboardingLayout/OnboardingLayout';
import Button from '../../../components/ui/Button/Button';
import Toggle from '../../../components/ui/Toggle/Toggle';
import './Notifications.css';

const ITEMS = [
  { key: 'briefReady', title: 'Morning brief ready', sub: 'When your daily brief is ready' },
  { key: 'breaking', title: 'Breaking story', sub: 'A major story in your topics' },
  { key: 'weekly', title: 'Weekly digest', sub: 'Your week in review, every Sunday' },
];

export default function Notifications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useSelector((s) => s.onboarding.notifications);

  const onAllow = async () => {
    try {
      if ('Notification' in window) await Notification.requestPermission();
    } catch { /* browser permission fail ho to bhi aage badho */ }
    navigate('/onboarding/ready');
  };

  const onSkip = () => {
    dispatch(setNotification({ briefReady: false, breaking: false, weekly: false }));
    navigate('/onboarding/ready');
  };

  return (
    <OnboardingLayout
      step={5}
      title={<>Stay in <em>the loop.</em></>}
      subtitle="Turn on notifications so you never miss your brief."
      onBack={() => navigate('/onboarding/time')}
      footer={
        <div className="notif__footer">
          <Button onClick={onAllow}>Allow notifications</Button>
          <Button variant="text" onClick={onSkip}>Not now</Button>
        </div>
      }
    >
      <div className="notif__preview">
        <span className="notif__icon">◉</span>
        <div>
          <strong>Your morning brief is ready</strong>
          <small>4 stories · Tech, Markets · Listen 5 min</small>
        </div>
      </div>

      <p className="onb__kicker notif__label">WHAT TO NOTIFY ME ABOUT</p>
      <div className="notif__list">
        {ITEMS.map((i) => (
          <div key={i.key} className="notif__row">
            <div>
              <strong>{i.title}</strong>
              <small>{i.sub}</small>
            </div>
            <Toggle
              checked={notifications[i.key]}
              onChange={(v) => dispatch(setNotification({ [i.key]: v }))}
            />
          </div>
        ))}
      </div>
    </OnboardingLayout>
  );
}