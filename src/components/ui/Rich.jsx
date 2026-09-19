export default function Rich({ text }) {
  return text.split('*').map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part));
}