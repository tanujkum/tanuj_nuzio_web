import { fmtDuration } from '../../../utils/time';
import { topicTag } from '../../../utils/tagMap';
import useT from '../../../hooks/useT';
import Icon from '../../ui/Icon/Icon';
import './StoryCard.css';

export default function StoryCard({ story, active = false, playing = false, onPlay, onSave }) {
  const { t, tn } = useT();
  const tag = story.topic ? topicTag(story.topic.slug) : { color: 'slate' };
  return (
    <article className={`story ${active ? 'story--active' : ''}`}>
      <div className="story__meta">
        <span className={`badge badge--${tag.color}`}>{story.topic ? tn('topic', story.topic) : t('news')}</span>
        <span className="story__src">{story.source} · {fmtDuration(story.durationSec)}</span>
      </div>
      <h3 className="story__title">{story.title}</h3>
      <p className="story__summary">{story.summary}</p>
      <div className="story__actions">
        <button type="button" className={`story__save ${story.isSaved ? 'story__save--on' : ''}`} onClick={onSave}>
          {story.isSaved ? t('story.saved') : t('story.save')}
        </button>
        <button type="button" className="story__play" onClick={onPlay} aria-label={t('home.play')}>
          <Icon name={playing ? 'pause' : 'play'} size={13} />
        </button>
      </div>
    </article>
  );
}
