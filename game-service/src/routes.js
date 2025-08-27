import { createGame, getGamesForUserId, startGame, deleteGame, getStatusForUserId } from "./game.controller.js"

export default async function routes (fastify, options) {
    console.log(`Registering routes`);

    fastify.register(
        async function (postRoutes) {
            postRoutes.post("/game",
                createGame);
            postRoutes.post("/:gameId",
                startGame);
        }
    );

    fastify.register(
        async function (getRoutes) {
            getRoutes.get(`/:userId/games`,
                getGamesForUserId);
            getRoutes.get(`/:userId/status`,
                getStatusForUserId);
        }
    );

    fastify.register(
        async function (deleteRoutes) {
            deleteRoutes.delete("/:gameId",
                deleteGame);
            }
    );
}