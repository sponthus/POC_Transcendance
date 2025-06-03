import { createUser, loginUser } from "../controllers/users.controller.js";

export default async function routes(fastify, options) {
    // Register post routes with /post prefix
    fastify.register(
        async function (postRoutes) {
            postRoutes.post("/", createUser);
            postRoutes.post("/login", loginUser)
        },
        { prefix: "/post" }
    );
}