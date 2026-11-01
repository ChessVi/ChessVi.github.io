import { useState, useCallback } from 'react';
import { fetchAllGames, fetchPlayerProfile, fetchPlayerStats } from '../api/chesscom';
import { parseMovesFromPGN, classifyOpening } from '../analysis/openings';
import { mapResult } from '../utils/stats';
import type { ParsedGame, TimeControl, ChessComGame } from '../types';

interface UseChesscomReturn {
  games: ParsedGame[];
  loading: boolean;
  error: string | null;
  progress: { loaded: number; total: number };
  profile: any;
  playerStats: any;
  fetchData: (username: string, timeControl: TimeControl) => Promise<void>;
}

export function useChesscom(): UseChesscomReturn {
  const [games, setGames] = useState<ParsedGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [profile, setProfile] = useState<any>(null);
  const [playerStats, setPlayerStats] = useState<any>(null);

  const fetchData = useCallback(
    async (username: string, timeControl: TimeControl) => {
      setLoading(true);
      setError(null);
      setGames([]);
      setProgress({ loaded: 0, total: 0 });

      try {
        // Fetch profile and stats in parallel
        const [profileData, statsData] = await Promise.all([
          fetchPlayerProfile(username).catch(() => null),
          fetchPlayerStats(username).catch(() => null),
        ]);
        setProfile(profileData);
        setPlayerStats(statsData);

        // Fetch all games
        const rawGames = await fetchAllGames(username, (loaded, total) => {
          setProgress({ loaded, total });
        });

        // Filter by time control and rules
        const filtered = rawGames.filter((g: ChessComGame) => {
          if (g.rules !== 'chess') return false;
          if (timeControl === 'both') return g.time_class === 'blitz' || g.time_class === 'rapid';
          return g.time_class === timeControl;
        });

        // Parse each game
        const parsed: ParsedGame[] = filtered.map((g: ChessComGame, idx: number) => {
          const userLower = username.toLowerCase();
          const isWhite = g.white.username.toLowerCase() === userLower;
          const playerColor = isWhite ? 'white' : 'black';
          const playerResultRaw = isWhite ? g.white.result : g.black.result;
          const playerResult = mapResult(playerResultRaw);
          const opponentRating = isWhite ? g.black.rating : g.white.rating;

          const moves = parseMovesFromPGN(g.pgn);
          const opening = classifyOpening(moves);

          return {
            id: `${g.end_time}-${idx}`,
            pgn: g.pgn,
            white: g.white,
            black: g.black,
            timeClass: g.time_class,
            date: new Date(g.end_time * 1000),
            moves,
            playerColor: playerColor as 'white' | 'black',
            playerResult,
            opponentRating,
            opening,
          };
        });

        // Sort by date
        parsed.sort((a, b) => a.date.getTime() - b.date.getTime());
        setGames(parsed);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { games, loading, error, progress, profile, playerStats, fetchData };
}
