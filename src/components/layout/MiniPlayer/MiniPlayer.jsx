import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { togglePlay, stopPlayer } from '../../../features/player/playerSlice';
import useT from '../../../hooks/useT';
import Icon from '../../ui/Icon/Icon';
import './MiniPlayer.css';

export default function MiniPlayer() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { t } = useT();
  const { queue, index, isPlaying, progress } = useSelector((s) => s.player);
  const story = queue[index];

  if (!story || pathname === '/home') return null;

  return (
    <div className="mini">
      <button type="button" className="mini__btn mini__btn--play" onClick={() => dispatch(togglePlay())}>
        <Icon name={isPlaying ? 'pause' : 'play'} size={14} />
      </button>
      <span className="mini__title">{story.title}</span>
      <button type="button" className="mini__btn" onClick={() => dispatch(stopPlayer())} aria-label={t('mini.close')}>
        <Icon name="x" size={13} />
      </button>
      <span className="mini__bar" style={{ width: `${progress * 100}%` }} />
    </div>
  );
}
