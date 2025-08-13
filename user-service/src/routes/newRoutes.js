import registerUser from "./connection/registerUser.js";
import loginUser from "./connection/loginUser.js";
import loginThroughToken from "./connection/loginThroughToken.js";
import updateUsername from "./update/updateUsername.js";
// le default permet de pas mettre les accolade dans import

//TODO
// Faire la verif de username et du pass dans register
// Faire la verif du nouveau username dans updateUsername
//Mettre a jour user info quand changement de username ou juste passer par le token ?
// pareil pour l'id, Sarah en a besoin

export default async function newRoutes(fastify, options) 
{
    //preHandler oblige l'appel de la fonction authenticate soit appele (pour verifier la validité du token)
    //avant d'excuter la fonction d'après
    //la méthode request.jwtVerify() decode le token et place les donnes du token (payload) dans request.user
    fastify.get("/protected", { preHandler : [fastify.authenticate] }, loginThroughToken);

    fastify.post("/register", registerUser);
    fastify.post("/login", loginUser);

    //pas de page de profil, fonction tester avec nc --> MARCHE :)))))))
    //faudra juste verifier qu'il prend bien le nouveau token
    fastify.put("/:slug", { preHandler: [fastify.authenticate] } , updateUsername);
    fastify.patch("/nickname", { preHandler: [fastify.authenticate] } , updateNickname);
    //fastify.put("/:slug/avatar", { preHandler: [fastify.authenticate] }, updateAvatar);
}