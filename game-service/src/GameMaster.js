import State from "./state.js";
import GameServer from "./GameServer.js";

// Handles every GameServer
export default class GameMaster {
    static instance = null;

    constructor() {
        if (GameMaster.instance) {
            throw new Error("GameMaster instance already exists");
        }
        GameMaster.instance = this;
        this.games = new Map();
        this.state = State.getInstance();
    }

    static getInstance() {
        if (!GameMaster.instance) {
            GameMaster.instance = new GameMaster();
        }
        return GameMaster.instance;
    }

    // gameId has been checked when server creation is called
    createServer(gameId, userId) {
        const ws = this.state.getWsByUserId(userId);
        if (!ws) {
            console.log(`user ws not found`);
            throw new Error('ws not found for userId ' + userId);
        }
        if (!this.state.isUserConnected(userId)) {
            console.log(`user not connected`);
            throw new Error('not connected: userId ' + userId);
        }
        this.games.set(gameId, new GameServer(gameId, userId, ws));
    }

    // TODO = Destroy the GameServer class if game is finished
}