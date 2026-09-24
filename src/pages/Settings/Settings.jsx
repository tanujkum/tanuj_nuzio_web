import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { logout } from '../../features/auth/authSlice';
import { fetchMe } from '../../features/auth/authThunks';
import { updateSettings } from '../../features/settings/settingsThunks';
import { fetchCurrentPlan } from '../../features/billing/billingThunks';
import { showToast } from '../../features/toast/toastSlice';
import { briefPrefsSchema } from '../../validation/settings.schema';
import useMeta from '../../hooks/useMeta';
import Toggle from '../../components/ui/Toggle/Toggle';
import Button from '../../components/ui/Button/Button';
import Rich from '../../components/ui/Rich';
import useT from '../../hooks/useT';
import { translations } from '../../i18n/translations';
import Icon from '../../components/ui/Icon/Icon';
import './Settings.css';

const Row = ({ title, sub, icon, color = 'slate', children }) => (
  <div className="set__row">
    <div className="set__row-main">
      {icon && <span className={`swatch swatch--${color} swatch--sm`}><Icon name={icon} size={15} /></span>}
      <div><strong>{title}</strong>{sub && <small>{sub}</small>}</div>
    </div>
    {children}
  </div>
);

const Seg = ({ options, value, onChange }) => (
  <div className="set__seg">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        className={`set__segbtn ${value === o.value ? 'set__segbtn--active' : ''}`}
        onClick={() => onChange(o.value)}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const currentPlan = useSelector((s) => s.billing.current?.plan);
  const { voices } = useMeta();
  const { t } = useT();
  const pref = user?.preference || {};

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(briefPrefsSchema),
    values: {
      voiceId: pref.voiceId ?? '',
      briefMinutes: pref.briefMinutes ?? 5,
      deliveryTime: pref.deliveryTime ?? '07:00',
    },
  });

  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchCurrentPlan());
  }, [dispatch]);

  const save = async (patch, message) => {
    try {
      await dispatch(updateSettings(patch)).unwrap();
      if (message) dispatch(showToast({ type: 'success', message }));
    } catch (msg) {
      dispatch(showToast({ type: 'error', message: typeof msg === 'string' ? msg : t('set.saveFail') }));
    }
  };

  if (!user) return null;

  return (
    <div className="set">
      <div className="topbar">
        <span className="topbar__brand">
          <span className="topbar__brand-mark"><Icon name="logo" size={12} /></span>
          Nuzio
        </span>
        <div className="topbar__actions">
          <button type="button" className="topbar__icon topbar__icon--dot" aria-label="notifications">
            <Icon name="bell" size={16} />
          </button>
        </div>
      </div>

      <p className="set__kicker">{t('set.kicker')}</p>
      <h1 className="set__title"><Rich text={t('set.title')} /></h1>

      <div className="set__profile">
        <span className="set__avatar">
          {user.avatar
            ? <img src={user.avatar} alt="" referrerPolicy="no-referrer" />
            : user.name?.[0]?.toUpperCase()}
        </span>
        <div>
          <strong>{user.name}</strong>
          <small>{user.email}</small>
        </div>
      </div>

      <div className="set__card">
        <button type="button" className="set__row set__row--btn" onClick={() => navigate('/billing')}>
          <div className="set__row-main">
            <span className="swatch swatch--emerald swatch--sm"><Icon name="creditCard" size={15} /></span>
            <div>
              <strong>{t('set.plan')}</strong>
              <small>{currentPlan ? t('set.planSub', { plan: currentPlan.name }) : t('set.planManage')}</small>
            </div>
          </div>
          <Icon name="chevronRight" size={16} className="set__arrow" />
        </button>
      </div>

      <p className="set__label">{t('set.appearance')}</p>
      <div className="set__card">
        <Row title={t('set.theme')} icon="moon" color="violet">
          <Seg
            value={pref.theme || 'dark'}
            onChange={(v) => save({ theme: v })}
            options={[{ value: 'dark', label: t('set.dark') }, { value: 'light', label: t('set.light') }]}
          />
        </Row>
        <Row title={t('set.language')} icon="globe" color="blue">
          <Seg
            value={user.language}
            onChange={(v) => save({ language: v }, translations[v]['set.langSaved'])}
            options={[{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिन्दी' }]}
          />
        </Row>
      </div>

      <p className="set__label">{t('set.playback')}</p>
      <div className="set__card">
        <Row title={t('set.offline')} sub={t('set.offlineSub')} icon="download" color="teal">
          <Toggle checked={!!pref.offlineMode} onChange={(v) => save({ offlineMode: v })} />
        </Row>
        <Row title={t('set.auto')} sub={t('set.autoSub')} icon="fastForward" color="amber">
          <Toggle checked={pref.autoAdvance ?? true} onChange={(v) => save({ autoAdvance: v })} />
        </Row>
      </div>

      <p className="set__label">{t('set.notifs')}</p>
      <div className="set__card">
        <Row title={t('notif.briefReady')} icon="bell" color="rose">
          <Toggle checked={pref.notifyBriefReady ?? true} onChange={(v) => save({ notifyBriefReady: v })} />
        </Row>
        <Row title={t('notif.breaking')} icon="zap" color="orange">
          <Toggle checked={pref.notifyBreaking ?? true} onChange={(v) => save({ notifyBreaking: v })} />
        </Row>
        <Row title={t('notif.weekly')} icon="scroll" color="indigo">
          <Toggle checked={pref.notifyWeekly ?? true} onChange={(v) => save({ notifyWeekly: v })} />
        </Row>
      </div>

      <p className="set__label">{t('set.yourBrief')}</p>
      <form
        className="set__card set__form"
        onSubmit={handleSubmit((values) => save(values, t('set.saved')))}
        noValidate
      >
        <div className="field">
          <label htmlFor="voiceId">{t('set.voice')}</label>
          <select id="voiceId" {...register('voiceId')}>
            <option value="">{t('set.selectVoice')}</option>
            {voices.map((v) => <option key={v.id} value={v.id}>{v.name} · {v.description}</option>)}
          </select>
          {errors.voiceId && <p className="form-error">{errors.voiceId.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="briefMinutes">{t('set.length')}</label>
          <input id="briefMinutes" type="number" min="3" max="30" {...register('briefMinutes')} />
          {errors.briefMinutes && <p className="form-error">{errors.briefMinutes.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="deliveryTime">{t('set.time')}</label>
          <input id="deliveryTime" type="time" {...register('deliveryTime')} />
          {errors.deliveryTime && <p className="form-error">{errors.deliveryTime.message}</p>}
        </div>

        <Button type="submit" variant="accent" loading={isSubmitting}>{t('set.save')}</Button>
      </form>

      <div className="set__logout">
        <Button variant="ghost" onClick={() => dispatch(logout())}>{t('set.logout')}</Button>
      </div>
    </div>
  );
}