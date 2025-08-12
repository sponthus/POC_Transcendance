import fp from "fastify-plugin";
import Database from "better-sqlite3";
import env from "../config/env.js"; //ou c'est ? sert a quoi ?

// TODO refresh token

// Initializes database from a file spec. in env variables, default = ./blog.db
async function dbConnector(fastify, options)
{
    const dbFile = env.dbFile || "./users.db";
    const db = new Database(dbFile, { verbose: console.log });
    
    try
    {
        db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            avatar TEXT NOT NULL,
            pw_hash TEXT NOT NULL,
            last_username_change DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

        db.exec (`
        CREATE TABLE IF NOT EXISTS menu_state (
            menu_user_id INTEGER PRIMARY KEY,
            menu_x_pos INTEGER DEFAULT 0,
            menu_y_pos INTEGER DEFAULT 0,
            menu_z_pos INTEGER DEFAULT 0,
            menu_home_color INTEGER DEFAULT 0,
            asset INTEGER DEFAULT 0,
            FOREIGN KEY (menu_user_id) REFERENCES users(id)
        );
        `);
    }
    catch (err)
    {
        console.log("Error : database init failed " + err.message);
        //si db pas creer que faire ?
    }
    fastify.decorate("db", db); // Makes db connection accessible throughout application as fastify.db

    fastify.addHook("onClose", (fastify, done) => {
        db.close();
        done();
    });
    console.log("Database and posts table created successfully");
}

export default fp(dbConnector);