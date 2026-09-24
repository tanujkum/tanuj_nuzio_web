import { NavLink } from 'react-router-dom';
import useT from '../../../hooks/useT';
import Icon from '../../ui/Icon/Icon';
import './BottomNav.css';

const TABS = [
  { to: '/home', label: 'nav.home', icon: 'home' },
  { to: '/discover', label: 'nav.discover', icon: 'compass' },
  { to: '/settings', label: 'nav.settings', icon: 'settings' },
];

export default function BottomNav() {
  const { t } = useT();
  return (
    <nav className="bnav">
      {TABS.map((tab) => (
        <NavLink key={tab.to} to={tab.to} className={({ isActive }) => `bnav__item ${isActive ? 'bnav__item--active' : ''}`}>
          <span className="bnav__icon"><Icon name={tab.icon} size={20} /></span>
          <span>{t(tab.label)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
