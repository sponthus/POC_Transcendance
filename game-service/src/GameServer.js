import { gameEventEmitter } from "./GameEventEmitter.js";

// Handles game logic for one game actually running
export default class GameServer {
    
    constructor(gameId, userId, ws) {
        this.gameId = gameId;
        this.userId = userId;
        this.ws = ws;
        this.state = 'paused';
        console.log("Game server up");

        this.scoreA = 0;
        this.scoreB = 0;

        // TODO : Don't forget to start game when player launches the game (press space ?)
        // this.startGame();
        // à chaque tick du serveur
        const game = new PongGame();
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
    }

    setHandlers() {
        this.ws.on('close', () => {
            gameEventEmitter.emitGameEvent('player:disconnected', this.gameId);
            this.destroy();
        });
        // Add handler for incoming message with paddle-move
    }

    startGame() {
        this.state = 'playing';
        gameEventEmitter.emitGameEvent('game:started', this.gameId);
    }

    endGame() {
        this.state = 'finished';
        gameEventEmitter.emitGameEvent('game:ended', this.gameId, {
            scoreA: this.scoreA,
            scoreB: this.scoreB
        });
        this.destroy();
    }

    destroy() {
        console.log("🔴 GameServer stopped");
        clearInterval(this.intervalId);
    }
}