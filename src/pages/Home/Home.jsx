import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBrief, toggleSave } from '../../features/stories/storiesThunks';
import { playQueue, togglePlay, next, prev } from '../../features/player/playerSlice';
import { greeting } from '../../utils/time';
import Waveform from '../../components/player/Waveform/Waveform';
import StoryCard from '../../components/story/StoryCard/StoryCard';
import './Home.css';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, status, error } = useSelector((s) => s.stories.brief);
  const player = useSelector((s) => s.player);

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

  const startFrom = (i) =>
    dispatch(playQueue({ queue: stories, index: i, voiceName: data.voice?.name, autoAdvance: data.autoAdvance }));
  const onMain = () => (isBrief ? dispatch(togglePlay()) : startFrom(0));
  const onCardPlay = (i) => (isBrief && player.index === i ? dispatch(togglePlay()) : startFrom(i));

  return (
    <div className="home">
      <header className="home__top">
        <span className="home__logo">◉ Nuzio<span>.ai</span></span>
        <button type="button" className="home__icon" onClick={() => navigate('/discover')} aria-label="Search">⌕</button>
      </header>

      <p className="home__kicker">
        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
      </p>

      {status === 'loading' && !data && <p className="home__state">Loading your brief…</p>}
      {status === 'failed' && (
        <div>
          <p className="form-error">{error}</p>
          <button type="button" className="home__retry" onClick={() => dispatch(fetchBrief())}>Retry</button>
        </div>
      )}

      {data && (
        <>
          <h1 className="home__title">
            {greeting()}, <em>{data.firstName}</em> — {stories.length} things.
          </h1>
          <p className="home__meta">
            {data.voice?.name || 'Aria'} · {stories.length} stories · ~{mins} min
          </p>

          {active ? (
            <section className="player">
              <span className="player__tag">{active.topic?.name}</span>
              <h2 className="player__title">{active.title}</h2>
              <p className="player__summary">{active.summary}</p>

              <Waveform progress={progress} playing={playing} />

              <div className="player__controls">
                <button type="button" onClick={() => dispatch(prev())} disabled={!isBrief}>⏮</button>
                <button type="button" className="player__play" onClick={onMain}>{playing ? '❚❚' : '▶'}</button>
                <button
                  type="button"
                  onClick={() => dispatch(next())}
                  disabled={!isBrief || player.index >= stories.length - 1}
                >⏭</button>
              </div>
              <p className="player__count">Story {activeIndex + 1} of {stories.length}</p>
            </section>
          ) : (
            <p className="home__state">No stories yet for your topics.</p>
          )}

          {stories.length > 0 && (
            <>
              <h3 className="home__section">Today's stories</h3>
              <div className="home__list">
                {stories.map((s, i) => (
                  <StoryCard
                    key={s.id}
                    story={s}
                    active={isBrief && player.index === i}
                    playing={isBrief && player.index === i && player.isPlaying}
                    onPlay={() => onCardPlay(i)}
                    onSave={() => dispatch(toggleSave({ id: s.id, save: !s.isSaved }))}
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