import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStories, toggleSave } from '../../features/stories/storiesThunks';
import { playQueue, togglePlay } from '../../features/player/playerSlice';
import { searchSchema } from '../../validation/search.schema';
import useMeta from '../../hooks/useMeta';
import useDebounce from '../../hooks/useDebounce';
import StoryCard from '../../components/story/StoryCard/StoryCard';
import './Discover.css';

export default function Discover() {
  const dispatch = useDispatch();
  const { topics } = useMeta();
  const { items, pagination, status, error } = useSelector((s) => s.stories.discover);
  const player = useSelector((s) => s.player);
  const voiceName = useSelector((s) => s.auth.user?.preference?.voice?.name);

  const [q, setQ] = useState('');
  const [topic, setTopic] = useState('all');
  const [searchError, setSearchError] = useState('');
  const debouncedQ = useDebounce(q, 400);

  // Search / topic badalte hi page 1 dobara lao (Yup se validate hone ke baad)
  useEffect(() => {
    searchSchema
      .validate({ q: debouncedQ })
      .then(() => {
        setSearchError('');
        dispatch(fetchStories({ q: debouncedQ.trim(), topic, page: 1 }));
      })
      .catch((e) => setSearchError(e.message));
  }, [debouncedQ, topic, dispatch]);

  const loadMore = () =>
    dispatch(fetchStories({ q: debouncedQ.trim(), topic, page: pagination.page + 1 }));

  const onPlay = (s) => {
    if (player.queue[player.index]?.id === s.id) dispatch(togglePlay());
    else dispatch(playQueue({ queue: [s], index: 0, voiceName, autoAdvance: false }));
  };

  return (
    <div className="disc">
      <p className="disc__kicker">EXPLORE</p>
      <h1 className="disc__title">Discover <em>the world</em></h1>

      <input
        className="disc__search"
        type="search"
        placeholder="Search stories, topics…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {searchError && <p className="form-error">{searchError}</p>}

      <div className="disc__tabs">
        <button type="button" className={`disc__tab ${topic === 'all' ? 'disc__tab--active' : ''}`} onClick={() => setTopic('all')}>
          All
        </button>
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`disc__tab ${topic === t.slug ? 'disc__tab--active' : ''}`}
            onClick={() => setTopic(t.slug)}
          >
            {t.name}
          </button>
        ))}
      </div>

      {status === 'loading' && <p className="disc__state">Loading…</p>}
      {status === 'failed' && <p className="form-error">{error}</p>}
      {status === 'done' && items.length === 0 && <p className="disc__state">No stories found.</p>}

      <div className="disc__list">
        {items.map((s) => {
          const isCurrent = player.queue[player.index]?.id === s.id;
          return (
            <StoryCard
              key={s.id}
              story={s}
              active={isCurrent}
              playing={isCurrent && player.isPlaying}
              onPlay={() => onPlay(s)}
              onSave={() => dispatch(toggleSave({ id: s.id, save: !s.isSaved }))}
            />
          );
        })}
      </div>

      {pagination && pagination.page < pagination.totalPages && (
        <button type="button" className="disc__more" onClick={loadMore} disabled={status === 'loadingMore'}>
          {status === 'loadingMore' ? 'Loading…' : 'Load more'}
        </button>
      )}
    </div>
  );
}