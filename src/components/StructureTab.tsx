import React, { useState } from 'react';
import type { PawnStructureStats } from '../types';

interface StructureTabProps {
  structureStats: PawnStructureStats[];
}

export const StructureTab: React.FC<StructureTabProps> = ({ structureStats }) => {
  const [filter, setFilter] = useState<'all' | 'weak' | 'strong'>('all');

  const filtered = structureStats.filter((item) => {
    if (filter === 'weak') return item.winRate < 48;
    if (filter === 'strong') return item.winRate >= 52;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Introduction banner */}
      <div className="bg-[#18181b] border border-neutral-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🏛️</span>
              <span>Pawn Structure Analysis & Study Recommendations</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              Openings inevitably transpose into pawn skeletons. If you struggle in certain pawn structures, memorizing more opening moves won’t help — you need to study the typical middlegame plans for that structure.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#121214] rounded-xl border border-neutral-800 self-start md:self-auto text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                filter === 'all'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              All ({structureStats.length})
            </button>
            <button
              onClick={() => setFilter('weak')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                filter === 'weak'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Needs Work (&lt;48%)
            </button>
            <button
              onClick={() => setFilter('strong')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                filter === 'strong'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Strong (≥52%)
            </button>
          </div>
        </div>
      </div>

      {/* Structure Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#18181b] border border-neutral-800 rounded-2xl p-12 text-center text-neutral-500 italic text-sm">
          No pawn structures match the selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((item) => {
            const isWeak = item.winRate < 48;
            const isStrong = item.winRate >= 55;

            return (
              <div
                key={item.structure.name}
                className={`bg-[#18181b] border rounded-2xl p-6 transition flex flex-col justify-between ${
                  isWeak
                    ? 'border-rose-500/30 hover:border-rose-500/50'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        {item.structure.name}
                        {isWeak && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            Blind Spot
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {item.structure.description}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span
                        className={`text-xl font-mono font-extrabold ${
                          isStrong
                            ? 'text-emerald-400'
                            : isWeak
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {item.winRate.toFixed(1)}%
                      </span>
                      <p className="text-[10px] text-neutral-500">
                        {item.totalGames} games
                      </p>
                    </div>
                  </div>

                  {/* Outcome Mini Bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden flex bg-neutral-900 border border-neutral-800 my-4">
                    <div
                      style={{ width: `${(item.wins / item.totalGames) * 100}%` }}
                      className="bg-emerald-500"
                    />
                    <div
                      style={{ width: `${(item.draws / item.totalGames) * 100}%` }}
                      className="bg-neutral-500"
                    />
                    <div
                      style={{ width: `${(item.losses / item.totalGames) * 100}%` }}
                      className="bg-rose-500"
                    />
                  </div>

                  {/* Connected Openings */}
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Associated Openings in Your Games:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.openingsInvolved.map((eco) => (
                        <span
                          key={eco}
                          className="px-2 py-0.5 rounded bg-[#121214] border border-neutral-800 text-[11px] font-mono text-neutral-300"
                        >
                          {eco}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Strategic Ideas */}
                  <div className="mb-4 bg-[#121214] p-3.5 rounded-xl border border-neutral-800/80">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block mb-2">
                      Key Strategic Plans:
                    </span>
                    <ul className="space-y-1 text-xs text-neutral-300 list-disc list-inside">
                      {item.structure.keyIdeas.map((idea, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {idea}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Study Topics */}
                  <div className="bg-[#121214] p-3.5 rounded-xl border border-neutral-800/80">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block mb-2">
                      Recommended Study Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.structure.studyTopics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800 text-[11px]"
                        >
                          📚 {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
