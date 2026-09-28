import React from 'react';
import { DebateProvider, useDebate } from './context/DebateContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/modals/AuthModal';
import { CreateTopicModal } from './components/modals/CreateTopicModal';
import { InfoModal } from './components/modals/InfoModal';

import { LandingPage } from './views/LandingPage';
import { Dashboard } from './views/Dashboard';
import { StartDebatePage } from './views/StartDebatePage';
import { DebateArena } from './views/DebateArena';
import { DebateAnalysis } from './views/DebateAnalysis';
import { ExploreTopics } from './views/ExploreTopics';
import { DebateHistory } from './views/DebateHistory';
import { PerformancePage } from './views/PerformancePage';
import { ProfilePage } from './views/ProfilePage';
import { SettingsPage } from './views/SettingsPage';

const AppContent: React.FC = () => {
  const { currentView } = useDebate();

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'start':
        return <StartDebatePage />;
      case 'arena':
        return <DebateArena />;
      case 'analysis':
        return <DebateAnalysis />;
      case 'topics':
        return <ExploreTopics />;
      case 'history':
        return <DebateHistory />;
      case 'performance':
        return <PerformancePage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <LandingPage />;
    }
  };

  const isArenaActive = currentView === 'arena';

  return (
    <div className="min-h-screen flex flex-col bg-[#05070e] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navbar />

      {/* Main View Display */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Footer (Hidden inside active arena match to optimize focus) */}
      {!isArenaActive && <Footer />}

      {/* Responsive Mobile Bottom Navigation */}
      {!isArenaActive && <MobileBottomNav />}

      {/* Floating Modals and Notifications */}
      <AuthModal />
      <CreateTopicModal />
      <InfoModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <DebateProvider>
      <AppContent />
    </DebateProvider>
  );
}
