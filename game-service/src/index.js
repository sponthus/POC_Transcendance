import Fastify from "fastify";
import { createServer } from "http";
import { fileURLToPath } from "url";
import path from "path";
import { WebSocketServer } from "ws";
import logger from "../config/logger.js";
import DatabaseConnector from "./DatabaseConnector.js";
import routes from "./routes.js";
import WebSocketManager from "./WebSocketManager.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Init Fastify app
const app = Fastify({
    logger: logger,
});

app.register(DatabaseConnector);

await app.register(routes);

// Default handler for undefined routes
app.setNotFoundHandler((req, reply) => {
    reply.status(404).send("Not found");
});

// Lancer Fastify HTTP REST API sur le port 3002
app.listen({ port: 3002, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Game API running at ${address}`);
});

// WebSocket server on port 4000
const server = createServer();
const wss = new WebSocketServer({ server, path: "/ws/" });
console.log("Ws server created");

const WSManager = new WebSocketManager(wss);

server.listen(4000, () => {
    console.log("WebSocket server listening on port 4000");
});

