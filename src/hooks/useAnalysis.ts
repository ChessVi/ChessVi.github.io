import { useMemo } from 'react';
import { calculateOpeningStats } from '../analysis/openings';
import { analyzePawnStructures } from '../analysis/structures';
import type { ParsedGame, AnalysisResult } from '../types';

export function useAnalysis(
  games: ParsedGame[],
  minGames: number,
  username: string
): AnalysisResult | null {
  return useMemo(() => {
    if (games.length === 0) return null;

    const openingStats = calculateOpeningStats(games, minGames);
    const pawnStructureStats = analyzePawnStructures(games);

    // Overall stats
    let totalWins = 0,
      totalLosses = 0,
      totalDraws = 0;
    let ratingSum = 0;

    const colorStats = {
      white: { games: 0, wins: 0, losses: 0, draws: 0 },
      black: { games: 0, wins: 0, losses: 0, draws: 0 },
    };

    // Rating history (monthly averages)
    const monthlyRatings = new Map<string, { sum: number; count: number }>();

    for (const g of games) {
      if (g.playerResult === 'win') totalWins++;
      else if (g.playerResult === 'loss') totalLosses++;
      else totalDraws++;

      const playerRating =
        g.playerColor === 'white' ? g.white.rating : g.black.rating;
      ratingSum += playerRating;

      const color = g.playerColor;
      colorStats[color].games++;
      if (g.playerResult === 'win') colorStats[color].wins++;
      else if (g.playerResult === 'loss') colorStats[color].losses++;
      else colorStats[color].draws++;

      // Monthly rating
      const monthKey = `${g.date.getFullYear()}-${String(g.date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyRatings.has(monthKey)) {
        monthlyRatings.set(monthKey, { sum: 0, count: 0 });
      }
      const entry = monthlyRatings.get(monthKey)!;
      entry.sum += playerRating;
      entry.count++;
    }

    const ratingHistory = Array.from(monthlyRatings.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { sum, count }]) => ({
        date,
        rating: Math.round(sum / count),
      }));

    // Determine worst and best openings (min 3 games for significance)
    const significantOpenings = openingStats.filter((o) => o.totalGames >= Math.max(minGames, 3));
    const worstOpenings = [...significantOpenings]
      .sort((a, b) => a.winRate - b.winRate)
      .slice(0, 5);
    const bestOpenings = [...significantOpenings]
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 5);

    const dates = games.map((g) => g.date);

    return {
      username,
      totalGames: games.length,
      timeRange: {
        from: new Date(Math.min(...dates.map((d) => d.getTime()))),
        to: new Date(Math.max(...dates.map((d) => d.getTime()))),
      },
      openingStats,
      worstOpenings,
      bestOpenings,
      pawnStructureStats,
      overallWinRate: (totalWins / games.length) * 100,
      avgRating: ratingSum / games.length,
      ratingHistory,
      colorStats,
    };
  }, [games, minGames, username]);
}
