import React, { useEffect, useState } from 'react';
import type { TimeControl } from '../types';
import { useChesscom } from '../hooks/useChesscom';
import { useAnalysis } from '../hooks/useAnalysis';
import { LoadingScreen } from './ui/LoadingScreen';
import { OverviewTab } from './OverviewTab';
import { OpeningTable } from './OpeningTable';
import { OpeningChart } from './OpeningChart';
import { StructureTab } from './StructureTab';
import { ReportTab } from './ReportTab';

interface DashboardProps {
  username: string;
  timeControl: TimeControl;
  onBack: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  username,
  timeControl: initialTimeControl,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'openings' | 'structures' | 'report'>('overview');
  const [timeControl, setTimeControl] = useState<TimeControl>(initialTimeControl);
  const [minGames, setMinGames] = useState<number>(3);

  const { games, loading, error, progress, profile, playerStats, fetchData } = useChesscom();

  useEffect(() => {
    fetchData(username, timeControl);
  }, [username, timeControl, fetchData]);

  const analysisResult = useAnalysis(games, minGames, username);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <LoadingScreen progress={progress} username={username} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#18181b] border border-neutral-800 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-2xl mx-auto mb-4">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Analysis Failed</h2>
          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            {error}. Please check the username or try again in a few moments.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition"
            >
              ← Choose another username
            </button>
            <button
              onClick={() => fetchData(username, timeControl)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#18181b] border border-neutral-800 rounded-2xl p-8 text-center">
          <div className="text-3xl mb-3">♟️</div>
          <h2 className="text-lg font-bold text-white mb-2">No Games Found</h2>
          <p className="text-xs text-neutral-400 mb-6">
            We couldn't find any standard {timeControl} games in @{username}'s history.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition"
          >
            ← Try Another Search
          </button>
        </div>
      </div>
    );
  }

  // Current rating from stats
  const blitzRating = playerStats?.chess_blitz?.last?.rating;
  const rapidRating = playerStats?.chess_rapid?.last?.rating;

  return (
    <div className="min-h-screen text-neutral-100 selection:bg-amber-500/30">
      {/* Top Header */}
      <header className="border-b border-neutral-800/80 bg-[#121214]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition text-xs flex items-center gap-1.5"
              title="Back to landing"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

            {/* Player Info Badge */}
            <div className="flex items-center gap-3">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={username}
                  className="w-9 h-9 rounded-xl border border-neutral-700 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm">
                  {username[0].toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-white tracking-tight">
                    {profile?.name || username}
                  </h1>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    @{username}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                  {blitzRating && <span>Blitz: <strong className="text-neutral-200">{blitzRating}</strong></span>}
                  {rapidRating && <span>• Rapid: <strong className="text-neutral-200">{rapidRating}</strong></span>}
                </div>
              </div>
            </div>
          </div>

          {/* Time Control Switcher */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl p-1 bg-[#18181b] border border-neutral-800 text-xs">
              {(['blitz', 'rapid', 'both'] as TimeControl[]).map((tc) => (
                <button
                  key={tc}
                  onClick={() => setTimeControl(tc)}
                  className={`px-3 py-1 rounded-lg capitalize font-medium text-xs transition ${
                    timeControl === tc
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 mb-8 overflow-x-auto space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 font-semibold text-xs tracking-wider uppercase border-b-2 transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('openings')}
            className={`py-3 px-4 font-semibold text-xs tracking-wider uppercase border-b-2 transition whitespace-nowrap ${
              activeTab === 'openings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            ♟️ Opening Repertoire & Weaknesses
          </button>
          <button
            onClick={() => setActiveTab('structures')}
            className={`py-3 px-4 font-semibold text-xs tracking-wider uppercase border-b-2 transition whitespace-nowrap ${
              activeTab === 'structures'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            🏛️ Pawn Structures & Study
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`py-3 px-4 font-semibold text-xs tracking-wider uppercase border-b-2 transition whitespace-nowrap ${
              activeTab === 'report'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            🤖 AI Report & Export
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab
            result={analysisResult}
            onSelectOpeningTab={() => setActiveTab('openings')}
            onSelectStructureTab={() => setActiveTab('structures')}
          />
        )}

        {activeTab === 'openings' && (
          <div className="space-y-8">
            <OpeningChart stats={analysisResult.openingStats} />
            <OpeningTable
              stats={analysisResult.openingStats}
              allGames={games}
              minGames={minGames}
              onMinGamesChange={setMinGames}
            />
          </div>
        )}

        {activeTab === 'structures' && (
          <StructureTab structureStats={analysisResult.pawnStructureStats} />
        )}

        {activeTab === 'report' && (
          <ReportTab result={analysisResult} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
