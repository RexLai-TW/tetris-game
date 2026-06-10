# 🧊 Tetris Pro — 俄羅斯方塊

> A cyberpunk-styled Tetris game with **999-level progression**, dynamic difficulty, and real-time visual feedback.  
> 賽博龐克風格的俄羅斯方塊，支援 999 級難度與即時視覺回饋。  
> 打開瀏覽器就能玩，免安裝、無依賴、純前端。

[![Play](https://img.shields.io/badge/▶_立即遊玩_PLAY-0DFF72?style=for-the-badge&logo=github&logoColor=black)](https://rexLai-TW.github.io/tetris-game)
![Canvas](https://img.shields.io/badge/Canvas-HT5-FFE135?style=flat-square)
![JS](https://img.shields.io/badge/vanilla-JS-F538FF?style=flat-square)
![Levels](https://img.shields.io/badge/levels-999-0DC2FF?style=flat-square)

---

## ✨ 特色 Features

| 功能 | 說明 |
|------|------|
| **999 級難度** | 每 100 分升一級，速度每次增加 20%（最快 50ms 一格） |
| **⚡ 一鍵即玩** | 任何瀏覽器打開 `index.html` 直接開始，無需安裝 |
| **🎨 動態背景** | 背景色相隨等級旋轉：深藍 → 紫 → 洋紅 |
| **💥 消行閃爍** | 消除時白閃覆蓋，漸淡消失 |
| **🏆 分數飄字** | `+10` `+20` `+40` `+80` 浮動文字向上飄移淡出 |
| **📊 即時面板** | LEVEL · SCORE · LINES · BEST · SPEED |
| **🔮 下一塊預覽** | 預留預覽框，置中顯示下一塊方塊 |
| **💾 最高分紀錄** | 自動儲存至 `localStorage`，跨場次保留 |
| **⌨️ 完整鍵盤操作** | 移動、旋轉、軟降、硬降、暫停、重開 |
| **🎯 480×800 畫布** | 2 倍放大方塊，清晰現代 |

---

## 🎮 操作 Controls

| 按鍵 | 動作 |
|------|------|
| `←` `→` | 左右移動 Move |
| `↑` | 旋轉 Rotate |
| `↓` | 加速下落 Soft Drop |
| `SPACE` | 瞬間硬降 Hard Drop |
| `P` | 暫停 / 繼續 Pause / Resume |
| `R` | 重新開始 Restart |

---

## 🖼️ 畫面示意 Layout

```
┌─────────────────────────────────────┐
│   LEVEL  15                         │
│   SCORE  1480                       │
│   LINES  23                         │
│   BEST   2000                       │
│   NEXT   [■]                       │
│                                    │
│   ← → : 移動          速度: 137ms │
│   ↑   : 旋轉                       │
│   ↓   : 加速                       │
│   SPACE: 硬降                      │
│   P   : 暫停 | R : 重開           │
├─────────────────────────────────────┤
│        ┌─────────────────┐         │
│        │   遊戲畫面       │         │
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

## 🚀 快速開始 Quick Start

```bash
# 下載專案
git clone https://github.com/RexLai-TW/tetris-game.git

# 用瀏覽器打開 — 就這樣！
start tetris-game/index.html    # Windows
open tetris-game/index.html     # macOS
```

完全無依賴、無建置步驟，純粹的 Vanilla JavaScript + Canvas。

---

## 🧠 計分系統 Scoring

| 消除行數 | 得分 | 倍率 |
|----------|------|------|
| 1 行 | 10 分 | 1 行 × 10 |
| 2 行 | 10 + 20 = 30 分 | 每行翻倍 |
| 3 行 | 10 + 20 + 40 = 70 分 | 每行翻倍 |
| 4 行（Tetris） | 10 + 20 + 40 + 80 = 150 分 | 每行翻倍 |

- **升級**：每 100 分升一級
- **落下速度** = `1000 × 0.8^(level-1)` ms（最快 50ms）
- Lv 1: 1000ms → Lv 14: ~100ms → Lv 999: 50ms

---

## 🛠️ 技術棧 Tech Stack

| 技術 | 用途 |
|------|------|
| **HTML5** | 結構 + Glassmorphism CSS |
| **Canvas API** | 遊戲渲染 (480×800, 40px 縮放) |
| **Vanilla JavaScript** | 遊戲迴圈、碰撞、旋轉、計分 |
| **CSS 動畫** | 分數飄字、動態背景 |
| **localStorage** | 最高分紀錄持久化 |

---

## 📁 檔案結構 File Structure

```
tetris-game/
├── index.html      # HTML + CSS（版面、側欄、動畫）
├── game.js         # 遊戲邏輯（方塊、碰撞、計分、等級）
├── style.css       # 獨立 CSS（未使用，全部寫在 index.html）
├── tetris.html     # 舊版備份（未使用）
└── README.md       # 本說明文件
```

---

## 📝 授權 License

MIT — 歡迎 Fork、修改、分享。
