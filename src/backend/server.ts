import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';

const server = createServer();
const wss = new WebSocketServer({ server });

let players: WebSocket[] = [];
let ball = { x: 300, y: 200, dx: 2, dy: 2 };

wss.on('connection', (ws: WebSocket) => {
    console.log('Player connected');
    players.push(ws);

	// Handles new client connections
    ws.on('message', (message: string) => {
        const data = JSON.parse(message.toString());
        ws.send(JSON.stringify({ type: "ballMove", x: ball.x, y: ball.y }));

        if (data.type === "join") {
            console.log(`Player ${data.player} joined`);
        }
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "ballMove", x: ball.x, y: ball.y }));
                console.log(`Sent ball state`)
            }
        });
    });

    ws.on('close', () => {
        players = players.filter(player => player !== ws);
        console.log('Player disconnected');
    });
});

// Simulation du déplacement de la balle
setInterval(() => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Collision simple
    if (ball.x <= 0 || ball.x >= 600) ball.dx *= -1;
    if (ball.y <= 0 || ball.y >= 400) ball.dy *= -1;

    // Envoyer la position de la balle
    players.forEach(player => {
        if (player.readyState === WebSocket.OPEN) {
            player.send(JSON.stringify({ type: "ballMove", x: ball.x, y: ball.y }));
        }
    });
    console.log("Sending ball to", players.length, "players");
}, 50);

server.listen(8080, () => {
    console.log('WebSocket server listens on ws://localhost:8080');
});
