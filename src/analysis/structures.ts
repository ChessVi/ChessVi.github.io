import type { PawnStructure, PawnStructureStats, ParsedGame } from '../types';

export const PAWN_STRUCTURES: PawnStructure[] = [
  {
    name: "Isolated Queen's Pawn (IQP)",
    description:
      "White has an isolated pawn on d4. Leads to dynamic middlegame play with piece activity vs. potential endgame weakness.",
    openings: ["D06", "D07", "D08", "D20", "D21", "D26", "D30", "D31", "D32", "C00", "C01", "B14"],
    studyTopics: [
      "IQP middlegame plans",
      "d4-d5 pawn break timing",
      "Piece activity vs structure",
      "IQP endgames",
    ],
    keyIdeas: [
      "Control e5 and c5 squares",
      "Kingside attack with pieces",
      "Avoid trades into weak endgame",
    ],
  },
  {
    name: "Carlsbad Structure",
    description:
      "Symmetric pawn chains typical of the Exchange Queen's Gambit and Exchange Caro-Kann. White often pursues a minority attack on the queenside.",
    openings: ["D35", "D36", "B13"],
    studyTopics: [
      "Minority attack (b4-b5)",
      "Kingside attack plans",
      "Central pawn breaks",
    ],
    keyIdeas: [
      "b4-b5 minority attack",
      "f3-e4 central break",
      "Good vs bad bishop",
    ],
  },
  {
    name: "French Structure",
    description:
      "White pawns on d4-e5 vs Black pawns on d5-e6. Black aims to undermine the e5 pawn with ...f6 or attack d4 with ...c5.",
    openings: ["C02", "C05", "C06", "C11", "C12", "C13", "C15", "C16", "C17", "C18", "C19"],
    studyTopics: [
      "Pawn breaks ...f6 and ...c5",
      "Kingside vs queenside attacks",
      "Bad bishop on c8 management",
    ],
    keyIdeas: [
      "Black plays ...f6 to challenge e5",
      "White attacks on the kingside",
      "Black counterattacks on the queenside with ...c5, ...a5-a4",
    ],
  },
  {
    name: "Sicilian Scheveningen",
    description:
      "Black pawns on d6-e6, creating a flexible but slightly passive setup. White often targets e6 with f4-f5.",
    openings: ["B80", "B82", "B83", "B84", "B85"],
    studyTopics: [
      "English Attack plans (f3, Be3, Qd2, g4)",
      "Classical setups with Be2",
      "...e5 vs ...d5 pawn breaks",
    ],
    keyIdeas: [
      "White attacks with f4-f5 or g4-g5",
      "Black counters with ...d5 or ...b5",
      "Central tension management",
    ],
  },
  {
    name: "Sicilian Dragon / Boleslavsky Hole",
    description:
      "Black fianchettoes the dark-squared bishop. The d5 square is a potential outpost for White.",
    openings: ["B34", "B35", "B70", "B72", "B76", "B27"],
    studyTopics: [
      "Yugoslav Attack for White",
      "Dragon endgame technique",
      "d5 outpost utilization",
    ],
    keyIdeas: [
      "White: opposite-side castling and h4-h5 attack",
      "Black: ...Rc8, ...a5-a4 queenside counterplay",
      "Exchange sacrifice on c3",
    ],
  },
  {
    name: "Stonewall Formation",
    description:
      "Pawns on c3/c6-d5-e3-f4 (for White) or ...d5-...e6-...f5 (for Black). Creates a solid but somewhat rigid structure.",
    openings: ["A92", "A80", "A81", "A87", "A90", "D00"],
    studyTopics: [
      "Light-square bishop management",
      "Ne5 outpost",
      "Kingside attack patterns",
    ],
    keyIdeas: [
      "Control e4/e5 square",
      "Avoid bad bishop problem",
      "Kingside attacking chances with f4-Qf3-Bh3",
    ],
  },
  {
    name: "King's Indian Structure",
    description:
      "Black plays ...e5 against White's d4-e4 center. After d5, the position locks up with kingside vs queenside play.",
    openings: ["E70", "E76", "E80", "E81", "E85", "E90", "E91", "E92", "E93", "E94", "E97", "E98", "E99"],
    studyTopics: [
      "Kingside pawn storm (...f5-f4-g5)",
      "Queenside expansion (c5, b4)",
      "Piece maneuvering in closed positions",
    ],
    keyIdeas: [
      "Black attacks on kingside with ...f5, ...g5, ...Rf7-Bf8",
      "White expands on the queenside with c5, a4, b4",
      "Timing of ...f4 pawn advance",
    ],
  },
  {
    name: "Benoni Structure",
    description:
      "White pawn on d5, Black pawn on c5. Asymmetric tension with White having extra central space.",
    openings: ["A56", "A57", "A60", "A61", "A70", "A43"],
    studyTopics: [
      "...b5 pawn break",
      "e6 pawn weakness",
      "Piece activity in cramped positions",
    ],
    keyIdeas: [
      "Black plays ...b5 to challenge d5",
      "White targets e6 after exd5",
      "f5 square as outpost for Black",
    ],
  },
  {
    name: "Caro-Kann Structure",
    description:
      "Solid pawn structure with pawns on d5-e6 (or d5 alone) for Black. Very stable with long-term positional play.",
    openings: ["B10", "B11", "B12", "B15", "B17", "B18", "B19"],
    studyTopics: [
      "Piece activity vs solid structure",
      "Endgame technique",
      "Pawn minority positions",
    ],
    keyIdeas: [
      "Black's solid center allows focus on piece development",
      "Challenge White's space advantage gradually",
      "Bishop pair value in open positions",
    ],
  },
  {
    name: "Symmetrical English",
    description:
      "Both sides fianchetto and develop symmetrically. Pawn structure is fluid with many transposition possibilities.",
    openings: ["A30", "A33", "A34", "A36"],
    studyTopics: [
      "Positional maneuvering",
      "Pawn break timing",
      "Piece coordination",
    ],
    keyIdeas: [
      "Avoid premature pawn advances",
      "Look for d4/d5 central break",
      "Exploit first-move advantage through timing",
    ],
  },
  {
    name: "Hedgehog Structure",
    description:
      "Black sets up pawns on a6-b6-d6-e6 behind the 4th rank, creating a flexible but compressed position.",
    openings: ["A17", "A30", "A34", "B40", "B41", "B43"],
    studyTopics: [
      "...b5 and ...d5 pawn breaks",
      "Piece placement behind the pawn chain",
      "Patience and timing in compressed positions",
    ],
    keyIdeas: [
      "Wait for the right moment to play ...b5 or ...d5",
      "Keep pieces flexible and coordinated",
      "Exploit overextension by White",
    ],
  },
  {
    name: "Maroczy Bind",
    description:
      "White controls the center with pawns on c4 and e4, restricting Black's ...d5 break. Occurs mainly in Sicilian lines.",
    openings: ["B36", "B35", "B34", "B38"],
    studyTopics: [
      "Space advantage management",
      "Restricting ...d5",
      "Minor piece exchanges",
    ],
    keyIdeas: [
      "White maintains space with c4+e4",
      "Black aims for ...b5 or ...d5 breaks",
      "Knight vs bishop dynamics",
    ],
  },
  {
    name: "Najdorf / Open Sicilian Structure",
    description:
      "Asymmetric structure arising from Open Sicilian. White has a central majority, Black has a queenside majority.",
    openings: ["B90", "B91", "B92", "B93", "B94", "B96", "B97", "B98", "B56", "B54"],
    studyTopics: [
      "Pawn structure transformation",
      "Central vs wing attacks",
      "Dynamic piece play",
    ],
    keyIdeas: [
      "Black plays ...b5 or ...e5 for counterplay",
      "White leverages central pawns for kingside attack",
      "Timing of ...d5 break is critical",
    ],
  },
  {
    name: "Grünfeld Center",
    description:
      "White builds a big center (e4+d4), Black challenges it with pieces. A battle between center control and piece pressure.",
    openings: ["D70", "D76", "D80", "D82", "D85", "D86", "D90", "D97"],
    studyTopics: [
      "Central pawn dynamics",
      "Piece pressure against the center",
      "Endgame techniques with extra center pawns",
    ],
    keyIdeas: [
      "Black undermines White's center with ...c5 and Nc6/Bg7 pressure",
      "White tries to maintain and advance central pawns",
      "Dynamic equilibrium between center and piece activity",
    ],
  },
];

/**
 * Analyze pawn structures based on the openings found in the parsed games.
 */
export function analyzePawnStructures(games: ParsedGame[]): PawnStructureStats[] {
  const results: PawnStructureStats[] = [];

  for (const structure of PAWN_STRUCTURES) {
    const matchingGames = games.filter((g) => {
      if (!g.opening) return false;
      // Match on ECO prefix – e.g., if structure has "B90", match "B90", "B91" would need its own entry
      return structure.openings.some((eco) => g.opening!.eco === eco);
    });

    if (matchingGames.length === 0) continue;

    let wins = 0,
      losses = 0,
      draws = 0;
    const openingsInvolved = new Set<string>();

    for (const g of matchingGames) {
      if (g.playerResult === 'win') wins++;
      else if (g.playerResult === 'loss') losses++;
      else draws++;
      openingsInvolved.add(g.opening!.name);
    }

    results.push({
      structure,
      totalGames: matchingGames.length,
      winRate: (wins / matchingGames.length) * 100,
      wins,
      losses,
      draws,
      openingsInvolved: Array.from(openingsInvolved),
    });
  }

  results.sort((a, b) => b.totalGames - a.totalGames);
  return results;
}
