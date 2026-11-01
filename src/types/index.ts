export interface ChessComGame {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  time_class: string;
  rules: string;
  white: {
    username: string;
    rating: number;
    result: string;
  };
  black: {
    username: string;
    rating: number;
    result: string;
  };
}

export interface ParsedGame {
  id: string;
  pgn: string;
  white: { username: string; rating: number; result: string };
  black: { username: string; rating: number; result: string };
  timeClass: string;
  timeControlDetail?: string;
  date: Date;
  moves: string[];
  playerColor: 'white' | 'black';
  playerResult: 'win' | 'loss' | 'draw';
  opponentRating: number;
  opening?: OpeningInfo;
}

export interface OpeningInfo {
  eco: string;
  name: string;
  moves: string;
}

export interface OpeningStats {
  eco: string;
  name: string;
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  avgOpponentRating: number;
  performanceRating: number;
  asWhite: number;
  asBlack: number;
  recentTrend: number[];
  games?: ParsedGame[];
}

export interface PawnStructure {
  name: string;
  description: string;
  openings: string[];
  studyTopics: string[];
  keyIdeas: string[];
}

export interface AnalysisResult {
  username: string;
  totalGames: number;
  timeRange: { from: Date; to: Date };
  openingStats: OpeningStats[];
  worstOpenings: OpeningStats[];
  bestOpenings: OpeningStats[];
  pawnStructureStats: PawnStructureStats[];
  overallWinRate: number;
  avgRating: number;
  ratingHistory: { date: string; rating: number }[];
  colorStats: {
    white: { games: number; wins: number; losses: number; draws: number };
    black: { games: number; wins: number; losses: number; draws: number };
  };
}

export interface PawnStructureStats {
  structure: PawnStructure;
  totalGames: number;
  winRate: number;
  wins: number;
  losses: number;
  draws: number;
  openingsInvolved: string[];
}

export type TimeControl = 'blitz' | 'rapid' | 'both';
export type SortField = 'name' | 'games' | 'winRate' | 'losses' | 'avgRating';
export type SortDirection = 'asc' | 'desc';
