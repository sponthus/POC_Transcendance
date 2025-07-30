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

        this.setHandlers();
        this.intervalId = setInterval(() => {
            if (this.state === 'paused') {
                return;
            }
            // Calc ball position here with dx dy then send to ws the position
            // console.log("Calculating positions");
        }, 50);
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
        gameEventEmitter.emitGameEvent('game:ended', this.gameId, this.scoreA, this.scoreB);
    }

    destroy() {
        console.log("🔴 GameServer stopped");
        clearInterval(this.intervalId);
    }
}