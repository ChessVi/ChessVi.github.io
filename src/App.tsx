import { useState } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';

// Simple hash-based routing without react-router (to avoid extra dependency)
// Actually, let's use a simple state-based approach instead

function App() {
  const [view, setView] = useState<{ page: 'landing' } | { page: 'dashboard'; username: string; timeControl: 'blitz' | 'rapid' | 'both' }>({
    page: 'landing',
  });

  const handleAnalyze = (username: string, timeControl: 'blitz' | 'rapid' | 'both') => {
    setView({ page: 'dashboard', username, timeControl });
  };

  const handleBack = () => {
    setView({ page: 'landing' });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {view.page === 'landing' ? (
        <Landing onAnalyze={handleAnalyze} />
      ) : (
        <Dashboard
          username={view.username}
          timeControl={view.timeControl}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;
