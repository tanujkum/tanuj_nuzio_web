// Chhota, dependency-free line-icon set (24x24, currentColor stroke) — Lucide jaisa look,
// lekin hand-drawn taaki koi external icon package na chahiye.
const PATHS = {
  // ---- brand / nav ----
  logo: 'M4 15V9 M9 18V6 M14 20V4 M19 15V9',
  home: 'M4 11.5 12 4l8 7.5 M6 10v9h5v-5h2v5h5v-9',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M15 9l-2 6-4 2 2-6 4-2Z',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z M12 3v2.4 M12 18.6V21 M4.9 4.9l1.7 1.7 M17.4 17.4l1.7 1.7 M3 12h2.4 M18.6 12H21 M4.9 19.1l1.7-1.7 M17.4 6.6l1.7-1.7',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M21 21l-4.3-4.3',
  bell: 'M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10Z M10 19a2 2 0 0 0 4 0',

  // ---- misc / controls ----
  chevronLeft: 'M15 5l-7 7 7 7',
  chevronRight: 'M9 5l7 7-7 7',
  x: 'M6 6l12 12 M18 6 6 18',
  check: 'M5 13l4 4 10-10',
  play: 'M8 5.5 18 12 8 18.5Z',
  pause: 'M8 5h3v14H8Z M13 5h3v14h-3Z',
  skipBack: 'M18 6v12 M18 12 7 6v12Z',
  skipForward: 'M6 6v12 M6 12l11-6v12Z',
  location: 'M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21Z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',

  // ---- profession icons ----
  trendingUp: 'M3 16l6-6 4 4 8-9 M13 5h8v8',
  scale: 'M12 3v18 M6 21h12 M12 6 5 9l3.5 6.5a3.6 3.6 0 0 0 7 0L19 9Z',
  laptop: 'M4 5h16v10H4Z M2 19h20',
  stethoscope: 'M6 4v6a4 4 0 0 0 8 0V4 M14 10v3a5 5 0 0 0 10 0v-2 M19 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M6 4h2 M10 4h2 M6 17a3 3 0 1 0 0 .01Z',
  briefcase: 'M3 8h18v11H3Z M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M3 13h18',
  megaphone: 'M3 10v4h4l9 5V5l-9 5Z M17 9a4 4 0 0 1 0 6',
  landmark: 'M4 21h16 M5 21V10 M9 21V10 M15 21V10 M19 21V10 M3 10l9-6 9 6Z',
  building: 'M6 21V4h12v17 M9 8h2 M13 8h2 M9 12h2 M13 12h2 M9 21v-4h2v4 M13 21v-4h2v4',
  gradCap: 'M2 8l10-5 10 5-10 5Z M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5 M22 8v6',
  rocket: 'M12 2c3 1 5 5 5 9 0 3-2 6-5 9-3-3-5-6-5-9 0-4 2-8 5-9Z M9 15l-3 4 M15 15l3 4 M12 8a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Z',

  // ---- topic icons ----
  cpu: 'M8 8h8v8H8Z M2 9h3 M2 15h3 M19 9h3 M19 15h3 M9 2v3 M15 2v3 M9 19v3 M15 19v3',
  barChart: 'M4 20V10 M11 20V4 M18 20v-7 M2 20h20',
  flagIndia: 'M5 3v18 M5 4h14l-3 4 3 4H5',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M3.5 9h17 M3.5 15h17 M12 3c2.4 2.6 3.6 5.8 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.8-3.6-9S9.6 5.6 12 3Z',
  flask: 'M9 3h6 M10 3v6l-5.5 9a1.6 1.6 0 0 0 1.4 2.4h12.2a1.6 1.6 0 0 0 1.4-2.4L14 9V3 M7.5 15h9',
  heartPulse: 'M12 20s-7-4.5-9.3-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.3 5c-2.3 4.5-9.3 9-9.3 9Z M5 12h3l2-3 2 5 2-3h3',
  crosshair: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 2v3 M12 19v3 M2 12h3 M19 12h3',
  leaf: 'M20 4c0 9-6 15-15 15H4v-1C4 10 10 4 19 4Z M4 20 12 12',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0Z M5 5H4a2 2 0 0 0 0 4h1 M19 5h1a2 2 0 0 1 0 4h-1 M10 15h4v3h-4Z M8 21h8',
  palette: 'M12 21a9 9 0 1 1 0-18 8 8 0 0 1 8 8c0 2-1.5 3-3 3h-1.3a1.7 1.7 0 0 0-1 3.1c.4.4.6.9.6 1.4 0 1.4-1.5 2.5-3.3 2.5Z M7.5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M9.5 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M14.5 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  scroll: 'M6 4h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z M6 4a2 2 0 0 0-2 2v1h4 M9 9h6 M9 13h6',

  // ---- settings row icons ----
  moon: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z M12 2v2 M12 20v2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M2 12h2 M20 12h2 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4',
  download: 'M12 3v13 M7 11l5 5 5-5 M4 20h16',
  fastForward: 'M4 6v12l8-6Z M12 6v12l8-6Z',
  creditCard: 'M3 6h18v12H3Z M3 10h18 M7 15h4',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z M6 11a6 6 0 0 0 12 0 M12 17v4 M9 21h6',
  chevronDown: 'M6 9l6 6 6-6',
  zap: 'M13 3 5 13h5l-1 8 8-10h-5Z',
};

export default function Icon({ name, size = 18, strokeWidth = 1.8, className = '', ...rest }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
      aria-hidden="true"
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}
