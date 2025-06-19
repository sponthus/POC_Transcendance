import Fastify from "fastify";
import multipart from "@fastify/multipart"; // Allows multipart API requests (ie : images)
import fastifyJwt from '@fastify/jwt';
import { fileURLToPath } from "url"; // Transforms ESM paths to system paths
import path from 'path'; // utilities for working with file and directory paths
import env from "../config/env.js";
import logger from "../config/logger.js";
import routes from "./routes.js";

const __filename = fileURLToPath(import.meta.url); // This filename, from ESM expression to classic path
export const __dirname = path.dirname(__filename); // Parent folder to this file

const fastify = Fastify({
    logger: logger,
});

console.log('Parameters for app are being set'); // debug

fastify.decorate("authenticate", async function (request, reply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        console.error("JWT error:", err);
        reply.send(err);
    }
});

fastify.register(fastifyJwt, {
    secret: env.secret,
});

await fastify.register(multipart);

// TODO implement routes
await fastify.register(routes);

fastify.get('/', async (req, reply) => {
    return { message: 'Upload service received your request!' };
});

// Default handler for undefined routes
fastify.setNotFoundHandler((req, reply) => {
    reply.status(404).send("Not found");
});

// Fastify listens
// TODO : Set port in env
fastify.listen({ port: 3003, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Server running in ${env.nodeEnv} mode at ${address}`);
});