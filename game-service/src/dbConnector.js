import fp from "fastify-plugin";
import Database from "better-sqlite3";
import env from "../config/env.js";
import DatabaseEventHandler from "./DatabaseEventHandler.js";

// TODO make me a class ? with methods to modify me ?
async function dbConnector(fastify, options) {
    const dbFile = env.gamesDbFile || "./games.db";
    const db = new Database(dbFile, { verbose: console.log });

    db.exec(`
        CREATE TABLE IF NOT EXISTS tournaments (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('pending', 'ongoing_game', 'between-games', 'canceled', 'done')),
            id_user INTEGER NOT NULL,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            finished_at DATETIME
        );
    `);

    db.exec(`
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
            finished_at DATETIME,
            winner TEXT
        );
    `);

    db.exec(`
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

    // TODO Will become this instead of db
    this.dbEventHandler = new DatabaseEventHandler(db);

    fastify.decorate('db', db);

    fastify.addHook('onClose', (fastify, done) => {
        fastify.db.close();
        done();
    });

    console.log("Database and games / tournaments tables created successfully");

    // All this = constructor, then methods = updateGameStatus, updatePlayerScore, recordFinalScores
}

export default fp(dbConnector);