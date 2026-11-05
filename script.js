
const field = document.getElementById("field");

const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const ball = document.getElementById("ball");

const score1Text = document.getElementById("score1");
const score2Text = document.getElementById("score2");
const message = document.getElementById("message");
const restart = document.getElementById("restart");

let keys = {};

let width = field.clientWidth;
let height = field.clientHeight;

let p1;
let p2;
let b;

let ballSpeed = { x: 0, y: 0 };

let score1 = 0;
let score2 = 0;

let goalTime = 0;

const playerSize = 55;
const playerHeight = 75;
const ballSize = 35;

function resetPositions() {
    p1 = { x: width * 0.2, y: height / 2 - 37 };
    p2 = { x: width * 0.8 - playerSize, y: height / 2 - 37 };

    b = {
        x: width / 2 - ballSize / 2,
        y: height / 2 - ballSize / 2
    };

    ballSpeed = { x: 0, y: 0 };

    player1.src = "player1.png";
    player2.src = "player2.png";
}

document.addEventListener("keydown", function(e) {
    keys[e.key.toLowerCase()] = true;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
});

document.addEventListener("keyup", function(e) {
    keys[e.key.toLowerCase()] = false;
});

function updateAnimation(player, movement, png, gif) {
    let moving = movement.dx !== 0 || movement.dy !== 0;

    let image = moving ? gif : png;

    if (!player.src.endsWith(image)) {
        player.src = image;
    }
}

function movePlayer(player, controls, speed) {
    let dx = 0;
    let dy = 0;

    if (keys[controls.left]) dx--;
    if (keys[controls.right]) dx++;
    if (keys[controls.up]) dy--;
    if (keys[controls.down]) dy++;

    let length = Math.hypot(dx, dy);

    if (length > 0) {
        dx /= length;
        dy /= length;
    }

    player.x += dx * speed;
    player.y += dy * speed;

    player.x = Math.max(0, Math.min(width - playerSize, player.x));
    player.y = Math.max(0, Math.min(height - playerHeight, player.y));

    return { dx, dy };
}

function collision(player, movement) {
    let px = player.x + playerSize / 2;
    let py = player.y + playerHeight / 2;

    let bx = b.x + ballSize / 2;
    let by = b.y + ballSize / 2;

    let dx = bx - px;
    let dy = by - py;

    let distance = Math.hypot(dx, dy);
    let minDistance = 45;

    if (distance < minDistance) {
        let nx = distance === 0 ? movement.dx : dx / distance;
        let ny = distance === 0 ? movement.dy : dy / distance;

        if (distance === 0 && nx === 0 && ny === 0) {
            nx = 1;
        }

        b.x += nx * (minDistance - distance);
        b.y += ny * (minDistance - distance);

        ballSpeed.x += nx * 4 + movement.dx * 2;
        ballSpeed.y += ny * 4 + movement.dy * 2;
    }
}

function moveBall() {
    b.x += ballSpeed.x;
    b.y += ballSpeed.y;

    ballSpeed.x *= 0.98;
    ballSpeed.y *= 0.98;

    if (b.y < 0 || b.y > height - ballSize) {
        ballSpeed.y *= -0.7;
    }

    b.y = Math.max(0, Math.min(height - ballSize, b.y));

    if (b.x <= 0) {
        if (b.y + ballSize / 2 >= height / 2 - 55 &&
            b.y + ballSize / 2 <= height / 2 + 55) {
            goal(2);
        } else {
            b.x = 0;
            ballSpeed.x *= -0.7;
        }
    }

    if (b.x >= width - ballSize) {
        if (b.y + ballSize / 2 >= height / 2 - 55 &&
            b.y + ballSize / 2 <= height / 2 + 55) {
            goal(1);
        } else {
            b.x = width - ballSize;
            ballSpeed.x *= -0.7;
        }
    }
}

function goal(player) {
    if (goalTime > 0) return;

    goalTime = 90;

    if (player === 1) {
        score1++;
        score1Text.textContent = score1;
        message.textContent = "PLAYER 1 SCORED!";
    } else {
        score2++;
        score2Text.textContent = score2;
        message.textContent = "PLAYER 2 SCORED!";
    }

    resetPositions();
}

function gameLoop() {
    width = field.clientWidth;
    height = field.clientHeight;

    if (goalTime > 0) {
        goalTime--;

        if (goalTime === 0) {
            message.textContent = "GAME START!";
        }
    } else {
        let m1 = movePlayer(p1, {
            left: "a",
            right: "d",
            up: "w",
            down: "s"
        }, 4);

        let m2 = movePlayer(p2, {
            left: "arrowleft",
            right: "arrowright",
            up: "arrowup",
            down: "arrowdown"
        }, 4);

        updateAnimation(player1, m1, "player1.png", "player1.gif");
        updateAnimation(player2, m2, "player2.png", "player2.gif");

        collision(p1, m1);
        collision(p2, m2);

        moveBall();
    }

    player1.style.left = p1.x + "px";
    player1.style.top = p1.y + "px";

    player2.style.left = p2.x + "px";
    player2.style.top = p2.y + "px";

    ball.style.left = b.x + "px";
    ball.style.top = b.y + "px";

    requestAnimationFrame(gameLoop);
}

restart.addEventListener("click", function() {
    score1 = 0;
    score2 = 0;

    score1Text.textContent = 0;
    score2Text.textContent = 0;

    goalTime = 0;
    message.textContent = "GAME START!";

    resetPositions();
});

resetPositions();
gameLoop();
