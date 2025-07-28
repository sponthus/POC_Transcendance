import fp from "fastify-plugin";
import Database from "better-sqlite3";

export default async function dbConnector(fastify, options)
{
    const db = new Database('users.db', { verbose: console.log });
    const tables = 
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        pw_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`;

    try 
    {
        db.exec(tables);
    }
    catch (err)
    {
        console.log("Error : database init failed " + err.message);
    }
    //ajout de la db a l'instance fastify pour etre appele de partout
    fastify.decorate("db", db);

    //quand fastify.close() sera utilise : appel de db.close;
    fastify.addHook("onClose", (fastify, done) => 
    {
        db.close();
        done();
    });
    
    console.log("Database Initialised");
}
