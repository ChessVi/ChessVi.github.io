import React, { useState, useMemo } from 'react';
import type { OpeningStats, SortField, SortDirection, ParsedGame } from '../types';

interface OpeningTableProps {
  stats: OpeningStats[];
  allGames: ParsedGame[];
  minGames: number;
  onMinGamesChange: (val: number) => void;
}

export const OpeningTable: React.FC<OpeningTableProps> = ({
  stats,
  allGames,
  minGames,
  onMinGamesChange,
}) => {
  const [search, setSearch] = useState('');
  const [colorFilter, setColorFilter] = useState<'all' | 'white' | 'black'>('all');
  const [sortField, setSortField] = useState<SortField>('winRate');
  const [sortDir, setSortDir] = useState<SortDirection>('asc'); // default asc so worst opening appears at top!
  const [selectedOpening, setSelectedOpening] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      // For winRate, default to asc (worst first). For games, default to desc (most games first).
      setSortDir(field === 'winRate' ? 'asc' : 'desc');
    }
  };

  const filteredStats = useMemo(() => {
    return stats
      .filter((op) => {
        // Min games filter
        if (op.totalGames < minGames) return false;

        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = op.name.toLowerCase().includes(q);
          const matchEco = op.eco.toLowerCase().includes(q);
          if (!matchName && !matchEco) return false;
        }

        // Color filter
        if (colorFilter === 'white' && op.asWhite === 0) return false;
        if (colorFilter === 'black' && op.asBlack === 0) return false;

        return true;
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
  }, [stats, minGames, search, colorFilter, sortField, sortDir]);

  // Selected opening game history
  const selectedGames = useMemo(() => {
    if (!selectedOpening) return [];
    return allGames
      .filter((g) => g.opening?.name === selectedOpening)
      .slice(-10)
      .reverse();
  }, [allGames, selectedOpening]);

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

  return (
    <div className="space-y-6">
      {/* Controls & Filters Bar */}
      <div className="bg-[#18181b] border border-neutral-800 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500 text-xs">
              🔍
            </span>
            <input
              type="text"
              placeholder="Filter by opening name or ECO (e.g. Sicilian, B20)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121214] border border-neutral-700/80 focus:border-amber-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          {/* Min Games Filter */}
          <div className="md:col-span-4 flex items-center gap-3 bg-[#121214] px-4 py-2 rounded-xl border border-neutral-800">
            <span className="text-xs font-semibold text-neutral-400 whitespace-nowrap">
              Min Games: <span className="text-amber-400 font-mono">{minGames}</span>
            </span>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={minGames}
              onChange={(e) => onMinGamesChange(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
            />
            {/* Quick 10+ games button as requested */}
            <button
              onClick={() => onMinGamesChange(10)}
              className={`text-[11px] px-2 py-0.5 rounded font-mono font-semibold transition ${
                minGames === 10
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-800 text-neutral-300 hover:text-white'
              }`}
              title="Show openings with 10 or more games"
            >
              10+
            </button>
          </div>

          {/* Color Filter */}
          <div className="md:col-span-3 flex justify-end">
            <div className="inline-flex rounded-xl p-1 bg-[#121214] border border-neutral-800 text-xs w-full justify-between">
              {(['all', 'white', 'black'] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setColorFilter(color)}
                  className={`flex-1 py-1.5 px-2 rounded-lg capitalize font-medium transition text-center ${
                    colorFilter === color
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {color === 'all' ? 'All Colors' : color}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick helper tag */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
          <span>
            Showing <span className="text-neutral-200 font-semibold">{filteredStats.length}</span> openings matching filters
          </span>
          <span className="text-[11px] text-neutral-500 italic">
            Tip: Click column headers to sort. By default sorted to highlight worst openings first.
          </span>
        </div>
      </div>

      {/* Table Card */}
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
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {filteredStats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 italic font-sans">
                    No openings found matching the current filters. Try lowering the minimum games or clearing the search.
                  </td>
                </tr>
              ) : (
                filteredStats.map((op) => {
                  const isSelected = selectedOpening === op.name;
                  const isSevereWeakness = op.winRate < 38 && op.totalGames >= 5;

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
                                className="w-1.5 h-1.5 rounded-full bg-rose-500"
                                title="Statistically low win rate"
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
                                    <span>Recent Games in {op.name}</span>
                                    <span className="text-xs font-mono font-normal text-neutral-500">
                                      ({selectedGames.length} shown)
                                    </span>
                                  </h4>
                                </div>
                                <div className="text-xs text-neutral-400">
                                  Performance Rating:{' '}
                                  <span className="font-mono font-bold text-amber-400">
                                    {op.performanceRating}
                                  </span>
                                </div>
                              </div>

                              {/* Game List */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {selectedGames.map((game, idx) => {
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
                                          Played as {game.playerColor} • {game.date.toLocaleDateString()}
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
                                          Analyze on Chess.com ↗
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
