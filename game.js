const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const nextCanvas = document.getElementById('next');
const nextContext = nextCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const bestElement = document.getElementById('best');
const speedElement = document.getElementById('speed-display');
const overlay = document.getElementById('overlay');
const gameOverScreen = document.getElementById('game-over');
const scorePopup = document.getElementById('score-popup');
const levelProgressFill = document.getElementById('level-progress-fill');
const rankDisplay = document.getElementById('rank-display');

let clearFlash = 0;
let clearFlashRows = [];
let highScore = parseInt(localStorage.getItem('tetris_high_score') || '0');

// 畫布解析度與邏輯座標的縮放比例 (480/16=30, 800/20=40) -> 我們統一使用 40 以保持方塊是正方形
const SCALE = 40;
context.scale(SCALE, SCALE);

// 重要：修正預覽框的縮放比例。原本 nextCanvas 是 80x80，現在改為 120x120
// 我們讓邏級矩陣 (例如 4x4) 填滿這 120px 的畫布 -> 120 / 4 = 30
nextContext.scale(30, 30);

function createPiece(type) {
    if (type === 'I') return [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]];
    if (type === 'L') return [[0, 2, 0], [0, 2, 0], [0, 2, 2]];
    if (type === 'J') return [[0, 3, 0], [0, 3, 0], [3, 3, 0]];
    if (type === 'O') return [[4, 4], [4, 4]];
    if (type === 'Z') return [[5, 5, 0], [0, 5, 5], [0, 0, 0]];
    if (type === 'S') return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
    if (type === 'T') return [[0, 7, 0], [7, 7, 7], [0, 0, 0]];
    return [[4, 4], [4, 4]];
}

const colors = [null, '#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE135', '#3877FF'];

function createMatrix(w, h) {
    const matrix = [];
    while (h--) matrix.push(new Array(w).fill(0));
    return matrix;
}

function drawGrid() {
    context.strokeStyle = 'rgba(13, 194, 255, 0.06)';
    context.lineWidth = 0.02;
    const cols = arena[0].length;
    const rows = arena.length;
    for (let x = 1; x < cols; x++) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, rows);
        context.stroke();
    }
    for (let y = 1; y < rows; y++) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(cols, y);
        context.stroke();
    }
}

function drawGhost() {
    if (!player.matrix) return;
    const ghostY = computeGhostY();
    if (ghostY === player.pos.y) return;
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = `rgba(${hexToRgb(colors[value])}, 0.18)`;
                context.fillRect(x + player.pos.x, y + ghostY, 1, 1);
                context.strokeStyle = `rgba(${hexToRgb(colors[value])}, 0.4)`;
                context.lineWidth = 0.04;
                context.strokeRect(x + player.pos.x, y + ghostY, 1, 1);
            }
        });
    });
}

function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
}

function hexToRgbObj(hex) {
    const h = hex.replace('#', '');
    return {
        r: parseInt(h.substring(0, 2), 16),
        g: parseInt(h.substring(2, 4), 16),
        b: parseInt(h.substring(4, 6), 16)
    };
}

function drawBlock(ctx, x, y, color) {
    const {r, g, b} = hexToRgbObj(color);
    // Precompute shade variations
    const light   = `rgb(${Math.min(255, r + 60)},  ${Math.min(255, g + 60)},  ${Math.min(255, b + 60)})`;
    const lighter = `rgb(${Math.min(255, r + 110)}, ${Math.min(255, g + 110)}, ${Math.min(255, b + 110)})`;
    const dark    = `rgb(${Math.max(0, r - 50)},    ${Math.max(0, g - 50)},    ${Math.max(0, b - 50)})`;
    const darker  = `rgb(${Math.max(0, r - 90)},    ${Math.max(0, g - 90)},    ${Math.max(0, b - 90)})`;

    // Base color
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);

    // Top half: lighter
    ctx.fillStyle = light;
    ctx.fillRect(x, y, 1, 0.5);

    // Top edge: brightest highlight (specular)
    ctx.fillStyle = lighter;
    ctx.fillRect(x, y, 1, 0.12);

    // Bottom half: darker
    ctx.fillStyle = dark;
    ctx.fillRect(x, y + 0.5, 1, 0.5);

    // Bottom edge: darkest shadow
    ctx.fillStyle = darker;
    ctx.fillRect(x, y + 0.92, 1, 0.08);

    // Right edge: ambient occlusion shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x + 0.92, y, 0.08, 1);

    // Diagonal shine (top-left to mid-right) — brushed-metal gleam
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(x, y + 0.55);
    ctx.lineTo(x + 0.55, y);
    ctx.lineTo(x + 0.55, y + 0.08);
    ctx.lineTo(x + 0.08, y + 0.55);
    ctx.closePath();
    ctx.fill();

    // Outer bevel border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.lineWidth = 0.04;
    ctx.strokeRect(x, y, 1, 1);
}

