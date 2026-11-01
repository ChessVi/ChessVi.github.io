# ♟️ Chess Weakness Analyzer

> Discover your chess opening blind spots, analyze pawn structures, and export AI-ready coaching reports directly from your Chess.com games. Live at [chessweakness.github.io](https://chessweakness.github.io).

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

## 🌐 Deploy to `chessweakness.github.io`

1. Create a repository named `chessweakness.github.io` under your GitHub Organization `chessweakness`.
2. Push your project:
   ```bash
   git init
   git remote add origin https://github.com/chessweakness/chessweakness.github.io.git
   git add .
   git commit -m "feat: Initial Chess Weakness Analyzer release"
   git branch -M main
   git push -u origin main
   ```
3. In GitHub repo settings:
   - Go to **Settings** → **Pages**
   - Under **Build and deployment** → **Source**, select **GitHub Actions**
4. The workflow in `.github/workflows/deploy.yml` will automatically build and publish the site!
