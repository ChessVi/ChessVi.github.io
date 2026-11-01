import type { AnalysisResult } from '../types';
import { winRateLabel } from '../utils/stats';

/**
 * Generate a comprehensive Markdown report from analysis results.
 */
export function generateMarkdownReport(result: AnalysisResult): string {
  const now = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fromDate = result.timeRange.from.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  const toDate = result.timeRange.to.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

  let md = `# ♟ Chess Weakness Analysis Report\n\n`;
  md += `**Player:** ${result.username}  \n`;
  md += `**Date Generated:** ${now}  \n`;
  md += `**Games Analyzed:** ${result.totalGames} (${fromDate} – ${toDate})  \n\n`;

  md += `---\n\n`;

  // ── Overall Stats ──
  md += `## 📊 Overall Stats\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Total Games | ${result.totalGames} |\n`;
  md += `| Win Rate | ${result.overallWinRate.toFixed(1)}% |\n`;
  md += `| Average Rating | ${Math.round(result.avgRating)} |\n`;
  md += `| Games as White | ${result.colorStats.white.games} (${result.colorStats.white.games > 0 ? ((result.colorStats.white.wins / result.colorStats.white.games) * 100).toFixed(1) : 0}% win) |\n`;
  md += `| Games as Black | ${result.colorStats.black.games} (${result.colorStats.black.games > 0 ? ((result.colorStats.black.wins / result.colorStats.black.games) * 100).toFixed(1) : 0}% win) |\n\n`;

  // ── Worst Openings ──
  md += `## 🔴 Worst Openings (Needs Work)\n\n`;
  if (result.worstOpenings.length > 0) {
    md += `| # | Opening | ECO | Games | Win% | Loss% | Suggestion |\n`;
    md += `|---|---------|-----|-------|------|-------|------------|\n`;
    result.worstOpenings.forEach((op, i) => {
      const lossRate = ((op.losses / op.totalGames) * 100).toFixed(0);
      const suggestion =
        op.winRate < 30
          ? 'Consider switching or deep study'
          : 'Study typical plans and ideas';
      md += `| ${i + 1} | ${op.name} | ${op.eco} | ${op.totalGames} | ${op.winRate.toFixed(1)}% | ${lossRate}% | ${suggestion} |\n`;
    });
  } else {
    md += `*No significant weaknesses found (try lowering the minimum games filter).*\n`;
  }
  md += `\n`;

  // ── Best Openings ──
  md += `## 🟢 Best Openings (Strengths)\n\n`;
  if (result.bestOpenings.length > 0) {
    md += `| # | Opening | ECO | Games | Win% | Perf. Rating |\n`;
    md += `|---|---------|-----|-------|------|--------------|\n`;
    result.bestOpenings.forEach((op, i) => {
      md += `| ${i + 1} | ${op.name} | ${op.eco} | ${op.totalGames} | ${op.winRate.toFixed(1)}% | ${op.performanceRating} |\n`;
    });
  } else {
    md += `*No significant strengths found.*\n`;
  }
  md += `\n`;

  // ── Full Opening Table ──
  md += `## 📋 Full Opening Breakdown\n\n`;
  md += `| ${winRateLabel(50)} | Opening | ECO | Games | W | D | L | Win% | Avg Opp |\n`;
  md += `|---|---------|-----|-------|---|---|---|------|--------|\n`;
  for (const op of result.openingStats.slice(0, 30)) {
    md += `| ${winRateLabel(op.winRate)} | ${op.name} | ${op.eco} | ${op.totalGames} | ${op.wins} | ${op.draws} | ${op.losses} | ${op.winRate.toFixed(1)}% | ${op.avgOpponentRating} |\n`;
  }
  md += `\n`;

  // ── Pawn Structure ──
  md += `## 🏗️ Pawn Structure Analysis\n\n`;
  if (result.pawnStructureStats.length > 0) {
    for (const ps of result.pawnStructureStats) {
      md += `### ${ps.structure.name}\n\n`;
      md += `${ps.structure.description}\n\n`;
      md += `- **Games:** ${ps.totalGames} | **Win Rate:** ${ps.winRate.toFixed(1)}% ${winRateLabel(ps.winRate)}\n`;
      md += `- **Related Openings:** ${ps.openingsInvolved.join(', ')}\n`;
      if (ps.winRate < 45) {
        md += `- **📚 Study Topics:**\n`;
        ps.structure.studyTopics.forEach((t) => (md += `  - ${t}\n`));
        md += `- **💡 Key Ideas:**\n`;
        ps.structure.keyIdeas.forEach((k) => (md += `  - ${k}\n`));
      }
      md += `\n`;
    }
  } else {
    md += `*Not enough games to produce pawn structure analysis.*\n\n`;
  }

  // ── Recommendations ──
  md += `## 📝 Recommendations\n\n`;
  const recs: string[] = [];

  if (result.worstOpenings.length > 0) {
    const worst = result.worstOpenings[0];
    recs.push(
      `Focus on studying the **${worst.name}** (${worst.eco}). Your win rate is only ${worst.winRate.toFixed(1)}% across ${worst.totalGames} games.`
    );
  }

  const whiteWR =
    result.colorStats.white.games > 0
      ? (result.colorStats.white.wins / result.colorStats.white.games) * 100
      : 50;
  const blackWR =
    result.colorStats.black.games > 0
      ? (result.colorStats.black.wins / result.colorStats.black.games) * 100
      : 50;

  if (whiteWR - blackWR > 10) {
    recs.push(
      `Your Black repertoire is significantly weaker than White (${blackWR.toFixed(1)}% vs ${whiteWR.toFixed(1)}%). Consider strengthening your Black openings.`
    );
  } else if (blackWR - whiteWR > 10) {
    recs.push(
      `Your White repertoire is significantly weaker than Black (${whiteWR.toFixed(1)}% vs ${blackWR.toFixed(1)}%). Consider strengthening your White openings.`
    );
  }

  const weakStructures = result.pawnStructureStats.filter(
    (ps) => ps.winRate < 40 && ps.totalGames >= 3
  );
  if (weakStructures.length > 0) {
    recs.push(
      `Study the **${weakStructures[0].structure.name}** pawn structure. Your win rate in this structure is only ${weakStructures[0].winRate.toFixed(1)}%.`
    );
  }

  if (recs.length === 0) {
    recs.push(
      'Your opening repertoire looks balanced. Focus on middle-game and endgame improvement!'
    );
  }

  recs.forEach((r, i) => (md += `${i + 1}. ${r}\n`));
  md += `\n`;

  // ── AI Prompt ──
  md += `---\n\n`;
  md += `## 🤖 AI Analysis Prompt\n\n`;
  md += `Copy and paste the following into an AI assistant for deeper analysis:\n\n`;
  md += `\`\`\`\n`;
  md += `I'm a chess player (username: ${result.username}) with an average rating of ${Math.round(result.avgRating)}.\n`;
  md += `I've analyzed ${result.totalGames} games. Here are my key stats:\n\n`;
  md += `Overall win rate: ${result.overallWinRate.toFixed(1)}%\n`;
  md += `White win rate: ${whiteWR.toFixed(1)}% | Black win rate: ${blackWR.toFixed(1)}%\n\n`;
  md += `My worst openings:\n`;
  result.worstOpenings.slice(0, 5).forEach((op) => {
    md += `- ${op.name} (${op.eco}): ${op.winRate.toFixed(1)}% win rate in ${op.totalGames} games\n`;
  });
  md += `\nMy best openings:\n`;
  result.bestOpenings.slice(0, 5).forEach((op) => {
    md += `- ${op.name} (${op.eco}): ${op.winRate.toFixed(1)}% win rate in ${op.totalGames} games\n`;
  });
  md += `\nPlease give me a detailed study plan to improve my weakest openings, suggest specific lines to learn, and recommend training exercises.\n`;
  md += `\`\`\`\n`;

  return md;
}

/**
 * Generate a JSON report for download.
 */
export function generateJSONReport(result: AnalysisResult): string {
  return JSON.stringify(
    {
      ...result,
      timeRange: {
        from: result.timeRange.from.toISOString(),
        to: result.timeRange.to.toISOString(),
      },
      generatedAt: new Date().toISOString(),
    },
    null,
    2
  );
}
