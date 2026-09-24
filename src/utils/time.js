export const toMin = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export const toStr = (min) => {
  const n = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
};

export const period = (t) => (Number(t.split(':')[0]) >= 12 ? 'PM' : 'AM');

export const fmt12 = (t) => {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')}`;
};

export const fmtDuration = (sec = 0) =>
  `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

export const greeting = () => {
  const h = new Date().getHours();
  // translation key return karta hai: t(greeting())
  if (h < 12) return 'greet.morning';
  if (h < 17) return 'greet.afternoon';
  return 'greet.evening';
};