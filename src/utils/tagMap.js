// Slug -> icon + accent color, taaki chips/badges/avatars ka rang aur icon consistent rahe
// (backend sirf emoji bhejta hai jo hum ab UI mein use nahi karte).

export const PROFESSION_TAGS = {
  'finance-trading': { icon: 'trendingUp', color: 'emerald' },
  legal: { icon: 'scale', color: 'indigo' },
  technology: { icon: 'laptop', color: 'violet' },
  healthcare: { icon: 'stethoscope', color: 'rose' },
  consulting: { icon: 'briefcase', color: 'amber' },
  'marketing-media': { icon: 'megaphone', color: 'pink' },
  'government-policy': { icon: 'landmark', color: 'slate' },
  'real-estate': { icon: 'building', color: 'orange' },
  education: { icon: 'gradCap', color: 'sky' },
  'founder-builder': { icon: 'rocket', color: 'teal' },
};

export const TOPIC_TAGS = {
  'ai-technology': { icon: 'cpu', color: 'indigo' },
  'financial-markets': { icon: 'barChart', color: 'teal' },
  'indian-business': { icon: 'flagIndia', color: 'orange' },
  'global-politics': { icon: 'globe', color: 'blue' },
  startups: { icon: 'rocket', color: 'violet' },
  science: { icon: 'flask', color: 'sky' },
  'health-medicine': { icon: 'heartPulse', color: 'rose' },
  geopolitics: { icon: 'crosshair', color: 'slate' },
  'climate-energy': { icon: 'leaf', color: 'lime' },
  sports: { icon: 'trophy', color: 'amber' },
  'culture-arts': { icon: 'palette', color: 'pink' },
  'legal-policy': { icon: 'scroll', color: 'indigo' },
};

const FALLBACK = { icon: 'compass', color: 'slate' };

export const professionTag = (slug) => PROFESSION_TAGS[slug] || FALLBACK;
export const topicTag = (slug) => TOPIC_TAGS[slug] || FALLBACK;

// Voice avatar rang (naam se, DB order badalne se bhi consistent rahe)
const VOICE_COLORS = { Aria: 'violet', Kai: 'sky', Meera: 'pink' };
export const voiceColor = (name) => VOICE_COLORS[name] || 'indigo';
