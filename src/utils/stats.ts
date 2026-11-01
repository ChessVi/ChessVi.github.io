/**
 * Calculate performance rating:
 * Average of (opponent rating ± 400) depending on result.
 */
export function performanceRating(
  games: { opponentRating: number; result: 'win' | 'loss' | 'draw' }[]
): number {
  if (games.length === 0) return 0;
  let sum = 0;
  for (const g of games) {
    if (g.result === 'win') sum += g.opponentRating + 400;
    else if (g.result === 'loss') sum += g.opponentRating - 400;
    else sum += g.opponentRating;
  }
  return Math.round(sum / games.length);
}

/**
 * Calculate a trend score from recent results.
 * Returns a value between 0 and 1.
 */
export function trendScore(results: number[]): number {
  if (results.length === 0) return 0.5;
  return results.reduce((a, b) => a + b, 0) / results.length;
}

/**
 * Format a win rate as colored text (for report).
 */
export function winRateLabel(rate: number): string {
  if (rate >= 60) return '🟢';
  if (rate >= 45) return '🟡';
  return '🔴';
}

/**
 * Map Chess.com result string to our result type.
 */
export function mapResult(
  result: string
): 'win' | 'loss' | 'draw' {
  const winResults = ['win'];
  const drawResults = [
    'agreed',
    'stalemate',
    'repetition',
    'insufficient',
    'timevsinsufficient',
    '50move',
    'drawn',
  ];

  if (winResults.includes(result)) return 'win';
  if (drawResults.includes(result)) return 'draw';
  return 'loss';
}
