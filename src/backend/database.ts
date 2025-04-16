// // db.ts
// import Database from 'better-sqlite3';
//
// const db = new Database('pong.db');
//
// // Crée la table si elle n'existe pas
// db.exec(`
//     CREATE TABLE IF NOT EXISTS players (
//         id TEXT PRIMARY KEY,
//         name TEXT,
//         score INTEGER DEFAULT 0
//     );
// `);
//
// export default db;
