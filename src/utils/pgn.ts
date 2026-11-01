/**
 * Extract a header value from a PGN string.
 */
export function extractPGNHeader(pgn: string, header: string): string | null {
  const regex = new RegExp(`\\[${header}\\s+"([^"]*)"\\]`);
  const match = pgn.match(regex);
  return match ? match[1] : null;
}

/**
 * Extract the result from PGN.
 */
export function extractResult(pgn: string): string {
  return extractPGNHeader(pgn, 'Result') || '*';
}

/**
 * Extract the date from PGN.
 */
export function extractDate(pgn: string): Date {
  const dateStr = extractPGNHeader(pgn, 'UTCDate') || extractPGNHeader(pgn, 'Date');
  if (dateStr) {
    const [y, m, d] = dateStr.split('.').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }
  return new Date();
}

/**
 * Extract the opening name from PGN header (if present).
 */
export function extractOpeningFromPGN(pgn: string): string | null {
  return extractPGNHeader(pgn, 'ECO');
}
