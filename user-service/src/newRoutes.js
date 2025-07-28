import bcrypt from "bcrypt";

// le default permet de pas mettre les accolade dans import


async function registerUser(request, reply) 
{
    const db = request.server.db;

    console.log("\nREQUEST :\n");
    console.log("URL : " + request.url + "\n");
    console.log("username : " + request.body.username + "\n");
    console.log("password : " + request.body.password + "\n");
    console.log("LAAAAAAAAAAAAAAAAA");

    //verifier si user et password respectent la norme

    //si user existe deja
    const existingUser = db.prepare('SELECT 1 FROM users WHERE username = ?').get(request.body.username);

    //get renvoie soit un objet sur la cmd au dessus ou un undefined
    if (existingUser) //si pas undefined
        return reply.code(409).send({error: "Username already exist"});

    //hacher mdp --> hashsync est une fonction synchrone, hash --> asynchrone
    //besoin de await pour toute fonction async

    console.log("TESTTT");

    let saltRounds = 10;//nombre de tour de calcul
    const pw_hash = bcrypt.hashSync(request.body.password, saltRounds);
    console.log("pw hashed = " + pw_hash);
    const statement = db.prepare('INSERT INTO users (username, pw_hash) VALUES (?, ?)');
    statement.run(request.body.username, pw_hash);

    //mettre status a la place de code ?? 
    reply.code(200).send({ username: request.body.username }); //mettre token, username, slug

    //consruit la reponse http (res) a partir de send : 
    // va sérialiser l’objet { token, username, slug } 
    //en JSON dans le corps de la réponse HTTP, 
    //définir les en-têtes (ex: Content-Type: application/json) et envoyer un statut HTTP 201.
    //Le client peut faire await res.json() pour récupérer les données envoyées par le serveur.

}

export default async function newRoutes(fastify, options) 
{
    console.log("LES ROUTES c'est PAR LA");

    fastify.post("/register", registerUser);
}
/*Différence entre .get() et .run() avec better-sqlite3 (ou API SQLite similaire) :

    .get(params) :

        Exécute la requête et retourne la première ligne du résultat, sous forme d'objet JavaScript.

        Utile pour les requêtes SELECT où tu attends au plus une ligne (par exemple, vérifier l’existence d’un utilisateur).

        Si aucune ligne n’est trouvée, ça retourne undefined.

    .run(params) :

        Exécute la requête, mais ne retourne pas de ligne.

        Utilisé surtout pour les requêtes INSERT, UPDATE, DELETE, c’est-à-dire des commandes qui modifient la base.

        .run() renvoie un objet info avec quelques données sur l’opération (nombre de lignes affectées, dernier ID inséré, etc.), mais pas de résultat de sélection.
*/
