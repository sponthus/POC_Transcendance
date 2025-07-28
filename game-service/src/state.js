import GameMaster from './GameMaster.js';
import DatabaseEventHandler from "./dbEventHandler.js";

class State {
    static instance = null;

    constructor() {
        if (State.instance) {
            throw new Error('State instance is already initialized');
        }
        State.instance = this;
        this.clients = new Map();
        this.GameMaster = GameMaster.getInstance();
    }

    static getInstance() {
        if (!State.instance) {
            State.instance = new State();
        }
        return State.instance;
    }

    addUser(ws, userId) {
        this.clients.set(userId, {
            ws,
            status: 'online',
            currentGame: null
        });
    }

    deleteUser(userId) {
        const deleted = this.clients.delete(userId);
        if (deleted) {
            console.log(`User ${userId} removed. Remaining clients: ${this.clients.size}`);
        }
        return deleted;
    }

    // TODO check me
    disconnectUser(userId) {
        const ws = this.getWsByUserId(userId);
        if (!ws) {
            console.log(`User ${userId} not found`);
            return;
        }
        if (!this.isUserConnected(userId)) {
            console.log(`User ${userId} not connected when trying to disconnect`);
            return;
        }
        const client = this.clients.get(userId);
        client.status = 'disconnected';
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

    getGameMaster() {
        return this.GameMaster;
    }
}

export default State;