function computeGhostY() {
    let y = player.pos.y;
    while (!collideAt(arena, player.matrix, player.pos.x, y + 1)) y++;
    return y;
}

function collideAt(arena, matrix, px, py) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < matrix[y].length; ++x) {
            if (matrix[y][x] !== 0) {
                const ay = py + y, ax = px + x;
                if (ay < 0) continue;
                if (ay >= arena.length || ax < 0 || ax >= arena[0].length) return true;
                if (arena[ay][ax] !== 0) return true;
            }
        }
    }
    return false;
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width / SCALE, canvas.height / SCALE);
    drawGrid();
    drawMatrix(context, arena, { x: 0, y: 0 });
    drawGhost();
    if (player.matrix) drawMatrix(context, player.matrix, player.pos);

    if (clearFlash) {
        const alpha = clearFlash / 12;
        context.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        for (const y of clearFlashRows) {
            context.fillRect(0, y, arena[0].length, 1);
        }
        clearFlash--;
    }
}

function drawNext() {
    nextContext.fillStyle = '#111';
    nextContext.fillRect(0, 0, nextCanvas.width / 30, nextCanvas.height / 30);
    if (player.next && player.next.matrix) {
        const m = player.next.matrix;
        // 計算居中偏移量，確保方塊在預覽框內置中
        const offsetX = (4 - m[0].length) / 2;
        const offsetY = (4 - m.length) / 2;
        drawMatrix(nextContext, m, { x: offsetX, y: offsetY });
    }
}

function drawMatrix(ctx, matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(ctx, x + offset.x, y + offset.y, colors[value]);
            }
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value;
        });
    });
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) matrix.forEach(row => row.reverse());
    else matrix.reverse();
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter++;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) player.pos.x -= dir;
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0) {
                const ay = y + o.y, ax = x + o.x;
                if (ay < 0) continue;
                if (ay >= arena.length || ax < 0 || ax >= arena[0].length) return true;
                if (arena[ay][ax] !== 0) return true;
            }
        }
    }
    return false;
}

function arenaSweep() {
    let rowCount = 1;
    let scoreGained = 0;
    let linesCleared = 0;
    const fullRows = [];
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) continue outer;
        }
        fullRows.push(y);
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        scoreGained += rowCount * 10;
        rowCount *= 2;
        linesCleared++;
    }

    if (linesCleared > 0) {
        player.score += scoreGained;
        player.lines += linesCleared;

        const newLevel = Math.floor(player.score / 100) + 1;
        if (newLevel > player.level && player.level < 999) {
            player.level = newLevel;
            baseDropInterval = Math.max(50, baseDropInterval * 0.8);
            updateBackground();
        }

        if (!clearFlash) { clearFlash = 12; clearFlashRows = fullRows; }
        showScorePopup(scoreGained);
    }
}

function showScorePopup(score) {
    scorePopup.textContent = `+${score}`;
    scorePopup.classList.remove('active');
    void scorePopup.offsetWidth;
    scorePopup.classList.add('active');
}

function updateBackground() {
    const hue = (220 + (player.level - 1) * 15) % 360;
    document.body.style.background =
        `radial-gradient(circle, hsl(${hue}, 60%, 15%) 0%, hsl(${hue}, 70%, 8%) 100%)`;
}

