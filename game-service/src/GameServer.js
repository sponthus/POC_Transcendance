
// Handles game logic for 1 game actually running
export default class GameServer {
    constructor(gameId, userId, ws) {
        this.gameId = gameId;
        this.userId = userId;
        this.ws = ws;
        this.state = 'paused';
    }
}