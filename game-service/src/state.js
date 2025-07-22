class State {
    static instance = null;

    constructor() {
        if (State.instance) {
            throw new Error('State instance is already initialized');
        }
        State.instance = this;
        this.clients = new Map();
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
        return client && client.ws.readyState === 1; // WebSocket.OPEN
    }
}

export default State;