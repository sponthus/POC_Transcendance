import fp from "fastify-plugin";
import Database from "better-sqlite3";
import env from "./env.js";

// TODO = REFRESH TOKEN

// Initializes database from a file spec. in env variables, default = ./blog.db
async function dbConnector(fastify, options) {
    const dbFile = env.dbFile || "./users.db";
    const db = new Database(dbFile, { verbose: console.log });

    db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    fastify.decorate("db", db); // Makes db connection accessible throughout application as fastify.db

    fastify.addHook("onClose", (fastify, done) => {
        db.close();
        done();
    });

    console.log("Database and posts table created successfully");
}

export default fp(dbConnector);