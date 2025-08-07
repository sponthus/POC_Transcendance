import { WebSocketServer } from 'ws';
import { PongGame } from './pongGame.js';

const wss = new WebSocketServer({ port: 3002 });
//const wss = new WebSocketServer({ port: 8080, host: '0.0.0.0' });
const game = new PongGame();

// à chaque tick du serveur
setInterval(() => {
	// Appliquer les inputs pour déplacer le paddle
	game.update();
	// broadcast du nouvel état
	const stateMsg = JSON.stringify({
		type: "stateUpdate",
		gameState: game.getState()
	});

	// balance le message a tout les players connecté
	wss.clients.forEach(ws => {
		if (ws.readyState === WebSocket.OPEN)
		{
			ws.send(stateMsg);
		}
	});
}, 16); // 60fps

// quand un client se connecte
wss.on("connection", (ws) => {
	ws.on("message", (msg) => {
		let data;

		try
		{
			data = JSON.parse(msg);
		} catch (err)
		{
			console.error("ERR: JSON :", msg);
			return;
		}

		switch (data.type) {
			case "input":
				game.setInputs(data.playerId, data.input);
				break;

			case "gameMode":
				game.setGameMode(data.mode, data.option);
				break;

			default:
				console.warn("ERR: Type inconnu :", data.type);
		}
	});

});

