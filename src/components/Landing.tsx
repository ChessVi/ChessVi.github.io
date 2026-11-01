import React, { useState } from 'react';
import type { TimeControl } from '../types';

interface LandingProps {
  onAnalyze: (username: string, timeControl: TimeControl) => void;
}

export const Landing: React.FC<LandingProps> = ({ onAnalyze }) => {
  const [username, setUsername] = useState('');
  const [timeControl, setTimeControl] = useState<TimeControl>('blitz');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim();
    if (!cleanUser) {
      setError('Please enter a Chess.com username');
      return;
    }
    setError('');
    onAnalyze(cleanUser, timeControl);
  };

  const handleQuickSelect = (name: string) => {
    setUsername(name);
    setError('');
  };

  return (
    <div className="min-h-screen text-neutral-100 flex flex-col justify-between selection:bg-amber-500/30">
      {/* Navbar */}
      <header className="border-b border-neutral-800/80 bg-[#121214]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold tracking-tight text-lg text-white">
            <span className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-base shadow-sm">
              ♟
            </span>
            <span>
              Chess<span className="text-amber-400">Weakness</span>
            </span>
          </div>

          <a
            href="https://github.com/chessweakness/chessweakness.github.io"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-neutral-400 hover:text-neutral-200 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-300 text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          100% Client-Side Chess.com Archive Analysis
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Chess Weakness</span>, Win More Games.
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Analyze all your blitz and rapid games directly from your Chess.com public profile.
          Uncover your worst-performing openings, detect pawn structure gaps, and download an AI-friendly report.
        </p>

        {/* Input Card */}
        <div className="max-w-xl mx-auto bg-[#18181b] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 text-left"
              >
                Chess.com Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  ♟
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. hikaru, magnuscarlsen"
                  className="w-full bg-[#121214] border border-neutral-700/80 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition font-mono text-sm"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-xs text-rose-400 text-left mt-2 font-medium">
                  {error}
                </p>
              )}
            </div>

            {/* Time Control Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 text-left">
                Time Control
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['blitz', 'rapid', 'both'] as TimeControl[]).map((tc) => (
                  <button
                    key={tc}
                    type="button"
                    onClick={() => setTimeControl(tc)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition ${
                      timeControl === tc
                        ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/10'
                        : 'bg-[#121214] text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    {tc === 'both' ? 'Blitz + Rapid' : tc}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-neutral-500">
              <span>Popular:</span>
              {['hikaru', 'GothamChess', 'DanielNaroditsky'].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleQuickSelect(name)}
                  className="text-neutral-400 hover:text-amber-400 font-mono underline decoration-neutral-700 underline-offset-4 hover:decoration-amber-500 transition"
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 transition duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Analyze My Games</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-0.5 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mt-20 text-left">
          <div className="bg-[#141416] border border-neutral-800/80 p-6 rounded-2xl hover:border-neutral-700 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-lg mb-4">
              📉
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Worst Opening Detector
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Filter openings where you played 10+ games. Spot where your win rate collapses below 40% and where you bleed rating points.
            </p>
          </div>

          <div className="bg-[#141416] border border-neutral-800/80 p-6 rounded-2xl hover:border-neutral-700 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-lg mb-4">
              🏛️
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Pawn Structure Insights
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Maps your ECO openings into IQP, Carlsbad, French, Dragon, and Hedgehog structures. Identifies plans and study topics to fix them.
            </p>
          </div>

          <div className="bg-[#141416] border border-neutral-800/80 p-6 rounded-2xl hover:border-neutral-700 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg mb-4">
              🤖
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              AI-Friendly Export
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Download comprehensive Markdown or JSON reports. Copy pre-built prompts to paste directly into ChatGPT, Claude, or Gemini for a custom coaching regimen.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-8 text-center text-xs text-neutral-500 bg-[#0c0c0e]">
        <p className="mb-2">
          Chess Weakness Analyzer is an open-source project powered by the official Chess.com Public API.
        </p>
        <p>
          Runs 100% inside your browser. No authentication required. No games or credentials stored on any server.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
