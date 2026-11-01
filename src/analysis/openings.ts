import { ECO_DATABASE, EcoEntry } from '../data/eco';
import type { OpeningInfo, ParsedGame, OpeningStats } from '../types';

/**
 * Parse moves from PGN text.
 * Strips comments, annotations, move numbers, and result tokens.
 */
export function parseMovesFromPGN(pgn: string): string[] {
  // Remove headers (lines starting with [)
  const moveSection = pgn
    .split('\n')
    .filter((line) => !line.startsWith('[') && line.trim() !== '')
    .join(' ');

  // Remove comments { ... }
  let cleaned = moveSection.replace(/\{[^}]*\}/g, '');
  // Remove variations ( ... )
  cleaned = cleaned.replace(/\([^)]*\)/g, '');
  // Remove NAGs ($1, $2, etc.)
  cleaned = cleaned.replace(/\$\d+/g, '');
  // Remove result tokens
  cleaned = cleaned.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*/g, ' ');
  // Remove move numbers (1. or 1... )
  cleaned = cleaned.replace(/\d+\.{1,3}\s*/g, '');
  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  if (!cleaned) return [];
  return cleaned.split(' ').filter((m) => m.length > 0);
}

/**
 * Classify a game's opening by finding the longest matching ECO entry.
 * We match the game's move list against the ECO database moves arrays,
 * finding the deepest (longest) matching prefix.
 */
export function classifyOpening(moves: string[]): OpeningInfo {
  let bestMatch: EcoEntry | null = null;
  let bestLength = 0;

  for (const entry of ECO_DATABASE) {
    const ecoMoves = entry.movesArray;
    if (ecoMoves.length > moves.length) continue;

    let matched = true;
    for (let i = 0; i < ecoMoves.length; i++) {
      // Normalize: remove check/mate indicators for comparison
      const gameMoveNorm = moves[i].replace(/[+#]/, '');
      const ecoMoveNorm = ecoMoves[i].replace(/[+#]/, '');
      if (gameMoveNorm !== ecoMoveNorm) {
        matched = false;
        break;
      }
    }

    if (matched && ecoMoves.length > bestLength) {
      bestLength = ecoMoves.length;
      bestMatch = entry;
    }
  }

  if (bestMatch) {
    return {
      eco: bestMatch.eco,
      name: bestMatch.name,
      moves: bestMatch.moves,
    };
  }

  // Fallback: unclassified
  return {
    eco: '???',
    name: 'Unknown Opening',
    moves: '',
  };
}

/**
 * Calculate opening stats from a list of parsed games.
 * Groups games by opening (ECO + name), computes win/loss/draw rates,
 * performance rating, and recent trend.
 */
export function calculateOpeningStats(
  games: ParsedGame[],
  minGames: number = 1
): OpeningStats[] {
  const grouped = new Map<
    string,
    {
      eco: string;
      name: string;
      games: ParsedGame[];
    }
  >();

  for (const game of games) {
    if (!game.opening) continue;
    const key = `${game.opening.eco}:${game.opening.name}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        eco: game.opening.eco,
        name: game.opening.name,
        games: [],
      });
    }
    grouped.get(key)!.games.push(game);
  }

  const stats: OpeningStats[] = [];

  for (const [, group] of grouped) {
    if (group.games.length < minGames) continue;

    let wins = 0,
      losses = 0,
      draws = 0;
    let asWhite = 0,
      asBlack = 0;
    let totalOpponentRating = 0;
    let perfRatingSum = 0;

    // Sort by date for recent trend
    const sorted = [...group.games].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    for (const g of sorted) {
      if (g.playerResult === 'win') wins++;
      else if (g.playerResult === 'loss') losses++;
      else draws++;

      if (g.playerColor === 'white') asWhite++;
      else asBlack++;

      totalOpponentRating += g.opponentRating;

      // Performance rating contribution
      if (g.playerResult === 'win') perfRatingSum += g.opponentRating + 400;
      else if (g.playerResult === 'loss') perfRatingSum += g.opponentRating - 400;
      else perfRatingSum += g.opponentRating;
    }

    const totalGames = group.games.length;
    const recentGames = sorted.slice(-10);
    const recentTrend = recentGames.map((g) =>
      g.playerResult === 'win' ? 1 : g.playerResult === 'draw' ? 0.5 : 0
    );

    stats.push({
      eco: group.eco,
      name: group.name,
      totalGames,
      wins,
      losses,
      draws,
      winRate: (wins / totalGames) * 100,
      avgOpponentRating: Math.round(totalOpponentRating / totalGames),
      performanceRating: Math.round(perfRatingSum / totalGames),
      asWhite,
      asBlack,
      recentTrend,
    });
  }

  // Sort by total games descending
  stats.sort((a, b) => b.totalGames - a.totalGames);
  return stats;
}
