// const fastify = require('fastify')({ logger: true });
// const proxy = require('@fastify/http-proxy');
//
// fastify.register(proxy, {
//     upstream: 'http://user-service:3001',
//     prefix: '/api/user',
//     rewritePrefix: '/'
// });
//
// fastify.register(proxy, {
//     upstream: 'http://game-service:3002',
//     prefix: '/api/games',
//     rewritePrefix: '/'
// });
//
// fastify.listen({ port: 3000, host: '0.0.0.0' }, err => {
//     if (err) throw err;
// });

import Fastify from "fastify";
// import fastifyStatic from "@fastify/static"; // Serves files in html, CSS, js, img to fastify, used in SPA for basic application
import fastifyJwt from "@fastify/jwt";
import multipart from "@fastify/multipart"; // Allows multipart API requests (ie : images)
import proxy from "@fastify/http-proxy";
import { fileURLToPath } from "url"; // Transforms ESM paths to system paths
import path from 'path'; // utilities for working with file and directory paths
import env from "../config/env.js";
// import dbConnector from "../config/db.js";
import logger from "../config/logger.js";
// import routes from "./routes.js";

const __filename = fileURLToPath(import.meta.url); // This filename, from ESM expression to classic path
export const __dirname = path.dirname(__filename); // Parent folder to this file

const app = Fastify({
    logger: logger,
});

console.log('Parameters for app are being set'); // debug

await app.register(multipart);

app.register(fastifyJwt, {
    secret: env.secret,
});

app.decorate("authenticate", async function (request, reply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        console.error("JWT error:", err);
        reply.code(401).send({ error: "Unauthorized" });
    }
});

app.register(proxy, {
    upstream: 'http://user-service:3001',
    prefix: '/api/user',
    rewritePrefix: '/',
    body: true,
    http2: false // Security
});

app.register(proxy, {
    upstream: 'http://game-service:3002',
    prefix: '/api/games',
    rewritePrefix: '/',
    body: true,
    http2: false
});

app.register(proxy, {
    upstream: 'http://upload-service:3003',
    prefix: '/api/avatars',
    rewritePrefix: '/',
    body: true,
    http2: false,
});

// await app.register(routes);

// // Default handler for undefined routes
// app.setNotFoundHandler((req, reply) => {
//     // Extension = file
//     if (req.raw.url.includes(".")) {
//         reply.status(404).send("Not found");
//     } else {
//         reply.sendFile("index.html");
//     }
// });

// Fastify listens
// TODO : port function of env
app.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Server running in ${env.nodeEnv} mode at ${address}`);
});
