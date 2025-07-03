import { uploadAvatar } from "./put.controller.js";

export default async function routes(fastify, options) {
    console.log('Registering routes');

    fastify.register(
        async function (putRoutes) {
            putRoutes.put('/:slug',
                {preHandler: [fastify.authenticate]},
                uploadAvatar);
        }
    );
}