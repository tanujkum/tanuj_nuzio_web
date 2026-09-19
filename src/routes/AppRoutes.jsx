import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout/AppLayout';

import Splash from '../pages/onboarding/Splash/Splash';
import Language from '../pages/onboarding/Language/Language';
import Login from '../pages/onboarding/Login/Login';
import Profession from '../pages/onboarding/Profession/Profession';
import Topics from '../pages/onboarding/Topics/Topics';
import VoiceLength from '../pages/onboarding/VoiceLength/VoiceLength';
import DeliveryTime from '../pages/onboarding/DeliveryTime/DeliveryTime';
import Notifications from '../pages/onboarding/Notifications/Notifications';
import Ready from '../pages/onboarding/Ready/Ready';
import Home from '../pages/Home/Home';
import Discover from '../pages/Discover/Discover';
import Settings from '../pages/Settings/Settings';
import Billing from '../pages/Billing/Billing';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding/language" element={<Language />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding/profession" element={<Profession />} />
        <Route path="/onboarding/topics" element={<Topics />} />
        <Route path="/onboarding/voice" element={<VoiceLength />} />
        <Route path="/onboarding/time" element={<DeliveryTime />} />
        <Route path="/onboarding/notifications" element={<Notifications />} />
        <Route path="/onboarding/ready" element={<Ready />} />

        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/billing" element={<Billing />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}