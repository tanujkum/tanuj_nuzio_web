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
import './Settings.css';

const Row = ({ title, sub, children }) => (
  <div className="set__row">
    <div><strong>{title}</strong>{sub && <small>{sub}</small>}</div>
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
      dispatch(showToast({ type: 'error', message: typeof msg === 'string' ? msg : 'Could not save' }));
    }
  };

  if (!user) return null;

  return (
    <div className="set">
      <p className="set__kicker">ACCOUNT</p>
      <h1 className="set__title">Your <em>settings</em></h1>

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
          <div>
            <strong>Plan &amp; billing</strong>
            <small>{currentPlan ? `${currentPlan.name} plan · manage or upgrade` : 'Manage your plan'}</small>
          </div>
          <span className="set__arrow">›</span>
        </button>
      </div>

      <p className="set__label">APPEARANCE</p>
      <div className="set__card">
        <Row title="Theme">
          <Seg
            value={pref.theme || 'dark'}
            onChange={(v) => save({ theme: v })}
            options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]}
          />
        </Row>
        <Row title="Language">
          <Seg
            value={user.language}
            onChange={(v) => save({ language: v }, 'Language updated')}
            options={[{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिन्दी' }]}
          />
        </Row>
      </div>

      <p className="set__label">PLAYBACK</p>
      <div className="set__card">
        <Row title="Offline mode" sub="Download your brief in advance">
          <Toggle checked={!!pref.offlineMode} onChange={(v) => save({ offlineMode: v })} />
        </Row>
        <Row title="Auto-advance" sub="Play the next story automatically">
          <Toggle checked={pref.autoAdvance ?? true} onChange={(v) => save({ autoAdvance: v })} />
        </Row>
      </div>

      <p className="set__label">NOTIFICATIONS</p>
      <div className="set__card">
        <Row title="Morning brief ready">
          <Toggle checked={pref.notifyBriefReady ?? true} onChange={(v) => save({ notifyBriefReady: v })} />
        </Row>
        <Row title="Breaking story">
          <Toggle checked={pref.notifyBreaking ?? true} onChange={(v) => save({ notifyBreaking: v })} />
        </Row>
        <Row title="Weekly digest">
          <Toggle checked={pref.notifyWeekly ?? true} onChange={(v) => save({ notifyWeekly: v })} />
        </Row>
      </div>

      <p className="set__label">YOUR BRIEF</p>
      <form
        className="set__card set__form"
        onSubmit={handleSubmit((values) => save(values, 'Brief preferences saved'))}
        noValidate
      >
        <div className="field">
          <label htmlFor="voiceId">Narrator voice</label>
          <select id="voiceId" {...register('voiceId')}>
            <option value="">Select voice</option>
            {voices.map((v) => <option key={v.id} value={v.id}>{v.name} · {v.description}</option>)}
          </select>
          {errors.voiceId && <p className="form-error">{errors.voiceId.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="briefMinutes">Brief length (minutes)</label>
          <input id="briefMinutes" type="number" min="3" max="30" {...register('briefMinutes')} />
          {errors.briefMinutes && <p className="form-error">{errors.briefMinutes.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="deliveryTime">Delivery time</label>
          <input id="deliveryTime" type="time" {...register('deliveryTime')} />
          {errors.deliveryTime && <p className="form-error">{errors.deliveryTime.message}</p>}
        </div>

        <Button type="submit" loading={isSubmitting}>Save changes</Button>
      </form>

      <div className="set__logout">
        <Button variant="ghost" onClick={() => dispatch(logout())}>Log out</Button>
      </div>
    </div>
  );
}