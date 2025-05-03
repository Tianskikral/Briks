const canvas = document.getElementById("canva");
const ctx = canvas.getContext("2d");

// Nastavitve igre
let ballSpeed = 1.5;
let x, y, dx, dy;
const ballRadius = 8;
const paddleHeight = 10;
const paddleWidth = 60;
let paddleX;
let rightPressed = false;
let leftPressed = false;
const brickRowCount = 3;
const brickColumnCount = 9;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const brickWidth = (canvas.width - brickOffsetLeft * 2 - brickPadding * (brickColumnCount - 1)) / brickColumnCount;
const brickHeight = 20;

let score = 0;
let gameEnded = false;
let animationId;

// Povezava na elemente iz HTML
const restartBtn = document.getElementById("restartBtn");
const endText = document.getElementById("endText");
const scoreValue = document.getElementById("scoreValue");
const gameOverMenu = document.getElementById("gameOverMenu");
const difficultyButtons = document.querySelectorAll(".diffBtn");

let bricks = [];

// Ustvari mrežo opek za igro
function initBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

// Ponastavi žogico in plošček na začetne položaje
function resetBallAndPaddle() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = ballSpeed;
    dy = -ballSpeed;
    paddleX = (canvas.width - paddleWidth) / 2;
}

// Poslušalec za pritisnjeno tipko (levo/desno)
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

// Poslušalec za spuščeno tipko (levo/desno)
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

// Preveri trk žogice z opekami in posodobi rezultat
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    scoreValue.textContent = score;
                    if (score === brickRowCount * brickColumnCount) {
                        endGame("Zmagal si! 🏆");
                    }
                }
            }
        }
    }
}

// Nariše žogico na zaslon
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffeb3b";
    ctx.fill();
    ctx.closePath();
}

// Nariše plošček
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#ffeb3b";
    ctx.fill();
    ctx.closePath();
}

// Nariše vse opeke, ki še niso uničene
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#039be5";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Glavna funkcija za risanje in posodabljanje igre
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // Trk z desno in levo steno
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;

    // Trk z zgornjim robom
    if (y + dy < ballRadius) {
        dy = -dy;

    // Trk z dnom – preveri, če je zadela plošček
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            // Realistični odboj – smer dx je odvisna od mesta, kjer je zadela plošček
            dx = 8 * ((x - (paddleX + paddleWidth / 2)) / paddleWidth);
            dy = -dy;
        } else {
            endGame("GAME OVER 😢");
            return;
        }
    }

    // Premik ploščka z levo/desno tipko
    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 4;
    else if (leftPressed && paddleX > 0) paddleX -= 4;

    // Posodobitev položaja žogice
    x += dx;
    y += dy;

    if (!gameEnded) animationId = requestAnimationFrame(draw);
}

// Zaključi igro in pokaže sporočilo
function endGame(message) {
    gameEnded = true;
    cancelAnimationFrame(animationId);
    endText.innerHTML = message;
    gameOverMenu.style.display = "block";
}

// Ponovno zažene igro
function resetGame() {
    cancelAnimationFrame(animationId);
    score = 0;
    scoreValue.textContent = score;
    gameEnded = false;
    gameOverMenu.style.display = "none";
    initBricks();
    resetBallAndPaddle();
    draw();
}

// Poslušalci za gumbe težavnosti
difficultyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        ballSpeed = Number(btn.dataset.speed);
        resetGame();
    });
});

// Poslušalci za tipke in gumb za ponovni zagon
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
restartBtn.addEventListener("click", resetGame);

// Začetna nastavitev in zagon igre
resetBallAndPaddle();
initBricks();
draw();

function credits(){
    Swal.fire({
        title: 'Vizitka',
        text: 'Tian Mermolja 4. Rb, 2024',
        icon: 'info',
        confirmButtonText: 'OK',
    })
} 

// Onemogoči Ctrl + scroll zoom
document.addEventListener('wheel', function (e) {
    if (e.ctrlKey) {
        e.preventDefault();
    }
}, { passive: false });




