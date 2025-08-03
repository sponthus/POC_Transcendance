import registerUser from "./registerUser.js";
import loginUser from "./loginUser.js";
import loginThroughToken from "./loginThroughToken.js";
// le default permet de pas mettre les accolade dans import

export default async function newRoutes(fastify, options) 
{
    //preHandler oblige l'appel de la fonction authenticate soit appele (pour verifier la validité du token)
    //avant d'excuter la fonction d'après
    //la méthode request.jwtVerify() decode le token et place les donnes du token (payload) dans request.user
    fastify.get("/protected", { preHandler : [fastify.authenticate] }, loginThroughToken);

    fastify.post("/register", registerUser);
    fastify.post("/login", loginUser);

    
}