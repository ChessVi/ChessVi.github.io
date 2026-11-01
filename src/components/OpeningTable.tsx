import React, { useState, useMemo } from 'react';
import type { SortField, SortDirection, ParsedGame } from '../types';
import { calculateOpeningStats } from '../analysis/openings';
import { OpeningChart } from './OpeningChart';

interface OpeningTableProps {
  allGames: ParsedGame[];
  minGames: number;
  onMinGamesChange: (val: number) => void;
}

type DateRangeFilter = 'all' | '30d' | '3m' | '6m' | '1y';
type TimeFormatFilter = 'all' | 'blitz' | 'rapid';
type OpponentFilter = 'all' | 'higher' | 'similar' | 'lower';
type ColorFilter = 'all' | 'white' | 'black';

export const OpeningTable: React.FC<OpeningTableProps> = ({
  allGames,
  minGames,
  onMinGamesChange,
}) => {
  // Enhanced Filter States
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>('all');
  const [timeFormatFilter, setTimeFormatFilter] = useState<TimeFormatFilter>('all');
  const [colorFilter, setColorFilter] = useState<ColorFilter>('all');
  const [opponentFilter, setOpponentFilter] = useState<OpponentFilter>('all');
  const [search, setSearch] = useState('');

  // Sorting States
  const [sortField, setSortField] = useState<SortField>('winRate');
  const [sortDir, setSortDir] = useState<SortDirection>('asc'); // Default asc so worst opening is at the top!
  const [selectedOpening, setSelectedOpening] = useState<string | null>(null);

  // Check if any filter is active
  const hasActiveFilters =
    dateFilter !== 'all' ||
    timeFormatFilter !== 'all' ||
    colorFilter !== 'all' ||
    opponentFilter !== 'all' ||
    search.trim() !== '' ||
    minGames > 1;

  const handleResetFilters = () => {
    setDateFilter('all');
    setTimeFormatFilter('all');
    setColorFilter('all');
    setOpponentFilter('all');
    setSearch('');
    onMinGamesChange(3);
  };

  // Step 1: Filter raw games by Date, Time Format, Color, and Opponent Rating
  const filteredGames = useMemo(() => {
    const now = new Date().getTime();

    return allGames.filter((g) => {
      // 1. Date Range
      if (dateFilter !== 'all') {
        const gameTime = g.date.getTime();
        const daysAgo = (now - gameTime) / (1000 * 60 * 60 * 24);

        if (dateFilter === '30d' && daysAgo > 30) return false;
        if (dateFilter === '3m' && daysAgo > 90) return false;
        if (dateFilter === '6m' && daysAgo > 180) return false;
        if (dateFilter === '1y' && daysAgo > 365) return false;
      }

      // 2. Time Format (Blitz vs Rapid)
      if (timeFormatFilter !== 'all') {
        if (g.timeClass !== timeFormatFilter) return false;
      }

      // 3. Color
      if (colorFilter !== 'all') {
        if (g.playerColor !== colorFilter) return false;
      }

      // 4. Opponent Rating Tier
      if (opponentFilter !== 'all') {
        const playerRating =
          g.playerColor === 'white' ? g.white.rating : g.black.rating;
        const diff = g.opponentRating - playerRating;

        if (opponentFilter === 'higher' && diff < 30) return false; // Opponent is at least 30+ higher
        if (opponentFilter === 'lower' && diff > -30) return false; // Opponent is at least 30+ lower
        if (opponentFilter === 'similar' && Math.abs(diff) > 50) return false; // Within ±50 Elo
      }

      return true;
    });
  }, [allGames, dateFilter, timeFormatFilter, colorFilter, opponentFilter]);

  // Step 2: Dynamically calculate Opening Stats based on the filtered games slice
  const calculatedStats = useMemo(() => {
    return calculateOpeningStats(filteredGames, minGames);
  }, [filteredGames, minGames]);

  // Step 3: Search and Sort the resulting opening stats
  const displayedStats = useMemo(() => {
    return calculatedStats
      .filter((op) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          op.name.toLowerCase().includes(q) ||
          op.eco.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        let valA: number | string = 0;
        let valB: number | string = 0;

        switch (sortField) {
          case 'name':
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
            return sortDir === 'asc'
              ? (valA as string).localeCompare(valB as string)
              : (valB as string).localeCompare(valA as string);
          case 'games':
            valA = a.totalGames;
            valB = b.totalGames;
            break;
          case 'winRate':
            valA = a.winRate;
            valB = b.winRate;
            break;
          case 'losses':
            valA = a.losses;
            valB = b.losses;
            break;
          case 'avgRating':
            valA = a.avgOpponentRating;
            valB = b.avgOpponentRating;
            break;
        }

        return sortDir === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      });
  }, [calculatedStats, search, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir(field === 'winRate' ? 'asc' : 'desc');
    }
  };

  // Selected opening game history for the inspector
  const selectedOpeningGames = useMemo(() => {
    if (!selectedOpening) return [];
    return filteredGames
      .filter((g) => g.opening?.name === selectedOpening)
      .slice(-12)
      .reverse();
  }, [filteredGames, selectedOpening]);

  const getWinRateBadge = (winRate: number) => {
    if (winRate >= 55) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <span>●</span> {winRate.toFixed(1)}%
        </span>
      );
    }
    if (winRate >= 42) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <span>●</span> {winRate.toFixed(1)}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
        <span>●</span> {winRate.toFixed(1)}%
      </span>
    );
  };

  // Helper format time control string
  const formatTimeControl = (tc?: string, timeClass?: string) => {
    if (!tc) return timeClass || 'chess';
    if (tc === '180') return '3 min';
    if (tc === '180+2') return '3+2';
    if (tc === '300') return '5 min';
    if (tc === '300+5') return '5+5';
    if (tc === '600') return '10 min';
    if (tc === '900+10') return '15+10';
    if (tc.includes('+')) {
      const [base, inc] = tc.split('+');
      return `${Math.round(parseInt(base, 10) / 60)}+${inc}`;
    }
    const secs = parseInt(tc, 10);
    return secs ? `${Math.round(secs / 60)} min` : tc;
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Charts reflecting current filters */}
      <OpeningChart stats={calculatedStats} />

      {/* Advanced Filter Control Center */}
      <div className="bg-[#18181b] border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🎛️</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Filter Repertoire & Game Conditions
            </h3>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-400 hover:text-rose-300 transition flex items-center gap-1 self-start sm:self-auto font-medium"
            >
              <span>✕</span> Reset All Filters
            </button>
          )}
        </div>

        {/* Filter Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Date Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              📅 Date Range
            </label>
            <div className="grid grid-cols-5 gap-1 bg-[#121214] p-1 rounded-xl border border-neutral-800 text-xs">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: '30d', label: '30d' },
                  { id: '3m', label: '3m' },
                  { id: '6m', label: '6m' },
                  { id: '1y', label: '1y' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDateFilter(item.id)}
                  className={`py-1.5 rounded-lg font-medium transition text-center ${
                    dateFilter === item.id
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  title={
                    item.id === '3m'
                      ? 'Last 3 Months'
                      : item.id === '6m'
                      ? 'Last 6 Months'
                      : item.id === '30d'
                      ? 'Last 30 Days'
                      : item.id === '1y'
                      ? 'Last 1 Year'
                      : 'All Time'
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Time Format Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              ⏱️ Time Format
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#121214] p-1 rounded-xl border border-neutral-800 text-xs">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'blitz', label: 'Blitz' },
                  { id: 'rapid', label: 'Rapid' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTimeFormatFilter(item.id)}
                  className={`py-1.5 rounded-lg font-medium transition text-center ${
                    timeFormatFilter === item.id
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Color Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              ♟️ Playing Color
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#121214] p-1 rounded-xl border border-neutral-800 text-xs">
              {(
                [
                  { id: 'all', label: 'Both' },
                  { id: 'white', label: 'White' },
                  { id: 'black', label: 'Black' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setColorFilter(item.id)}
                  className={`py-1.5 rounded-lg font-medium transition text-center ${
                    colorFilter === item.id
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Opponent Rating Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              🎯 Opponent Level
            </label>
            <div className="grid grid-cols-4 gap-1 bg-[#121214] p-1 rounded-xl border border-neutral-800 text-xs">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'higher', label: 'Higher' },
                  { id: 'similar', label: '±50' },
                  { id: 'lower', label: 'Lower' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOpponentFilter(item.id)}
                  className={`py-1.5 rounded-lg font-medium transition text-center ${
                    opponentFilter === item.id
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  title={
                    item.id === 'higher'
                      ? 'Opponents rated 30+ higher than you'
                      : item.id === 'similar'
                      ? 'Opponents within ±50 Elo'
                      : item.id === 'lower'
                      ? 'Opponents rated 30+ lower than you'
                      : 'All opponent ratings'
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search & Min Games Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-1">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500 text-xs">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search opening name or ECO code (e.g. Sicilian, B20)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121214] border border-neutral-700/80 focus:border-amber-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          {/* Min Games Filter with Quick Chips */}
          <div className="md:col-span-7 flex flex-wrap items-center justify-between gap-3 bg-[#121214] px-4 py-2 rounded-xl border border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-400 whitespace-nowrap">
                Min Games:
              </span>
              <span className="text-amber-400 font-mono font-bold text-xs bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                {minGames}+
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5">
              {[1, 3, 5, 10, 20].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => onMinGamesChange(count)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-mono font-semibold transition ${
                    minGames === count
                      ? 'bg-amber-500 text-neutral-950 shadow-sm'
                      : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  {count === 1 ? 'Any' : `${count}+`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Filter Summary Banner */}
        <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800/60 gap-2">
          <div className="flex items-center gap-2">
            <span>
              Analyzing <strong className="text-amber-400 font-mono">{filteredGames.length}</strong> filtered games
              across <strong className="text-neutral-200 font-mono">{displayedStats.length}</strong> qualifying openings.
            </span>
            {dateFilter !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono">
                {dateFilter === '30d'
                  ? 'Last 30 Days'
                  : dateFilter === '3m'
                  ? 'Last 3 Months'
                  : dateFilter === '6m'
                  ? 'Last 6 Months'
                  : 'Last 1 Year'}
              </span>
            )}
            {timeFormatFilter !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] font-mono capitalize">
                {timeFormatFilter} Only
              </span>
            )}
          </div>

          <span className="text-[11px] text-neutral-500 italic">
            Sorted by lowest win rate first (weakness detector)
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#18181b] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300 border-collapse">
            <thead className="bg-[#121214] border-b border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition"
                >
                  Opening {sortField === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-3.5 px-3">ECO</th>
                <th
                  onClick={() => handleSort('games')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white transition text-center"
                >
                  Games {sortField === 'games' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                  onClick={() => handleSort('winRate')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition text-center"
                >
                  Win Rate {sortField === 'winRate' ? (sortDir === 'asc' ? '↑ (Worst)' : '↓ (Best)') : ''}
                </th>
                <th className="py-3.5 px-4 text-center">W / D / L</th>
                <th
                  onClick={() => handleSort('avgRating')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white transition text-right"
                >
                  Avg Opp {sortField === 'avgRating' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {displayedStats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 italic font-sans">
                    No openings found matching your criteria. Try adjusting the date range or lowering the minimum games filter.
                  </td>
                </tr>
              ) : (
                displayedStats.map((op) => {
                  const isSelected = selectedOpening === op.name;
                  const isSevereWeakness = op.winRate < 38 && op.totalGames >= 3;

                  return (
                    <React.Fragment key={op.name}>
                      <tr
                        className={`hover:bg-neutral-800/40 transition cursor-pointer ${
                          isSelected ? 'bg-neutral-800/60' : ''
                        } ${isSevereWeakness ? 'bg-rose-500/[0.04]' : ''}`}
                        onClick={() =>
                          setSelectedOpening(isSelected ? null : op.name)
                        }
                      >
                        {/* Opening Name */}
                        <td className="py-3.5 px-4 font-sans">
                          <div className="flex items-center gap-2">
                            {isSevereWeakness && (
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0"
                                title="Statistically low win rate in this filter"
                              />
                            )}
                            <span className="font-semibold text-white truncate max-w-xs sm:max-w-md">
                              {op.name}
                            </span>
                          </div>
                          <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                            {op.asWhite} as White • {op.asBlack} as Black
                          </div>
                        </td>

                        {/* ECO */}
                        <td className="py-3.5 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
                            {op.eco}
                          </span>
                        </td>

                        {/* Games */}
                        <td className="py-3.5 px-3 text-center font-bold text-neutral-200">
                          {op.totalGames}
                        </td>

                        {/* Win Rate */}
                        <td className="py-3.5 px-4 text-center">
                          {getWinRateBadge(op.winRate)}
                        </td>

                        {/* W / D / L bar */}
                        <td className="py-3.5 px-4">
                          <div className="w-28 mx-auto">
                            <div className="w-full h-2 rounded-full overflow-hidden flex bg-neutral-900 border border-neutral-800">
                              <div
                                style={{
                                  width: `${(op.wins / op.totalGames) * 100}%`,
                                }}
                                className="bg-emerald-500"
                              />
                              <div
                                style={{
                                  width: `${(op.draws / op.totalGames) * 100}%`,
                                }}
                                className="bg-neutral-500"
                              />
                              <div
                                style={{
                                  width: `${(op.losses / op.totalGames) * 100}%`,
                                }}
                                className="bg-rose-500"
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                              <span className="text-emerald-400">{op.wins}</span>
                              <span className="text-neutral-400">{op.draws}</span>
                              <span className="text-rose-400">{op.losses}</span>
                            </div>
                          </div>
                        </td>

                        {/* Avg Opponent */}
                        <td className="py-3.5 px-3 text-right text-neutral-400">
                          {Math.round(op.avgOpponentRating)}
                        </td>

                        {/* Expand Action */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOpening(isSelected ? null : op.name);
                            }}
                            className="text-xs text-neutral-400 hover:text-amber-400 font-sans transition"
                          >
                            {isSelected ? 'Close ▲' : 'Inspect ▼'}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Drawer for Specific Opening */}
                      {isSelected && (
                        <tr className="bg-[#121214] border-t border-b border-neutral-800">
                          <td colSpan={7} className="p-4 sm:p-6 font-sans">
                            <div className="space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                                <div>
                                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                                    <span>Filtered Games in {op.name}</span>
                                    <span className="text-xs font-mono font-normal text-neutral-500">
                                      ({selectedOpeningGames.length} shown)
                                    </span>
                                  </h4>
                                </div>
                                <div className="text-xs text-neutral-400">
                                  Performance Rating in this selection:{' '}
                                  <span className="font-mono font-bold text-amber-400">
                                    {op.performanceRating}
                                  </span>
                                </div>
                              </div>

                              {/* Game List */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {selectedOpeningGames.map((game, idx) => {
                                  const isWin = game.playerResult === 'win';
                                  const isLoss = game.playerResult === 'loss';
                                  const resultColor = isWin
                                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                                    : isLoss
                                    ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                                    : 'text-neutral-400 bg-neutral-800 border-neutral-700';

                                  return (
                                    <div
                                      key={game.id || idx}
                                      className="p-3 rounded-xl bg-[#18181b] border border-neutral-800/80 flex items-center justify-between text-xs"
                                    >
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${resultColor}`}
                                          >
                                            {game.playerResult}
                                          </span>
                                          <span className="font-medium text-neutral-200">
                                            vs {game.playerColor === 'white' ? game.black.username : game.white.username}
                                          </span>
                                          <span className="text-neutral-500 font-mono text-[11px]">
                                            ({game.opponentRating})
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-neutral-500 mt-1">
                                          {formatTimeControl(game.timeControlDetail, game.timeClass)} • Played as {game.playerColor} • {game.date.toLocaleDateString()}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <a
                                          href={`https://www.chess.com/analysis?pgn=${encodeURIComponent(
                                            game.pgn
                                          )}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition text-[11px] font-medium"
                                        >
                                          Analyze ↗
                                        </a>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OpeningTable;
