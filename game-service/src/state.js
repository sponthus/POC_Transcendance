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
        this.clients.delete(userId);
    }

    getWsByUserId(userId) {
        return this.clients.get(userId);
    }

    getUserIdByWs(ws) {
        return this.clients.get(ws);
    }
}

export default State;