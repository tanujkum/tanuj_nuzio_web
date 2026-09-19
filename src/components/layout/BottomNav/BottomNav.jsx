import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const TABS = [
  { to: '/home', label: 'Home', icon: '⌂' },
  { to: '/discover', label: 'Discover', icon: '◎' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export default function BottomNav() {
  return (
    <nav className="bnav">
      {TABS.map((t) => (
        <NavLink key={t.to} to={t.to} className={({ isActive }) => `bnav__item ${isActive ? 'bnav__item--active' : ''}`}>
          <span className="bnav__icon">{t.icon}</span>
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}