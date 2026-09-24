import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStories, toggleSave } from '../../features/stories/storiesThunks';
import { playQueue, togglePlay } from '../../features/player/playerSlice';
import { searchSchema } from '../../validation/search.schema';
import useMeta from '../../hooks/useMeta';
import useDebounce from '../../hooks/useDebounce';
import useT from '../../hooks/useT';
import Rich from '../../components/ui/Rich';
import { showToast } from '../../features/toast/toastSlice';
import StoryCard from '../../components/story/StoryCard/StoryCard';
import Icon from '../../components/ui/Icon/Icon';
import './Discover.css';

export default function Discover() {
  const dispatch = useDispatch();
  const { topics } = useMeta();
  const { t, tn } = useT();
  const { items, pagination, status, error } = useSelector((s) => s.stories.discover);
  const player = useSelector((s) => s.player);
  const voiceName = useSelector((s) => s.auth.user?.preference?.voice?.name);

  const [q, setQ] = useState('');
  const [selectedTopic, setTopic] = useState('all');
  const [searchError, setSearchError] = useState('');
  const debouncedQ = useDebounce(q, 400);

  // Search / topic badalte hi page 1 dobara lao (Yup se validate hone ke baad)
  useEffect(() => {
    searchSchema
      .validate({ q: debouncedQ })
      .then(() => {
        setSearchError('');
        dispatch(fetchStories({ q: debouncedQ.trim(), topic: selectedTopic, page: 1 }));
      })
      .catch((e) => setSearchError(e.message));
  }, [debouncedQ, selectedTopic, dispatch]);

  const loadMore = () =>
    dispatch(fetchStories({ q: debouncedQ.trim(), topic: selectedTopic, page: pagination.page + 1 }));

  const onPlay = (s) => {
    if (player.queue[player.index]?.id === s.id) dispatch(togglePlay());
    else dispatch(playQueue({ queue: [s], index: 0, voiceName, autoAdvance: false }));
  };

  const onSave = (s) =>
    dispatch(toggleSave({ id: s.id, save: !s.isSaved }))
      .unwrap()
      .catch(() => dispatch(showToast({ type: 'error', message: t('story.saveFail') })));

  return (
    <div className="disc">
      <div className="topbar">
        <span className="topbar__brand">
          <span className="topbar__brand-mark"><Icon name="logo" size={12} /></span>
          Nuzio
        </span>
        <div className="topbar__actions">
          <button type="button" className="topbar__icon" aria-label={t('home.search')}>
            <Icon name="search" size={16} />
          </button>
          <button type="button" className="topbar__icon topbar__icon--dot" aria-label="notifications">
            <Icon name="bell" size={16} />
          </button>
        </div>
      </div>

      <p className="disc__kicker">{t('disc.kicker')}</p>
      <h1 className="disc__title"><Rich text={t('disc.title')} /></h1>

      <div className="disc__searchbar">
        <Icon name="search" size={15} className="disc__search-icon" />
        <input
          className="disc__search"
          type="search"
          placeholder={t('disc.search')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {searchError && <p className="form-error">{searchError}</p>}

      <div className="disc__tabs">
        <button type="button" className={`disc__tab ${selectedTopic === 'all' ? 'disc__tab--active' : ''}`} onClick={() => setTopic('all')}>
          {t('disc.all')}
        </button>
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            className={`disc__tab ${selectedTopic === topic.slug ? 'disc__tab--active' : ''}`}
            onClick={() => setTopic(topic.slug)}
          >
            {tn('topic', topic)}
          </button>
        ))}
      </div>

      {status === 'loading' && <p className="disc__state">{t('loading')}</p>}
      {status === 'failed' && <p className="form-error">{error}</p>}
      {status === 'done' && items.length === 0 && <p className="disc__state">{t('disc.empty')}</p>}

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
              onSave={() => onSave(s)}
            />
          );
        })}
      </div>

      {pagination && pagination.page < pagination.totalPages && (
        <button type="button" className="disc__more" onClick={loadMore} disabled={status === 'loadingMore'}>
          {status === 'loadingMore' ? t('loading') : t('disc.more')}
        </button>
      )}
    </div>
  );
}