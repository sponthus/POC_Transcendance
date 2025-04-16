import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { State } from '../state.js'

const server = createServer();
const wss = new WebSocketServer({ server });
const state = State.getInstance();

let playersWs: WebSocket[] = [];
let ball = { x: state.game_width / 2, y: state.game_height / 2, dx: state.ball_speed, dy: state.ball_speed };
let paddle_a = { pos: state.game_height / 2, x: state.paddle_padding, y: state.game_height / 2 - state.paddle_height / 2 };
let paddle_b = { pos: state.game_height / 2 , x: state.game_width - state.paddle_padding - state.paddle_width, y: state.game_height / 2 - state.paddle_height / 2 };
let playerAScore = 0;
let playerBScore = 0;

function broadcast(message: any) {
    const msg = JSON.stringify(message);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
}

wss.on('connection', (ws: WebSocket) => {
    console.log('Player connected');
    playersWs.push(ws);

	// Handles new client connections
    ws.on('message', (message: string) => {
        const data = JSON.parse(message.toString());
        ws.send(JSON.stringify({ type: "ballMove", x: ball.x, y: ball.y, pa: paddle_a.pos, pb: paddle_b.pos}));

        if (data.type === "join") {
            console.log(`Players joined for local game`);

            state.setGameState("playing");
            broadcast({
                type: "gameState",
                state: state.gameState });

            broadcast({
                type: "ballMove",
                x: ball.x,
                y: ball.y,
                pa: paddle_a.pos,
                pb: paddle_b.pos });
        }

        if (data.type === "move" && state.gameState === "playing")
        {
            if (data.paddle === 'a')
            {
                if (data.dir == "up")
                {
                    if (paddle_a.pos - state.paddle_speed >= state.paddle_height / 2)
                        paddle_a.pos -= state.paddle_speed;
                }
                else if (data.dir == "down")
                {
                    if (paddle_a.pos + state.paddle_speed <= state.game_height - state.paddle_height / 2)
                        paddle_a.pos += state.paddle_speed;
                }
                paddle_a.y = paddle_a.pos - state.paddle_height / 2;
            }

            if (data.paddle === 'b') {
                if (data.dir == "up") {
                    if (paddle_b.pos - state.ball_speed >= state.paddle_height / 2)
                        paddle_b.pos -= state.ball_speed;
                } else if (data.dir == "down") {
                    if (paddle_b.pos + state.ball_speed <= state.game_height - state.paddle_height / 2)
                        paddle_b.pos += state.ball_speed;
                }
                paddle_b.y = paddle_b.pos - state.paddle_height / 2;
            }

            broadcast({
                type: "ballMove",
                x: ball.x,
                y: ball.y,
                pa: paddle_a.pos,
                pb: paddle_b.pos });
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

            broadcast({
                type: "gameState",
                state: state.gameState });
        }
    });

    ws.on('close', () => {
        playersWs = playersWs.filter(player => player !== ws);
        console.log('Player disconnected');
    });
});

function handlePaddleBounce(paddleY: number) {
    const impactY = (ball.y + state.ball_size / 2) - paddleY;
    const relativeImpact = impactY / (state.paddle_height / 2);

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
    ball.x = state.game_width / 2;
    ball.y = state.game_height / 2;
    const angle = (Math.random() * Math.PI / 2) - Math.PI / 4; // entre -45° et 45°
    ball.dx = direction * state.ball_speed * Math.cos(angle);
    ball.dy = state.ball_speed * Math.sin(angle);
}

// Not functionnal
function score(player: string) {
    if (player == "A")
    {
        playerAScore+= 1;
        broadcast({
            type: "updateScore",
            player: "A",
            score: playerAScore
        });
    }
    else if (player == "B")
    {
        playerBScore += 1;
        broadcast({
            type: "updateScore",
            player: "B",
            score: playerBScore
        });
    }
}

// Simulation du déplacement de la balle
setInterval((): void => {
    if (state.gameState != "playing")
    {
        // console.log("game is ", state.gameState);
        return;
    }

// Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Score to paddle_a
    if (ball.x <= 0) {
        console.log("Score for player B !");
        score("B");
        resetBall(1); // Goes right
        return;
    }

    // Score to paddle_b
    if (ball.x >= state.game_width - state.ball_size) {
        console.log("Score for player A !");
        score("A");
        resetBall(-1); // Goes left
        return;
    }

    // Always handle top and bottom wall collision
    if (ball.y <= 0) {
        ball.y = 0;
        ball.dy *= -1;
    }
    if (ball.y >= state.game_height - state.ball_size) {
        ball.y = state.game_height - state.ball_size;
        ball.dy *= -1;
    }

    // Then handle paddle collisions (left/right zones)
    const collisionA: boolean =
        ball.x <= paddle_a.x + state.paddle_width &&
        ball.x + state.ball_size >= paddle_a.x &&
        ball.y + state.ball_size >= paddle_a.y &&
        ball.y <= paddle_a.y + state.paddle_height;

    const collisionB: boolean =
        ball.x + state.ball_size >= paddle_b.x &&
        ball.x <= paddle_b.x + state.paddle_width &&
        ball.y + state.ball_size >= paddle_b.y &&
        ball.y <= paddle_b.y + state.paddle_height;

    if (collisionA) {
        handlePaddleBounce(paddle_a.pos);
    }
    else if (collisionB) {
        handlePaddleBounce(paddle_b.pos);
    }

    // Send ball position
    playersWs.forEach(player => {
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
