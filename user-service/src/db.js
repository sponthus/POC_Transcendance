import fp from "fastify-plugin";
import Database from "better-sqlite3";
import env from "../config/env.js";

// TODO refresh token

// Initializes database from a file spec. in env variables, default = ./blog.db
async function dbConnector(fastify, options) {
    const dbFile = env.dbFile || "./users.db";
    const db = new Database(dbFile, { verbose: console.log });

    //enlever temporairement

    try {
        db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            avatar TEXT NOT NULL,
            pw_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    }
    catch (err)
    {
        console.log("Error : database init failed " + err.message);
    }
    fastify.decorate("db", db); // Makes db connection accessible throughout application as fastify.db

    fastify.addHook("onClose", (fastify, done) => {
        db.close();
        done();
    });

    console.log("Database and posts table created successfully");
}

export default fp(dbConnector);