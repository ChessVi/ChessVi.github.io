import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    type: 'positive' | 'negative' | 'neutral' | 'accent';
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  badge,
}) => {
  const badgeStyles = {
    positive: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    negative: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    neutral: 'bg-neutral-800 text-neutral-400 border border-neutral-700',
    accent: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  };

  return (
    <div className="bg-[#18181b] border border-neutral-800/80 rounded-xl p-5 hover:border-neutral-700 transition duration-200 shadow-lg shadow-black/20 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && <div className="text-neutral-400 p-1.5 bg-neutral-900 rounded-lg">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-neutral-100 font-mono tracking-tight">
          {value}
        </span>
        {badge && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeStyles[badge.type]}`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-neutral-500 truncate">{subtitle}</p>
      )}
    </div>
  );
};
