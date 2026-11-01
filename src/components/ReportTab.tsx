import React, { useState } from 'react';
import type { AnalysisResult } from '../types';
import {
  generateMarkdownReport,
  generateJSONReport,
} from '../analysis/report';

interface ReportTabProps {
  result: AnalysisResult;
}

export const ReportTab: React.FC<ReportTabProps> = ({ result }) => {
  const [copiedType, setCopiedType] = useState<'md' | 'prompt' | 'json' | null>(null);

  const markdownReport = generateMarkdownReport(result);
  const jsonReport = generateJSONReport(result);

  const aiPrompt = `Here is my detailed Chess Weakness Report generated from my Chess.com games.
Please act as my Grandmaster Chess Coach.
Analyze my weaknesses below, specifically:
1. What opening repertoire changes should I make immediately?
2. What pawn structures should I prioritize studying first and what classic master games illustrate the right plans?
3. Give me a concrete 4-week training plan to eliminate my biggest blind spots.

---
${markdownReport}`;

  const handleCopy = (text: string, type: 'md' | 'prompt' | 'json') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownload = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Action Header Card */}
      <div className="bg-[#18181b] border border-neutral-800 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
              <span>🤖</span> AI-Optimized Export
            </div>
            <h3 className="text-lg font-bold text-white">
              Export & Share With Your Favorite AI
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
              Feed your comprehensive opening analysis into ChatGPT, Claude, Gemini, or DeepSeek to get a custom coaching plan, tactical drills, and book recommendations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Copy Coach Prompt */}
            <button
              onClick={() => handleCopy(aiPrompt, 'prompt')}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md shadow-amber-500/10 flex items-center gap-2"
            >
              <span>{copiedType === 'prompt' ? '✓ Copied Prompt!' : '📋 Copy AI Prompt'}</span>
            </button>

            {/* Download Markdown */}
            <button
              onClick={() =>
                handleDownload(
                  markdownReport,
                  `chess_weakness_${result.username}.md`,
                  'text/markdown'
                )
              }
              className="bg-[#121214] hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2"
            >
              <span>📥 Download .md</span>
            </button>

            {/* Download JSON */}
            <button
              onClick={() =>
                handleDownload(
                  jsonReport,
                  `chess_weakness_${result.username}.json`,
                  'application/json'
                )
              }
              className="bg-[#121214] hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2"
            >
              <span>📦 Download .json</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested AI Prompts Guide */}
      <div className="bg-[#141416] border border-neutral-800/80 rounded-2xl p-6">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Recommended Prompts For Your AI
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#18181b] border border-neutral-800">
            <span className="font-semibold text-amber-400 block mb-1">
              "Repertoire Fix"
            </span>
            <p className="text-neutral-400 leading-relaxed">
              "Look at my worst openings with 5+ games. What alternative sidelines or variations should I play instead that fit my playstyle?"
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#18181b] border border-neutral-800">
            <span className="font-semibold text-amber-400 block mb-1">
              "Pawn Structure Mastery"
            </span>
            <p className="text-neutral-400 leading-relaxed">
              "Based on my weak pawn structures in the report, summarize the 3 most essential plans and 2 games played by Fischer or Karpov in this structure."
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#18181b] border border-neutral-800">
            <span className="font-semibold text-amber-400 block mb-1">
              "Study Schedule"
            </span>
            <p className="text-neutral-400 leading-relaxed">
              "Design a 30-minute daily routine to patch these specific opening gaps before my next rated tournament."
            </p>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-[#18181b] border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Markdown Preview
          </h4>
          <button
            onClick={() => handleCopy(markdownReport, 'md')}
            className="text-xs text-amber-400 hover:text-amber-300 transition font-mono font-medium"
          >
            {copiedType === 'md' ? '✓ Copied!' : 'Copy raw markdown'}
          </button>
        </div>

        <pre className="bg-[#101012] border border-neutral-800/80 rounded-xl p-5 text-xs text-neutral-300 font-mono overflow-x-auto max-h-[500px] leading-relaxed select-all">
          {markdownReport}
        </pre>
      </div>
    </div>
  );
};
