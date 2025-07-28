import { gameEventEmitter } from "./GameEventEmitter.js";

// Handles game logic for 1 game actually running
export default class GameServer {
    
    constructor(gameId, userId, ws) {
        this.gameId = gameId;
        this.userId = userId;
        this.ws = ws;
        this.state = 'paused';
        console.log("Game server up");

        this.ball = {x: 50, y: 50, dx: 0, dy: 0};

        this.setHandlers();
        setInterval(() => {
            if (this.state === 'paused') {
                return;
            }
            // Calc ball position here with dx dy then send to ws the position
            // console.log("Calculating positions");
        }, 50);
    }

    setHandlers() {
        ws.on('close', () => {

            this.destroy();
            // TODO Modifier state de la partie
        });
        // Add handler for incoming message with paddle-move
    }

    startGame() {
        this.state = 'playing';

        gameEventEmitter.emitGameEvent('game:started', this.gameId);
    }
}