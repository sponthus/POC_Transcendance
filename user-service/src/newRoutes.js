import registerUser from "./registerUser.js";
import loginUser from "./loginUser.js";
// le default permet de pas mettre les accolade dans import

export default async function newRoutes(fastify, options) 
{
    console.log("LES ROUTES c'est PAR LA");

    fastify.post("/register", registerUser);
    fastify.post("/login", loginUser);
}