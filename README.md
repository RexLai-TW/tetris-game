# 🧊 Tetris Pro — 俄羅斯方塊

> A cyberpunk-styled Tetris game with **999-level progression**, dynamic difficulty, and real-time visual feedback.  
> 賽博龐克風格的俄羅斯方塊，支援 999 級難度與即時視覺回饋。

[![Play](https://img.shields.io/badge/▶_PLAY_NOW-0DFF72?style=for-the-badge&logo=github&logoColor=black)](https://rexLai-TW.github.io/tetris-game)
![Canvas](https://img.shields.io/badge/Canvas-HT5-FFE135?style=flat-square)
![JS](https://img.shields.io/badge/vanilla-JS-F538FF?style=flat-square)
![Levels](https://img.shields.io/badge/levels-999-0DC2FF?style=flat-square)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **999 Levels** | Level up every 100 points, speed increases 20% per level (min 50ms interval) |
| **⚡ 1-Click Start** | Open `index.html` in any browser — no build tools, no install |
| **🎨 Dynamic Background** | Level-driven hue rotation from deep blue → violet → magenta |
| **💥 Line-Clear Flash** | White flash overlay fades out on every line clear |
| **🏆 Score Popup** | Floating `+10` `+20` `+40` `+80` text floats up & fades |
| **📊 Live Stats** | LEVEL · SCORE · LINES · BEST (high score) · SPEED |
| **🔮 Next Piece Preview** | Shows upcoming piece centered in a preview window |
| **💾 High Score** | Persisted in `localStorage` across sessions |
| **⌨️ Full Keyboard** | Move, rotate, soft drop, hard drop, pause, restart |
| **🎯 480×800 Canvas** | 2× enlarged blocks for a crisp, modern look |

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| `←` `→` | Move piece |
| `↑` | Rotate |
| `↓` | Soft drop (accelerate) |
| `SPACE` | Hard drop (instant place) |
| `P` | Pause / Resume |
| `R` | Restart game |

---

## 🖼️ Screenshots

```
┌─────────────────────────────────────┐
│   LEVEL  ████████████████████████  │
│   SCORE  280                       │
│   LINES  12                        │
│   BEST   280                       │
│   NEXT   [■]                       │
│                                    │
│   ← → : MOVE          SPEED: 256ms│
│   ↑   : ROTATE                     │
│   ↓   : DROP                       │
│   SPACE: HARD DROP                 │
│   P   : PAUSE | R : RESTART        │
├─────────────────────────────────────┤
│        ┌─────────────────┐         │
│        │                 │         │
│        │   ██  ██        │         │
│        │   ██  ██  ██    │         │
│        │      ██  ██     │         │
│        │   ██  ██  ██    │         │
│        │   ██  ██  ██ ██ │         │
│        │   ██  ██  ██ ██ │         │
│        └─────────────────┘         │
└─────────────────────────────────────┘
```

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/RexLai-TW/tetris-game.git

# Open in browser — that's it!
open tetris-game/index.html
```

No dependencies. No build steps. Just pure vanilla JavaScript + Canvas.

---

## 🧠 Scoring System

| Lines Cleared | Score | Progression |
|--------------|-------|-------------|
| 1 line | 10 pts | 1 line × 10 |
| 2 lines | 10 + 20 = 30 pts | Doubles each line |
| 3 lines | 10 + 20 + 40 = 70 pts | Doubles each line |
| 4 lines (Tetris) | 10 + 20 + 40 + 80 = 150 pts | Doubles each line |

- **Level up** every 100 points
- **Drop speed** = `baseInterval × 0.8^level` (min 50ms)
- At level 1: 1000ms per drop → Level 14: ~100ms → Level 999: 50ms

---

## 🛠️ Tech Stack

- **HTML5** — Structure & glassmorphism CSS
- **Canvas API** — Game rendering (480×800, 40px scale)
- **Vanilla JavaScript** — Game loop, collision, rotation, scoring
- **CSS Animations** — Score popup, dynamic background
- **localStorage** — High score persistence

---

## 📁 File Structure

```
tetris-game/
├── index.html      # HTML + CSS (layout, sidebar, animations)
├── game.js         # Game logic (piece, collision, scoring, levels)
├── style.css       # (standalone, unused — all CSS in index.html)
├── tetris.html     # (previous version, unused)
└── README.md       # You are here
```

---

## 📝 License

MIT — feel free to fork, modify, and share.
