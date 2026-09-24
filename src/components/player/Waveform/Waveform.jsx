import './Waveform.css';

const BARS = Array.from({ length: 44 }, (_, i) =>
  Math.min(99, 20 + Math.abs(Math.sin(i * 1.7)) * 55 + ((i * 37) % 24))
);

export default function Waveform({ progress = 0, playing = false }) {
  return (
    <div className="wave-wrap">
      <div className={`wave ${playing ? 'wave--live' : ''}`}>
        {BARS.map((h, i) => (
          <span
            key={i}
            className={`wave__bar ${i / BARS.length < progress ? 'wave__bar--done' : ''}`}
            style={{ height: `${h}%`, animationDelay: `${(i % 8) * 0.08}s` }}
          />
        ))}
      </div>
      <div className="wave__track"><span className="wave__track-fill" style={{ width: `${progress * 100}%` }} /></div>
    </div>
  );
}