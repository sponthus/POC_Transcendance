import Database from "better-sqlite3";

export default class DatabaseHandler {
    constructor(dbFile) {
        this.db = new Database(dbFile, { verbose: console.log });
        this.initializeDb();
    }
   
    initializeDb() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS tournaments (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                status TEXT NOT NULL CHECK (status IN ('pending', 'ongoing_game', 'between-games', 'canceled', 'done')),
                id_user INTEGER NOT NULL,
                name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                began_at DATETIME
                finished_at DATETIME
            );
        `);

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS games (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                status TEXT NOT NULL CHECK (status IN ('pending', 'ongoing', 'finished', 'canceled')),
                id_user INTEGER NOT NULL,
                player_a TEXT NOT NULL DEFAULT 'undefined',
                player_b TEXT NOT NULL DEFAULT 'undefined',
                score_a INTEGER DEFAULT 0,
                score_b INTEGER DEFAULT 0,
                tournament_id INTEGER REFERENCES tournaments(id),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                began_at DATETIME
                finished_at DATETIME,
                winner TEXT
            );
        `);

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS tournament_matches (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                tournament_id INTEGER REFERENCES tournaments(id),
                round INTEGER NOT NULL,
                match_number INTEGER NOT NULL,
                player_a TEXT NOT NULL DEFAULT 'TBA',
                player_b TEXT NOT NULL DEFAULT 'TBA',
                game_id INTEGER REFERENCES games(id),
                winner TEXT
            );
        `);
    }

    close() {
        this.db.close();
    }

    // Test ok
    async   createGame(userId, playerA, playerB) {
        return new Promise((resolve, reject) => {
            try {
                const stmt = this.db.prepare(`
                    INSERT INTO games (status, id_user, player_a, player_b) VALUES (?, ?, ?, ?)
                `);
                const res = stmt.run('pending', userId, playerA, playerB);
                const id = res.lastInsertRowId;
                resolve({
                    game_id: id, 
                    status: 'pending', 
                    player_a: playerA, 
                    player_b: playerB
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    // Test OK
    async   getGamesForUserId(userId) {
        return new Promise((resolve, reject) => {
            try {
                const stmt = this.db.prepare(`
                    SELECT id, status, player_a, player_b, score_a, score_b, created_at
                    FROM games
                    WHERE id_user = ? AND status = 'pending'
                    ORDER BY created_at DESC
                `);
                const res = stmt.all(userId);
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    }

    // Test ok
    async   getGame(gameId) {
        return new Promise((resolve, reject) => {
            try {
                const stmt = this.db.prepare(`
                    SELECT id, status, id_user, player_a, player_b
                    FROM games
                    WHERE id = ?
                `);
                const res = stmt.all(gameId);
                resolve(res);
        const games = statement.all(gameId);
            } catch (err) {
                reject(err);
            }
        });
    }

    // Test me please
    async   deleteGame(gameId) {
        console.log('test me plz');
        return new Promise((resolve, reject) => {
            try {
                const stmt = this.db.prepare(`
                    DELETE FROM games
                    WHERE id = ?
                `);
                const res = stmt.run(gameId);
                if (res.changes === 0) {
                    throw new Error("No game deleted with the given gameId");
                }
                resolve(res);
            } catch (error) {
                reject(error);
            }
        })
    }

    // todo update diff dates when begin / cancel / end
    async   updateGameStatus(gameId, status) {
        return new Promise((resolve, reject) => {
            try {
                const stmt = this.db.prepare(`
                    UPDATE games 
                    SET status = ? 
                    WHERE id = ?
                `);
                const res = stmt.run(status, gameId);
                if (res.changes === 0) {
                    throw new Error("No game found with the given gameId");
                }
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    }

    async   updateScore(gameId, newScoreA, newScoreB) {
        console.log("Test me !"); // TODO = Test me
        return new Promise((resolve, reject) => {
            try {
                const stmt = this.db.prepare(`
                    UPDATE games 
                    SET score_a = ?, score_b = ? 
                    WHERE id = ?
                `);
                const res = stmt.run(newScoreA, newScoreB, gameId);
                if (res.changes === 0) {
                    return reject(new Error("No game found with the given gameId"));
                }
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    }

    async recordWinner(gameId) {
        console.log("test me !");
        return new Promise((resolve, reject) => {
            try {
                const stmt = this.db.prepare(`
                    SELECT score_a, score_b, player_a, player_b 
                    FROM games
                    WHERE id = ?
                `);
                const game = stmt.get(gameId);
                if (!game)
                    reject(new Error("Game not found"));
                
                const winner = null;

                if (game.score_a > game.score_b) {
                    winner = game.player_a;
                } else if (game.score_b > game.score_a) {
                    winner = game.player_b;
                }
                const updateStmt = this.db.prepare(`
                    UPDATE game 
                    SET winner = ?, finished_at = CURRENT_TIMESTAMP 
                    WHERE id = ?
                `);
                updateStmt.run(winner, gameId);
                resolve({
                    message: `Game ${gameId} winner recorded: ${winner}`,
                    gameId,
                    winner
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}