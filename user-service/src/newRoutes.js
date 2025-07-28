// le default permet de pas mettre les accolade dans import
export default async function newRoutes(fastify, options)
{
    console.log("LES ROUTES c'est PAR LA");

    fastify.post("/register", async (request, reply) =>
    {
        console.log("recoit requete post de user");
        console.log("\nREQUEST :\n");
        console.log("URL : " + request.url + "\n");
        console.log("username : " + request.body.username + "\n");
        console.log("password : " + request.body.password + "\n");
       

        reply.send({status : 'user received'});
    })
}