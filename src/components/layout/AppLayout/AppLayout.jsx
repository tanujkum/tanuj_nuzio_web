import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PlayerEngine from '../../player/PlayerEngine';
import MiniPlayer from '../MiniPlayer/MiniPlayer';
import BottomNav from '../BottomNav/BottomNav';
import './AppLayout.css';

export default function AppLayout() {
  const user = useSelector((s) => s.auth.user);
  if (!user?.onboardingCompleted) return <Navigate to="/onboarding/profession" replace />;

  return (
    <div className="app">
      <main className="app__main"><Outlet /></main>
      <PlayerEngine />
      <MiniPlayer />
      <BottomNav />
    </div>
  );
}