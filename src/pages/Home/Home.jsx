import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBrief, toggleSave } from '../../features/stories/storiesThunks';
import { playQueue, togglePlay, next, prev } from '../../features/player/playerSlice';
import { greeting, fmtDuration } from '../../utils/time';
import { showToast } from '../../features/toast/toastSlice';
import { topicTag } from '../../utils/tagMap';
import useT from '../../hooks/useT';
import Waveform from '../../components/player/Waveform/Waveform';
import StoryCard from '../../components/story/StoryCard/StoryCard';
import Icon from '../../components/ui/Icon/Icon';
import './Home.css';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, status, error } = useSelector((s) => s.stories.brief);
  const player = useSelector((s) => s.player);
  const { t, tn, lang } = useT();

  useEffect(() => { dispatch(fetchBrief()); }, [dispatch]);

  const stories = data?.stories || [];
  const isBrief =
    stories.length > 0 &&
    player.queue.length === stories.length &&
    player.queue[0]?.id === stories[0]?.id;
  const activeIndex = isBrief ? player.index : 0;
  const active = stories[activeIndex];
  const playing = isBrief && player.isPlaying;
  const progress = isBrief ? player.progress : 0;
  const mins = Math.max(1, Math.round((data?.totalDurationSec || 0) / 60));
  const activeTag = active?.topic ? topicTag(active.topic.slug) : { color: 'slate' };

  const startFrom = (i) =>
    dispatch(playQueue({ queue: stories, index: i, voiceName: data.voice?.name, autoAdvance: data.autoAdvance }));
  const onMain = () => (isBrief ? dispatch(togglePlay()) : startFrom(0));
  const onCardPlay = (i) => (isBrief && player.index === i ? dispatch(togglePlay()) : startFrom(i));
  const onSave = (s) =>
    dispatch(toggleSave({ id: s.id, save: !s.isSaved }))
      .unwrap()
      .catch(() => dispatch(showToast({ type: 'error', message: t('story.saveFail') })));

  return (
    <div className="home">
      <div className="topbar">
        <span className="topbar__brand">
          <span className="topbar__brand-mark"><Icon name="logo" size={12} /></span>
          Nuzio
        </span>
        <div className="topbar__actions">
          <button type="button" className="topbar__icon" onClick={() => navigate('/discover')} aria-label={t('home.search')}>
            <Icon name="search" size={16} />
          </button>
          <button type="button" className="topbar__icon topbar__icon--dot" aria-label="notifications">
            <Icon name="bell" size={16} />
          </button>
        </div>
      </div>

      <p className="home__kicker">
        {new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
      </p>

      {status === 'loading' && !data && <p className="home__state">{t('home.loading')}</p>}
      {status === 'failed' && (
        <div>
          <p className="form-error">{error}</p>
          <button type="button" className="home__retry" onClick={() => dispatch(fetchBrief())}>{t('retry')}</button>
        </div>
      )}

      {data && (
        <>
          <h1 className="home__title">
            {t(greeting())}, <em>{data.firstName}</em> — {t('home.things', { n: stories.length })}
          </h1>
          <p className="home__meta">
            {t('home.meta', { voice: data.voice?.name || 'Aria', n: stories.length, m: mins })}
          </p>

          {active ? (
            <section className="player">
              <div className="player__tags">
                <span className={`badge badge--${activeTag.color}`}>{tn('topic', active.topic)}</span>
              </div>
              <h2 className="player__title">{active.title}</h2>
              <p className="player__summary">{active.summary}</p>

              <Waveform progress={progress} playing={playing} />
              <div className="player__time">
                <span>{fmtDuration(Math.round((active.durationSec || 0) * progress))}</span>
                <span>{fmtDuration(active.durationSec)}</span>
              </div>

              <div className="player__controls">
                <button type="button" onClick={() => dispatch(prev())} disabled={!isBrief} aria-label={t('home.prev')}>
                  <Icon name="skipBack" size={16} />
                </button>
                <button type="button" className="player__play" onClick={onMain} aria-label={t('home.play')}>
                  <Icon name={playing ? 'pause' : 'play'} size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(next())}
                  disabled={!isBrief || player.index >= stories.length - 1}
                  aria-label={t('home.next')}
                >
                  <Icon name="skipForward" size={16} />
                </button>
              </div>
              <p className="player__count">{t('home.storyOf', { i: activeIndex + 1, n: stories.length })}</p>
            </section>
          ) : (
            <p className="home__state">{t('home.empty')}</p>
          )}

          {stories.length > 0 && (
            <>
              <h3 className="home__section">{t('home.today')}</h3>
              <div className="home__list">
                {stories.map((s, i) => (
                  <StoryCard
                    key={s.id}
                    story={s}
                    active={isBrief && player.index === i}
                    playing={isBrief && player.index === i && player.isPlaying}
                    onPlay={() => onCardPlay(i)}
                    onSave={() => onSave(s)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
