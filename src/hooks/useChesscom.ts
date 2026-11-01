import { useState, useCallback } from 'react';
import { fetchAllGames, fetchPlayerProfile, fetchPlayerStats } from '../api/chesscom';
import { parseMovesFromPGN, classifyOpening } from '../analysis/openings';
import { mapResult } from '../utils/stats';
import type { ParsedGame, TimeControl, ChessComGame } from '../types';

export interface ChessViBackup {
  version: '1.0';
  exportedAt: string;
  username: string;
  timeControl: TimeControl;
  gamesCount: number;
  profile: any;
  playerStats: any;
  games: ParsedGame[];
}

interface UseChesscomReturn {
  games: ParsedGame[];
  loading: boolean;
  error: string | null;
  progress: { loaded: number; total: number };
  profile: any;
  playerStats: any;
  isFromCache: boolean;
  lastUpdated: string | null;
  fetchData: (username: string, timeControl: TimeControl, forceRefresh?: boolean) => Promise<void>;
  importDataset: (backupData: ChessViBackup) => boolean;
}

export function useChesscom(): UseChesscomReturn {
  const [games, setGames] = useState<ParsedGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [profile, setProfile] = useState<any>(null);
  const [playerStats, setPlayerStats] = useState<any>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const getCacheKey = (username: string, tc: TimeControl) =>
    `chessvi_cache_${username.trim().toLowerCase()}_${tc}`;

  // 1. Import a previously exported JSON backup
  const importDataset = useCallback((backup: ChessViBackup): boolean => {
    try {
      if (!backup || !backup.username || !Array.isArray(backup.games)) {
        throw new Error('Invalid ChessVi backup format');
      }

      const reconstituted: ParsedGame[] = backup.games.map((g) => ({
        ...g,
        date: new Date(g.date),
      }));

      setProfile(backup.profile || null);
      setPlayerStats(backup.playerStats || null);
      setGames(reconstituted);
      setIsFromCache(true);
      setLastUpdated(backup.exportedAt || new Date().toISOString());
      setError(null);

      // Save to localStorage as cache
      try {
        const cacheKey = getCacheKey(backup.username, backup.timeControl || 'both');
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            profile: backup.profile,
            playerStats: backup.playerStats,
            games: backup.games,
            savedAt: backup.exportedAt || new Date().toISOString(),
          })
        );
      } catch (e) {
        console.warn('LocalStorage quota exceeded for backup save', e);
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to import dataset');
      return false;
    }
  }, []);

  // 2. Fetch data (with local cache check first!)
  const fetchData = useCallback(
    async (username: string, timeControl: TimeControl, forceRefresh = false) => {
      const cleanUser = username.trim().toLowerCase();
      const cacheKey = getCacheKey(cleanUser, timeControl);

      // Check cache if not forcing refresh
      if (!forceRefresh) {
        try {
          const cachedRaw = localStorage.getItem(cacheKey);
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw);
            if (cached && Array.isArray(cached.games) && cached.games.length > 0) {
              const reconstituted: ParsedGame[] = cached.games.map((g: any) => ({
                ...g,
                date: new Date(g.date),
              }));
              setProfile(cached.profile || null);
              setPlayerStats(cached.playerStats || null);
              setGames(reconstituted);
              setIsFromCache(true);
              setLastUpdated(cached.savedAt || null);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn('Failed to read from localStorage cache', e);
        }
      }

      // If not cached or force refreshing: Fetch from Chess.com API
      setLoading(true);
      setError(null);
      setProgress({ loaded: 0, total: 0 });
      setIsFromCache(false);

      try {
        // Fetch profile and stats in parallel
        const [profileData, statsData] = await Promise.all([
          fetchPlayerProfile(cleanUser).catch(() => null),
          fetchPlayerStats(cleanUser).catch(() => null),
        ]);
        setProfile(profileData);
        setPlayerStats(statsData);

        // Fetch all games
        const rawGames = await fetchAllGames(cleanUser, (loaded, total) => {
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
          const isWhite = g.white.username.toLowerCase() === cleanUser;
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
            timeControlDetail: g.time_control,
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

        const nowIso = new Date().toISOString();
        setLastUpdated(nowIso);

        // Cache parsed games in localStorage
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              profile: profileData,
              playerStats: statsData,
              games: parsed,
              savedAt: nowIso,
            })
          );
        } catch (e) {
          console.warn('LocalStorage quota exceeded, skipping local cache save', e);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching games');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    games,
    loading,
    error,
    progress,
    profile,
    playerStats,
    isFromCache,
    lastUpdated,
    fetchData,
    importDataset,
  };
}
