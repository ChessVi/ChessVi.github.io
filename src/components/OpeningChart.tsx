import React from 'react';
import type { OpeningStats } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';

interface OpeningChartProps {
  stats: OpeningStats[];
}

export const OpeningChart: React.FC<OpeningChartProps> = ({ stats }) => {
  // Take top 8 most played openings
  const topPlayed = [...stats]
    .sort((a, b) => b.totalGames - a.totalGames)
    .slice(0, 8);

  const getBarColor = (winRate: number) => {
    if (winRate >= 55) return '#10b981'; // emerald
    if (winRate >= 45) return '#f59e0b'; // amber
    return '#f43f5e'; // rose/red
  };

  if (stats.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Most Played Openings */}
      <div className="bg-[#18181b] border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-1">
          Most Frequent Openings
        </h3>
        <p className="text-xs text-neutral-500 mb-4">
          Openings with your highest volume of games
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topPlayed}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
              <XAxis type="number" stroke="#737373" fontSize={11} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#737373"
                fontSize={10}
                tickFormatter={(val) => (val.length > 18 ? `${val.slice(0, 16)}…` : val)}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  border: '1px solid #404040',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val} games`, 'Total Games']}
              />
              <Bar dataKey="totalGames" fill="#6366f1" radius={[0, 4, 4, 0]}>
                {topPlayed.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="#38bdf8" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Win Rate by Most Played Openings */}
      <div className="bg-[#18181b] border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-1">
          Win Rate Comparison (%)
        </h3>
        <p className="text-xs text-neutral-500 mb-4">
          Green ≥55%, Amber 45–54%, Red &lt;45% win rate
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topPlayed}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="#737373" fontSize={11} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#737373"
                fontSize={10}
                tickFormatter={(val) => (val.length > 18 ? `${val.slice(0, 16)}…` : val)}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  border: '1px solid #404040',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${Number(val).toFixed(1)}%`, 'Win Rate']}
              />
              <Bar dataKey="winRate" radius={[0, 4, 4, 0]}>
                {topPlayed.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.winRate)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
