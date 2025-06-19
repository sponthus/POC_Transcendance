import Fastify from "fastify";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { fileURLToPath } from "url";
import path from "path";
import env from "../config/env.js";
import logger from "../config/logger.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Init Fastify app
const app = Fastify({
    logger: logger,
});

// Route HTTP classique pour tester le service
app.get("/", async (req, reply) => {
    return { message: "Game service received your request!" };
});

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

// WebSocket server sur port 4000
const server = createServer();
const wss = new WebSocketServer({ server, path: "/ws/" });

wss.on("connection", (socket) => {
    console.log("Client connected to WS");

    socket.on("message", (msg) => {
        const data = JSON.parse(msg.toString());

        if (data.type === "join") {
            console.log("Game service received WS to join");
        }

        // TODO: Add ping/pong or broadcast logic
    });

    socket.on("close", () => {
        console.log("Client disconnected");
    });
});

server.listen(4000, () => {
    console.log("WebSocket server listening on port 4000");
});
