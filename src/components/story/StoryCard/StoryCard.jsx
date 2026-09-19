import { fmtDuration } from '../../../utils/time';
import './StoryCard.css';

export default function StoryCard({ story, active = false, playing = false, onPlay, onSave }) {
  return (
    <article className={`story ${active ? 'story--active' : ''}`}>
      <div className="story__meta">
        <span className="story__tag">{story.topic?.name || 'News'}</span>
        <span className="story__src">{story.source} · {fmtDuration(story.durationSec)}</span>
      </div>
      <h3 className="story__title">{story.title}</h3>
      <p className="story__summary">{story.summary}</p>
      <div className="story__actions">
        <button type="button" className={`story__save ${story.isSaved ? 'story__save--on' : ''}`} onClick={onSave}>
          {story.isSaved ? '★ Saved' : '☆ Save'}
        </button>
        <button type="button" className="story__play" onClick={onPlay} aria-label="Play">
          {playing ? '❚❚' : '▶'}
        </button>
      </div>
    </article>
  );
}