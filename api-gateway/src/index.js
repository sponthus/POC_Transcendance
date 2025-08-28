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
import fastifyJwt from "@fastify/jwt";
import proxy from "@fastify/http-proxy";
import rateLimit from "@fastify/rate-limit";
import { fileURLToPath } from "url"; // Transforms ESM paths to system paths
import path from 'path'; // utilities for working with file and directory paths
import env from "../config/env.js";
// import logger from "../config/logger.js";

const __filename = fileURLToPath(import.meta.url); // This filename, from ESM expression to classic path
export const __dirname = path.dirname(__filename); // Parent folder to this file

const app = Fastify({
    logger: false,
});

console.log('Parameters for app are being set'); // debug

// Protection of
// Limits requests from a specific IP :: 100 every 100 seconds
// Otherwise gives a 429 code
await app.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '100 seconds'
});

// Protection of attacks looking for valid URL by hardly protecting 404
app.setNotFoundHandler({
    preHandler: app.rateLimit({
        max: 10,
        timeWindow: '60 seconds'
    })
}, function (request, reply) {
    reply.code(404).send({ error: 'Not found' })
})

app.register(fastifyJwt, {
    secret: env.hashKey,
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
