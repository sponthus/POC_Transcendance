import { createUser, getUser, loginUser, modifyUser, modifyAvatar } from "../controllers/users.controller.js";
import { getGame } from "../controllers/games.controller.js";

export default async function routes(fastify, options) {
    console.log('Registering routes');

    // Register post routes
    fastify.register(
        async function (postRoutes) {
            // postRoutes.addHook('preHandler', async (request, reply) => {
            //     console.log('preHandler called for:', request.url);
            // });

            postRoutes.post("/user",
                createUser);
            postRoutes.post("/login",
                loginUser);
        },
        { prefix: "/api" }
    );

    // Register get routes
    fastify.register(
        async function (getRoutes) {
            getRoutes.get('/me',
                {preHandler: [fastify.authenticate]},
                async (req, reply) => {
                    // req.log.info({userId: req.user.id}, 'User accessed /me');
                    return {
                        username: req.user.username,
                        slug: req.user.slug,
                    };
                });

            getRoutes.get('/game',
                {preHandler: [fastify.authenticate]},
                getGame);

            getRoutes.get('/user/:username',
                {preHandler: [fastify.authenticate]},
                getUser);
        },
        { prefix: "/api" }
    );

    fastify.register(
        async function (putRoutes) {
            putRoutes.put('/user/:username',
                {preHandler: [fastify.authenticate]},
                modifyUser);
            putRoutes.put('/user/:username/avatar',
                {preHandler: [fastify.authenticate]},
                modifyAvatar); // TODO = Code me
        },
        { prefix: "/api" }
    );
}