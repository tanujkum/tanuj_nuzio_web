import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveOnboarding } from '../../../features/onboarding/onboardingThunks';
import { resetOnboarding } from '../../../features/onboarding/onboardingSlice';
import { fullOnboardingSchema } from '../../../validation/onboarding.schema';
import { calcStories } from '../../../utils/constants';
import { fmt12, period } from '../../../utils/time';
import useMeta from '../../../hooks/useMeta';
import Button from '../../../components/ui/Button/Button';
import Icon from '../../../components/ui/Icon/Icon';
import useT from '../../../hooks/useT';
import { professionTag, topicTag } from '../../../utils/tagMap';
import './Ready.css';

export default function Ready() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { professions, topics, voices } = useMeta();
  const onb = useSelector((s) => s.onboarding);
  const user = useSelector((s) => s.auth.user);

  const { t, tn } = useT();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const professionObj = professions.find((p) => p.id === onb.professionId);
  const profession = tn('profession', professionObj) || '-';
  const chosenTopics = topics.filter((x) => onb.topicIds.includes(x.id));
  const topicNames = chosenTopics.map((x) => tn('topic', x));
  const voice = voices.find((v) => v.id === onb.voiceId)?.name || '-';
  const firstName = user?.name?.split(' ')[0] || 'there';
  const profTag = professionObj ? professionTag(professionObj.slug) : { icon: 'compass', color: 'slate' };
  const topicIcon = chosenTopics[0] ? topicTag(chosenTopics[0].slug) : { icon: 'compass', color: 'slate' };

  const rows = [
    { k: t('ready.profession'), v: profession, icon: profTag.icon, color: profTag.color },
    {
      k: t('ready.topics'),
      v: topicNames.length > 2 ? `${topicNames.slice(0, 2).join(', ')} +${topicNames.length - 2}` : topicNames.join(', ') || '-',
      icon: topicIcon.icon,
      color: topicIcon.color,
    },
    { k: t('ready.voice'), v: voice, icon: 'mic', color: 'violet' },
    { k: t('ready.length'), v: t('ready.lengthVal', { stories: calcStories(onb.briefMinutes), n: onb.briefMinutes }), icon: 'barChart', color: 'teal' },
    { k: t('ready.delivery'), v: t('ready.deliveryVal', { time: `${fmt12(onb.deliveryTime)} ${period(onb.deliveryTime)}` }), icon: 'bell', color: 'amber' },
  ];

  const onStart = async () => {
    setError('');
    try {
      await fullOnboardingSchema.validate(onb, { abortEarly: true });
    } catch (e) {
      return setError(t('ready.incomplete', { msg: e.message }));
    }

    setLoading(true);
    try {
      await dispatch(saveOnboarding()).unwrap();
      navigate('/home', { replace: true });
      dispatch(resetOnboarding());
    } catch (msg) {
      setError(typeof msg === 'string' ? msg : t('ready.saveFail'));
      setLoading(false);
    }
  };

  return (
    <div className="ready">
      <div className="ready__top">
        <div className="ready__check"><Icon name="check" size={28} strokeWidth={2.4} /></div>
        <p className="onb__kicker">{t('ready.kicker')}</p>
        <h1 className="ready__title">
          {t('ready.title', { name: '' }).split('*')[0]}
          <em className="ready__name">{firstName}.</em>
        </h1>
        <p className="ready__sub">{t('ready.sub')}</p>
      </div>

      <div className="ready__list">
        {rows.map((row) => (
          <div key={row.k} className="ready__row">
            <span className={`swatch swatch--${row.color}`}><Icon name={row.icon} size={16} /></span>
            <div className="ready__row-text">
              <span>{row.k}</span>
              <strong>{row.v}</strong>
            </div>
            <em><Icon name="check" size={13} strokeWidth={2.6} /></em>
          </div>
        ))}
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="ready__footer">
        <Button variant="accent" loading={loading} onClick={onStart}>{t('ready.start')}</Button>
      </div>
    </div>
  );
}