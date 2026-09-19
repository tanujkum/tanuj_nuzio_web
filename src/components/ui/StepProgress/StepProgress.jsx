import './StepProgress.css';

export default function StepProgress({ step, total }) {
  return (
    <div className="steps">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`steps__bar ${i < step ? 'steps__bar--done' : ''}`} />
      ))}
    </div>
  );
}