# ♟️ Chess Weakness Analyzer (ChessVi)

> Discover your chess opening blind spots, analyze pawn structures, and export AI-ready coaching reports directly from your Chess.com games. Live at [chessvi.github.io](https://chessvi.github.io).

---

## ✨ Features

- **⚡ Fast & 100% Client-Side:** Connects directly to the read-only [Chess.com Public API](https://www.chess.com/news/view/published-data-api). No sign-in or backend required.
- **📉 Opening Weakness Detection:** Filter openings where you've played 5+, 10+, or 20+ games to highlight statistically significant low win rates (&lt;40%).
- **🔍 Opening Deep Dive:** View individual games with color indicators (White vs Black), opponent ratings, and 1-click links to Chess.com analysis boards.
- **🏛️ Pawn Structure Insights:** Maps ECO codes to classic pawn structures (Isolated Queen's Pawn, Carlsbad, French, Sicilian Scheveningen, Hedgehog, etc.) with key strategic plans and study recommendations.
- **🤖 AI-Friendly Export:** 1-click copy pre-built coaching prompt for ChatGPT, Claude, Gemini, or DeepSeek, plus direct `.md` and `.json` report downloads.
- **📊 Interactive Charts:** Rating trend over time, win/draw/loss distribution, and top opening win rate comparisons.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite local development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

---

## 🌐 Deploy to `chessvi.github.io`

1. Push your project to the repository `ChessVi.github.io` under organization `ChessVi`:
   ```bash
   git remote add origin https://github.com/ChessVi/ChessVi.github.io.git
   git branch -M main
   git push -u origin main
   ```
2. In GitHub repo settings:
   - Go to **Settings** → **Pages**
   - Under **Build and deployment** → **Source**, select **GitHub Actions**
3. The workflow in `.github/workflows/deploy.yml` will automatically build and publish the site!
