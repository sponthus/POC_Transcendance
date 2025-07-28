import { GameEventEmitter } from './GameEventEmitter.js';

// Recieves events
class DatabaseEventHandler {
    constructor(database) {
        this.db = database;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Watches for certain messages

        GameEventEmitter.on('game:started', this.handleGameStarted.bind(this));
        GameEventEmitter.on('player:disconnected', this.handlePlayerDisconnected.bind(this));
        GameEventEmitter.on('player:scored', this.handlePlayerScored.bind(this));
        GameEventEmitter.on('game:ended', this.handleGameEnded.bind(this));

        console.log('📊 Database event service listening');
    }

    async handleGameStarted(eventData) {
        console.log('💾 Updating DB: Game ended', eventData.gameId);

        try {
            await this.db.updateGameStatus(eventData.gameId, 'ongoing');
            // await this.db.recordGameEvent(eventData.gameId, 'game_started', eventData);
        } catch (error) {
            console.error('Error updating DB:', error);
            // Emit error event ?
            // EventEmitter.emitGameEvent('database:error', eventData.gameId, { error: error.message });
        }
    }

    async handlePlayerDisconnected(eventData) {
        console.log('💾 Update DB: Disconnected player', eventData);

        await this.db.updateGameStatus(eventData.gameId, 'paused');
        // await this.db.recordPlayerEvent(eventData.gameId, eventData.playerId, 'disconnected');
    }

    async handlePlayerScored(eventData) {
        console.log('💾 Loading score:', eventData);

        await this.db.updatePlayerScore(eventData.gameId, eventData.playerId, eventData.newScore);
        // await this.db.recordGameEvent(eventData.gameId, 'player_scored', eventData);
    }

    async handleGameEnded(eventData) {
        console.log('💾 Ending game in DB:', eventData.gameId);

        await this.db.updateGameStatus(eventData.gameId, 'finished');
        await this.db.recordFinalScores(eventData.gameId, eventData.finalScores);
        // await this.db.updateGameDuration(eventData.gameId, eventData.duration);
    }
}

export default DatabaseEventHandler;