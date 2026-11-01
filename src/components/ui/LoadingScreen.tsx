import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  progress: { loaded: number; total: number };
  username: string;
}

const CHESS_QUOTES = [
  "“The pawn is the most important piece on the board; it is the soul of chess.” — François-André Danican Philidor",
  "“Tactics mean knowing what to do when there is something to do; strategy means knowing what to do when there is nothing to do.” — Savielly Tartakower",
  "“Every chess master was once a beginner.” — Irving Chernev",
  "“When you see a good move, look for a better one.” — Emanuel Lasker",
  "“Avoid the crowd. Do your own thinking independently. Be the chess player, not the chess piece.” — Ralph Charell",
  "“In chess, knowledge is a weapon, whereas imagination is the trigger.” — Garry Kasparov",
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, username }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % CHESS_QUOTES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const percentage =
    progress.total > 0
      ? Math.min(100, Math.round((progress.loaded / progress.total) * 100))
      : 5;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto px-4 text-center">
      {/* Animated Chess Icon */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/5 animate-pulse">
          ♟️
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-ping opacity-75" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        Analyzing <span className="text-amber-400">@{username}</span>
      </h2>
      <p className="text-sm text-neutral-400 mb-6">
        Retrieving monthly archives from Chess.com public servers & classifying openings...
      </p>

      {/* Progress Bar Container */}
      <div className="w-full bg-neutral-900 border border-neutral-800 rounded-full h-3.5 p-0.5 overflow-hidden shadow-inner mb-3">
        <div
          className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between w-full text-xs font-mono text-neutral-500 mb-8">
        <span>
          {progress.total > 0
            ? `${progress.loaded} / ${progress.total} months fetched`
            : 'Connecting to Chess.com API...'}
        </span>
        <span className="text-amber-400/90 font-semibold">{percentage}%</span>
      </div>

      {/* Quote */}
      <div className="p-4 rounded-xl bg-[#141414] border border-neutral-800/80 text-xs text-neutral-400 italic transition-opacity duration-500">
        {CHESS_QUOTES[quoteIndex]}
      </div>
    </div>
  );
};
