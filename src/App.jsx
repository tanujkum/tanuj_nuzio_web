import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import MobileShell from './components/layout/MobileShell/MobileShell';
import ToastContainer from './components/ui/Toast/ToastContainer';
import useT from './hooks/useT';

export default function App() {
  const theme = useSelector((s) => s.auth.user?.preference?.theme) || 'dark';
  const { lang } = useT();

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  return (
    <MobileShell>
      <AppRoutes />
      <ToastContainer />
    </MobileShell>
  );
}