import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { State, game_width, game_height, ball_speed, paddle_height, ball_size, paddle_padding, paddle_width, paddle_speed } from '../state.js'

const server = createServer();
const wss = new WebSocketServer({ server });
const state = State.getInstance();

let players: WebSocket[] = [];
let ball = { x: game_width / 2, y: game_height / 2, dx: ball_speed, dy: ball_speed };
let paddle_a = { pos: game_height / 2, x: paddle_padding, y: game_height / 2 - paddle_height / 2 };
let paddle_b = { pos: game_height / 2 , x: game_width - paddle_padding - paddle_width, y: game_height / 2 - paddle_height / 2 };
let playerAScore = 0;
let playerBScore = 0;

wss.on('connection', (ws: WebSocket) => {
    console.log('Player connected');
    players.push(ws);

	// Handles new client connections
    ws.on('message', (message: string) => {
        const data = JSON.parse(message.toString());
        ws.send(JSON.stringify({ type: "ballMove", x: ball.x, y: ball.y, pa: paddle_a.pos, pb: paddle_b.pos}));

        if (data.type === "join") {
            console.log(`Player ${data.player} joined`);
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: "ballMove",
                        x: ball.x,
                        y: ball.y,
                        pa: paddle_a.pos,
                        pb: paddle_b.pos }));
                    console.log(`Sent ball state`)
                }
            });
        }

        if (data.type === "move" && state.gameState === "playing")
        {
            if (data.paddle === 'a')
            {
                if (data.dir == "up")
                {
                    if (paddle_a.pos - paddle_speed >= paddle_height / 2)
                        paddle_a.pos -= paddle_speed;
                }
                else if (data.dir == "down")
                {
                    if (paddle_a.pos + paddle_speed <= game_height - paddle_height / 2)
                        paddle_a.pos += paddle_speed;
                }
                paddle_a.y = paddle_a.pos - paddle_height / 2;
            }

            if (data.paddle === 'b') {
                if (data.dir == "up") {
                    if (paddle_b.pos - ball_speed >= paddle_height / 2)
                        paddle_b.pos -= ball_speed;
                } else if (data.dir == "down") {
                    if (paddle_b.pos + ball_speed <= game_height - paddle_height / 2)
                        paddle_b.pos += ball_speed;
                }
                paddle_b.y = paddle_b.pos - paddle_height / 2;
            }

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: "ballMove",
                        x: ball.x,
                        y: ball.y,
                        pa: paddle_a.pos,
                        pb: paddle_b.pos }));
                    console.log(`Sent ball state`)
                }
            });
        }

        if (data.type === "togglePause")
        {
            if (state.gameState === "playing")
            {
                state.setGameState("paused");
                console.log("Game paused");
            }
            else if (state.gameState === "paused")
            {
                    state.setGameState("playing");
                    console.log("Game resumed");
            }

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "gameState", state: state.gameState }));
                }
            });
        }
    });

    ws.on('close', () => {
        players = players.filter(player => player !== ws);
        console.log('Player disconnected');
    });
});

function handlePaddleBounce(paddleY: number) {
    const impactY = (ball.y + ball_size / 2) - paddleY;
    const relativeImpact = impactY / (paddle_height / 2);

    const maxBounceAngle = Math.PI / 4;
    const bounceAngle = relativeImpact * maxBounceAngle;

    const speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
    ball.dx = -ball.dx;
    ball.dy = speed * Math.sin(bounceAngle);

    // Never let dy = 0
    if (Math.abs(ball.dy) < 1) {
        ball.dy = ball.dy < 0 ? -0.5 : 0.5;
    }
}

function resetBall(direction: number = 1) {
    ball.x = game_width / 2;
    ball.y = game_height / 2;
    const angle = (Math.random() * Math.PI / 2) - Math.PI / 4; // entre -45° et 45°
    ball.dx = direction * ball_speed * Math.cos(angle);
    ball.dy = ball_speed * Math.sin(angle);
}

// Not functionnal
function score(player: string) {
    if (player == "A")
    {
        playerAScore++;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: "updateScore",
                    player: "A",
                    score: playerAScore
                }));
            }
        });
    }
    else if (player == "B")
    {
        playerBScore++;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: "updateScore",
                    player: "B",
                    score: playerBScore
                }));
            }
        });
    }
}

// Simulation du déplacement de la balle
setInterval((): void => {
    if (state.gameState != "playing") return;

// Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Score to paddle_a
    if (ball.x <= 0) {
        console.log("Point pour le joueur B !");
        resetBall(1); // Goes right
        score("B");
        return;
    }

    // Score to paddle_b
    if (ball.x >= game_width - ball_size) {
        console.log("Score for player A !");
        resetBall(-1); // Goes left
        score("A");
        return;
    }

    // Always handle top and bottom wall collision
    if (ball.y <= 0) {
        ball.y = 0;
        ball.dy *= -1;
    }
    if (ball.y >= game_height - ball_size) {
        ball.y = game_height - ball_size;
        ball.dy *= -1;
    }

    // Then handle paddle collisions (left/right zones)
    const collisionA: boolean =
        ball.x <= paddle_a.x + paddle_width &&
        ball.x + ball_size >= paddle_a.x &&
        ball.y + ball_size >= paddle_a.y &&
        ball.y <= paddle_a.y + paddle_height;

    const collisionB: boolean =
        ball.x + ball_size >= paddle_b.x &&
        ball.x <= paddle_b.x + paddle_width &&
        ball.y + ball_size >= paddle_b.y &&
        ball.y <= paddle_b.y + paddle_height;

    if (collisionA) {
        handlePaddleBounce(paddle_a.pos);
    }
    else if (collisionB) {
        handlePaddleBounce(paddle_b.pos);
    }

    // Send ball position
    players.forEach(player => {
        if (player.readyState === WebSocket.OPEN) {
            player.send(JSON.stringify({
                type: "ballMove",
                x: ball.x,
                y: ball.y,
                pa: paddle_a.pos,
                pb: paddle_b.pos }));
        }
    });
    // console.log("Sending ball to", players.length, "players");
}, 50);

server.listen(8080, () => {
    console.log('WebSocket server listens on ws://localhost:8080');
});
