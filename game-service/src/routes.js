import {createGame, getGamesForUserId, startGame} from "./game.controller.js"

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
        }
    );
}