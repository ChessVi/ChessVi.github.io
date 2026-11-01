import React from 'react';
import type { AnalysisResult } from '../types';
import { StatCard } from './ui/StatCard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface OverviewTabProps {
  result: AnalysisResult;
  onSelectOpeningTab: () => void;
  onSelectStructureTab: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  result,
  onSelectOpeningTab,
  onSelectStructureTab,
}) => {
  const whiteGames = result.colorStats.white.games;
  const blackGames = result.colorStats.black.games;

  const whiteWinRate =
    whiteGames > 0 ? (result.colorStats.white.wins / whiteGames) * 100 : 0;
  const blackWinRate =
    blackGames > 0 ? (result.colorStats.black.wins / blackGames) * 100 : 0;

  // Total results
  const totalWins =
    result.colorStats.white.wins + result.colorStats.black.wins;
  const totalDraws =
    result.colorStats.white.draws + result.colorStats.black.draws;
  const totalLosses =
    result.colorStats.white.losses + result.colorStats.black.losses;

  const winPct = ((totalWins / result.totalGames) * 100).toFixed(1);
  const drawPct = ((totalDraws / result.totalGames) * 100).toFixed(1);
  const lossPct = ((totalLosses / result.totalGames) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Games Analyzed"
          value={result.totalGames.toLocaleString()}
          subtitle={`${result.timeRange.from.toLocaleDateString(undefined, {
            month: 'short',
            year: 'numeric',
          })} - ${result.timeRange.to.toLocaleDateString(undefined, {
            month: 'short',
            year: 'numeric',
          })}`}
          icon={<span className="text-sm">♟️</span>}
        />

        <StatCard
          title="Overall Win Rate"
          value={`${result.overallWinRate.toFixed(1)}%`}
          subtitle={`${totalWins}W / ${totalDraws}D / ${totalLosses}L`}
          badge={{
            text:
              result.overallWinRate >= 52
                ? 'Strong'
                : result.overallWinRate >= 46
                ? 'Average'
                : 'Struggling',
            type:
              result.overallWinRate >= 52
                ? 'positive'
                : result.overallWinRate >= 46
                ? 'neutral'
                : 'negative',
          }}
          icon={<span className="text-sm">🎯</span>}
        />

        <StatCard
          title="Average Rating"
          value={Math.round(result.avgRating)}
          subtitle="Estimated baseline"
          icon={<span className="text-sm">⚡</span>}
        />

        <StatCard
          title="White vs Black Win Rate"
          value={`${whiteWinRate.toFixed(0)}% / ${blackWinRate.toFixed(0)}%`}
          subtitle={`${whiteGames} as White, ${blackGames} as Black`}
          badge={{
            text: whiteWinRate >= blackWinRate ? '+White Advantage' : '+Black Advantage',
            type: 'accent',
          }}
          icon={<span className="text-sm">⚖️</span>}
        />
      </div>

      {/* Outcome Distribution Bar */}
      <div className="bg-[#18181b] border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            Game Outcome Breakdown
          </h3>
          <span className="text-xs text-neutral-500 font-mono">
            {result.totalGames} total games
          </span>
        </div>

        <div className="w-full h-4 rounded-full overflow-hidden flex bg-neutral-900 border border-neutral-800">
          <div
            style={{ width: `${winPct}%` }}
            className="bg-emerald-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-neutral-950"
            title={`Wins: ${winPct}%`}
          />
          <div
            style={{ width: `${drawPct}%` }}
            className="bg-neutral-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-neutral-950"
            title={`Draws: ${drawPct}%`}
          />
          <div
            style={{ width: `${lossPct}%` }}
            className="bg-rose-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-neutral-950"
            title={`Losses: ${lossPct}%`}
          />
        </div>

        <div className="flex justify-between items-center mt-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Wins: {totalWins} ({winPct}%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-500 inline-block" />
            <span>Draws: {totalDraws} ({drawPct}%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>Losses: {totalLosses} ({lossPct}%)</span>
          </div>
        </div>
      </div>

      {/* Rating Progression Chart */}
      {result.ratingHistory.length > 1 && (
        <div className="bg-[#18181b] border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
                Rating Trend Over Time
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Monthly average rating across analyzed games
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.ratingHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#262626' }}
                />
                <YAxis
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#262626' }}
                  domain={['dataMin - 50', 'dataMax + 50']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    border: '1px solid #404040',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: any) => [`${value} ELO`, 'Rating']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ fill: '#f59e0b', r: 3 }}
                  activeDot={{ r: 5, fill: '#fbbf24' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Best & Worst Openings Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Worst Openings */}
        <div className="bg-[#18181b] border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Worst Performing Openings
                </h3>
              </div>
              <button
                onClick={onSelectOpeningTab}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium transition"
              >
                View all →
              </button>
            </div>

            {result.worstOpenings.length === 0 ? (
              <p className="text-xs text-neutral-500 italic py-6 text-center">
                Not enough repeated openings to identify severe weaknesses.
              </p>
            ) : (
              <div className="space-y-3">
                {result.worstOpenings.slice(0, 4).map((op) => (
                  <div
                    key={op.name}
                    className="p-3 rounded-xl bg-[#121214] border border-neutral-800/80 flex items-center justify-between gap-3 hover:border-neutral-700 transition"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                          {op.eco}
                        </span>
                        <h4 className="text-xs font-semibold text-neutral-200 truncate">
                          {op.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        {op.totalGames} games ({op.wins}W / {op.draws}D / {op.losses}L)
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-mono font-bold text-rose-400">
                        {op.winRate.toFixed(1)}%
                      </span>
                      <p className="text-[10px] text-neutral-500">Win Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-800/80 text-xs text-neutral-400 flex items-center gap-2">
            <span>💡</span>
            <span>Focus prep on these to quickly regain lost rating points.</span>
          </div>
        </div>

        {/* Best Openings */}
        <div className="bg-[#18181b] border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Highest Win Rate Openings
                </h3>
              </div>
              <button
                onClick={onSelectOpeningTab}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium transition"
              >
                View all →
              </button>
            </div>

            {result.bestOpenings.length === 0 ? (
              <p className="text-xs text-neutral-500 italic py-6 text-center">
                Play more games to establish statistically solid winning weapons.
              </p>
            ) : (
              <div className="space-y-3">
                {result.bestOpenings.slice(0, 4).map((op) => (
                  <div
                    key={op.name}
                    className="p-3 rounded-xl bg-[#121214] border border-neutral-800/80 flex items-center justify-between gap-3 hover:border-neutral-700 transition"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                          {op.eco}
                        </span>
                        <h4 className="text-xs font-semibold text-neutral-200 truncate">
                          {op.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        {op.totalGames} games ({op.wins}W / {op.draws}D / {op.losses}L)
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {op.winRate.toFixed(1)}%
                      </span>
                      <p className="text-[10px] text-neutral-500">Win Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-800/80 text-xs text-neutral-400 flex items-center gap-2">
            <span>🛡️</span>
            <span>These are your reliable comfort zones. Keep them sharp!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