function updateScore() {
    scoreElement.innerText = player.score;
    levelElement.innerText = player.level;
    linesElement.innerText = player.lines;
    bestElement.innerText = highScore;
    speedElement.innerText = `${Math.round(baseDropInterval)}ms`;
    // Level progress: how close to next 100-point threshold
    const currentLevelStart = (player.level - 1) * 100;
    const progress = Math.min(100, ((player.score - currentLevelStart) / 100) * 100);
    levelProgressFill.style.width = `${progress}%`;
}

function getRank(score) {
    if (score >= 5000) return { tier: 's', label: 'S · CYBER GOD' };
    if (score >= 2000) return { tier: 'a', label: 'A · ELITE' };
    if (score >= 800)  return { tier: 'b', label: 'B · PILOT' };
    return { tier: 'c', label: 'C · ROOKIE' };
}

function gameOver() {
    gameRunning = false;
    if (player.score > highScore) {
        highScore = player.score;
        localStorage.setItem('tetris_high_score', highScore.toString());
    }
    gameOverScreen.style.display = 'flex';
    document.getElementById('final-score').innerText = player.score;
    document.getElementById('final-level').innerText = player.level;
    document.getElementById('final-lines').innerText = player.lines;
    const rank = getRank(player.score);
    rankDisplay.innerHTML = `<div class="rank-badge ${rank.tier}">${rank.label}</div>`;
    document.getElementById('overlay-title').innerText = 'NEON TETRIS';
}

let baseDropInterval = 1000;

function resetGame() {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    player.level = 1;
    player.lines = 0;
    baseDropInterval = 1000;
    clearFlash = 0;
    updateBackground();
    updateScore();
    gameRunning = true;
    gameOverScreen.style.display = 'none';
    overlay.style.display = 'none';
    playerReset();
}

const arena = createMatrix(12, 20);
let gameRunning = false;
let dropCounter = 0;
let lastTime = 0;

const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    next: { matrix: createPiece('T') },
    score: 0,
    level: 1,
    lines: 0
};

function gameLoop(time = 0) {
    if (!gameRunning) return;
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > baseDropInterval) {
        playerDrop();
        dropCounter = 0;
    }
    draw();
    requestAnimationFrame(gameLoop);
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = player.next.matrix;
    player.next = { matrix: createPiece(pieces[pieces.length * Math.random() | 0]) };
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) gameOver();
    drawNext();
}

function startGame() {
    gameRunning = true;
    overlay.style.display = 'none';
    lastTime = performance.now();
    dropCounter = 0;
    playerReset();
    updateBackground();
    updateScore();
    requestAnimationFrame(gameLoop);
}

function initGame() {
    player.matrix = createPiece('T');
    bestElement.innerText = highScore;
    draw();
}

window.addEventListener('keydown', e => {
    // P (pause toggle) works in any state — must work even when game is paused
    if (e.keyCode === 80) {
        e.preventDefault();
        gameRunning = !gameRunning;
        if (gameRunning) {
            overlay.style.display = 'none';
            document.getElementById('overlay-title').innerText = 'NEON TETRIS';
            lastTime = performance.now();
            dropCounter = 0; // prevent immediate drop on resume
            requestAnimationFrame(gameLoop);
        } else {
            overlay.style.display = 'flex';
            document.getElementById('overlay-title').innerText = 'PAUSED';
        }
        return;
    }

    // R (reset) works in any state — allows reset from paused or game-over
    if (e.keyCode === 82) {
        e.preventDefault();
        resetGame();
        return;
    }

    // Other game keys only work when game is running
    if (!gameRunning) return;

    switch (e.keyCode) {
        case 37: e.preventDefault(); playerMove(-1); break;
        case 39: e.preventDefault(); playerMove(1); break;
        case 40: e.preventDefault(); playerDrop(); break;
        case 38: e.preventDefault(); playerRotate(1); break;
        case 32: // Space (Hard Drop)
            e.preventDefault();
            while (!collide(arena, player)) { player.pos.y++; }
            player.pos.y--;
            merge(arena, player);
            playerReset();
            arenaSweep();
            updateScore();
            dropCounter = 0;
            break;
    }
});

initGame();