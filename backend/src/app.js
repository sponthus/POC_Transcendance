import Fastify from "fastify";
import fastifyStatic from "@fastify/static"; // Serves files in html, CSS, js, img to fastify, used in SPA for basic application
import { fileURLToPath } from "url";
import path from 'path';
import env from "../config/env.js";
import dbConnector from "../config/db.js";
import routes from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify({ logger: true });

// Sert les fichiers statiques (JS, CSS, images, HTML)
app.register(fastifyStatic, {
    root: path.join(__dirname, "../dist"),
    prefix: "/", // accessible depuis /
});

app.register(dbConnector);

await app.register(routes);

// Route catch-all uniquement pour les URL **sans extension**
app.setNotFoundHandler((req, reply) => {
    // Si l'URL contient un point (donc une extension), on ne sert pas index.html
    if (req.raw.url.includes(".")) {
        reply.status(404).send("Not found");
    } else {
        reply.sendFile("index.html");
    }
});

app.listen({ port: env.port, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Server running in ${env.nodeEnv} mode at ${address}`);
});