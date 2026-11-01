import { useState } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import type { TimeControl } from './types';
import type { ChessViBackup } from './hooks/useChesscom';

type ViewState =
  | { page: 'landing' }
  | {
      page: 'dashboard';
      username: string;
      timeControl: TimeControl;
      importedData?: ChessViBackup;
    };

function App() {
  const [view, setView] = useState<ViewState>({
    page: 'landing',
  });

  const handleAnalyze = (username: string, timeControl: TimeControl) => {
    setView({ page: 'dashboard', username, timeControl });
  };

  const handleImportBackup = (backup: ChessViBackup) => {
    setView({
      page: 'dashboard',
      username: backup.username,
      timeControl: backup.timeControl || 'both',
      importedData: backup,
    });
  };

  const handleBack = () => {
    setView({ page: 'landing' });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {view.page === 'landing' ? (
        <Landing
          onAnalyze={handleAnalyze}
          onImportBackup={handleImportBackup}
        />
      ) : (
        <Dashboard
          username={view.username}
          timeControl={view.timeControl}
          importedData={view.importedData}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;
