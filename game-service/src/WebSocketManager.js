import State from './state.js';

const state = State.getInstance();

export default class WebSocketManager {
    constructor(wss) {
        this.ws = wss;
        this.initializeWebSocket();
    }

    initializeWebSocket() {
        this.ws.on('connection', (ws, request) => {
            console.log('New WebSocket connection');

            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data);
                    console.log(message);
                    this.handleMessage(ws, message);
                } catch (error) {
                    console.error('Invalid JSON:', error);
                }
            });

            ws.on('close', () => {
                console.log('Connection closed');
                this.handleDisconnection(ws);
            });
        });
    }

    handleMessage(ws, message) {
        switch(message.type) {
            case 'auth':
                this.authenticateUser(ws, message.userId);
                break;
            // case 'join_game':
            //     this.handleJoinGame(ws, message.gameId);
            //     break;
            case 'input':
                this.handlePlayerInput(ws, message);
                break;
        }
    }
    //
    // broadcastToGame(gameId, message) {
    //     const game = this.games.get(gameId);
    //     if (game) {
    //         game.players.forEach(playerId => {
    //             const client = this.clients.get(playerId);
    //             if (client?.ws.readyState === 1) { // WebSocket.OPEN
    //                 client.ws.send(JSON.stringify(message));
    //             }
    //         });
    //     }
    // }

    authenticateUser(ws, userId) {
        // Check token
        // if (!token)
        //     return ;
        if (userId) {
            state.addUser(ws, userId);
            console.log("Authenticated user = " + userId);
        }
    }

    handleDisconnection(ws) {
        const userId = state.getUserIdByWs(ws);
        if (userId) {
            state.deleteUser(userId);
            console.log("Client disconnected : " + userId);
        }
    }
}