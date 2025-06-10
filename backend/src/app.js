import Fastify from "fastify";
import fastifyStatic from "@fastify/static"; // Serves files in html, CSS, js, img to fastify, used in SPA for basic application
import fastifyJwt from "fastify-jwt";
import fastifyMultipart from "fastify-multipart"; // Allows multipart API requests (ie : images)
import { fileURLToPath } from "url"; // Transforms ESM paths to system paths
import path from 'path'; // utilities for working with file and directory paths
import env from "../config/env.js";
import dbConnector from "../config/db.js";
import logger from "../config/logger.js";
import routes from "./routes.js";

const __filename = fileURLToPath(import.meta.url); // This filename, from ESM expression to classic path
const __dirname = path.dirname(__filename); // Parent folder to this file

const app = Fastify({
    logger: logger,
});

console.log('Parameters for app are being set'); // debug

// Serves static files (JS, CSS, images, HTML)
app.register(fastifyStatic, {
    root: path.join(__dirname, "../dist"), // Builds a valid path for every system, to access ../dist
    prefix: "/", // This folder is now served at / by fastify
});

app.register(dbConnector);

app.register(fastifyMultipart);

app.register(fastifyJwt, {
    secret: env.secret,
});

app.decorate("authenticate", async function (request, reply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        console.error("JWT error:", err);
        reply.send(err);
    }
});

await app.register(routes);

// Default handler for undefined routes
app.setNotFoundHandler((req, reply) => {
    // Extension = file
    if (req.raw.url.includes(".")) {
        reply.status(404).send("Not found");
    } else {
        reply.sendFile("index.html");
    }
});

// Fastify listens
app.listen({ port: env.port, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Server running in ${env.nodeEnv} mode at ${address}`);
});