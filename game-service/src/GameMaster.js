import GameServer from "./GameServer.js";

// Handles every GameServer
export default class GameMaster {
    static instance = null;

    constructor() {
        if (GameMaster.instance) {
            throw new Error("GameMaster instance already exists");
        }
        GameMaster.instance = this;
        this.clients = new Map();
        this.games = new Map();
    }

    static getInstance() {
        if (!GameMaster.instance) {
            GameMaster.instance = new GameMaster();
        }
        return GameMaster.instance;
    }

    addUser(ws, userId) {
        this.clients.set(userId, {
            ws,
            status: 'online',
            currentGame: 0
        });
    }

    deleteUser(userId) {
        const deleted = this.clients.delete(userId);
        if (deleted) {
            console.log(`User ${userId} removed. Remaining clients: ${this.clients.size}`);
        }
        return deleted;
    }

    // TODO check me, add a way to disconnect someone on purpose ?
    disconnectUser(userId) {
        // const ws = this.getWsByUserId(userId);
        // if (!ws) {
        //     console.log(`User ${userId} not found`);
        //     return;
        // }
        if (!this.isUserConnected(userId)) {
            console.log(`User ${userId} not connected when trying to disconnect`);
            return;
        }
        const client = this.clients.get(userId);
        client.status = 'disconnected';
        client.currentGame = 0;
    }

    getClientByUserId(userId) {
        return this.clients.get(userId);
    }

    getWsByUserId(userId) {
        const client = this.clients.get(userId);
        return client ? client.ws : null;
    }

    getUserIdByWs(targetWs) {
        for (const [userId, client] of this.clients.entries()) {
            if (client.ws === targetWs) {
                return userId;
            }
        }
        return null;
    }

    getAllConnectedUsers() {
        return Array.from(this.clients.keys());
    }

    isUserConnected(userId) {
        const client = this.clients.get(userId);
        return client && client.status === 'online';
    }

    getUserStatus(userId) {
        const client = this.clients.get(userId);
        if (!client)
            return 'not found';
        return client.status;
    }

    // gameId has been checked when server creation is called
    createServer(gameId, userId, maxScore) {
        const client = this.clients.get(userId);
        if (!client) {
            console.log(`user not found`);
            throw new Error('user not found for userId ' + userId);
        }
        if (!this.isUserConnected(userId)) {
            console.log(`user not connected`);
            throw new Error('User not connected: userId ' + userId);
        }
        const ws = client.ws;
        if (!ws) {
            console.log(`user ws not found`);
            throw new Error('ws not found for userId ' + userId);
        }
        client.status = 'playing';
        client.currentGame = gameId;
        this.games.set(gameId, new GameServer(gameId, userId, ws, maxScore));
    }

    // Call when a game is finished to destroy its object completely
    endServer(userId) {
        console.log('trying to delete GameServer');
        const client = this.clients.get(userId);
        if (!client) {
            console.log(`user not found`);
            throw new Error('user not found for userId ' + userId);
        }
        const gameId = client.currentGame;
        if (!gameId) {
            console.log(`user is not playing`);
            throw new Error(`user with userId ${userId} is not playing`);
        }
        if (this.games.has(gameId)) {
            this.games.delete(gameId);
            console.log("🔴 GameServer stopped");
            client.currentGame = 0;
        } else {
            console.log(`No server associated with gameId ${gameId}`);
        }
    }
}