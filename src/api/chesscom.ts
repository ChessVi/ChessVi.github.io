const BASE_URL = 'https://api.chess.com/pub';

export async function fetchPlayerProfile(username: string) {
  const res = await fetch(`${BASE_URL}/player/${username}`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Player "${username}" not found`);
  return res.json();
}

export async function fetchPlayerStats(username: string) {
  const res = await fetch(`${BASE_URL}/player/${username}/stats`);
  if (!res.ok) throw new Error('Could not fetch player stats');
  return res.json();
}

export async function fetchGameArchives(username: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/player/${username}/games/archives`);
  if (!res.ok) throw new Error('Could not fetch game archives');
  const data = await res.json();
  return data.archives;
}

export async function fetchGamesForMonth(archiveUrl: string): Promise<any> {
  const res = await fetch(archiveUrl);
  if (!res.ok) throw new Error('Could not fetch games');
  return res.json();
}

export async function fetchAllGames(
  username: string,
  onProgress?: (loaded: number, total: number) => void
): Promise<any[]> {
  const archives = await fetchGameArchives(username);
  const allGames: any[] = [];

  for (let i = 0; i < archives.length; i++) {
    try {
      const data = await fetchGamesForMonth(archives[i]);
      if (data.games) {
        allGames.push(...data.games);
      }
    } catch (e) {
      console.warn(`Failed to fetch archive: ${archives[i]}`);
    }
    onProgress?.(i + 1, archives.length);
  }

  return allGames;
}
