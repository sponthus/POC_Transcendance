import bcrypt from "bcrypt";
import slugify from "slugify";

// le default permet de pas mettre les accolade dans import

export default async function newRoutes(fastify, options) 
{
    console.log("LES ROUTES c'est PAR LA");

    fastify.post("/register", registerUser);
}

async function registerUser(request, reply) 
{
    const db = request.server.db;
    const avatar = 'default.jpg'
    let idUser = -1;

    console.log("\nREQUEST :\n");
    console.log("URL : " + request.url + "\n");
    console.log("username : " + request.body.username + "\n");
    console.log("password : " + request.body.password + "\n");
    console.log("LAAAAAAAAAAAAAAAAA");

    //verifier si user et password respectent la norme
    //Voir le token
    //L'avatar

    //si user existe deja
    const existingUser = db.prepare('SELECT 1 FROM users WHERE username = ?').get(request.body.username);

    //get renvoie soit un objet sur la cmd au dessus ou un undefined
    if (existingUser) //si pas undefined
        return reply.code(409).send({error: "Username already exist"});

    //hacher mdp --> hashsync est une fonction synchrone, hash --> asynchrone
    //besoin de await pour toute fonction async

    //Generer slug
    const baseSlug = slugify(request.body.username, { lower: true, strict: true });
    //verifier pas de doublon de slug
    const slug = generateUniqueSlug(baseSlug, db);

    
    let saltRounds = 10;//nombre de tour de calcul
    const pw_hash = bcrypt.hashSync(request.body.password, saltRounds);
    console.log("pw hashed = " + pw_hash);

    try 
    {
        const statement = db.prepare('INSERT INTO users (username, slug, avatar, pw_hash) VALUES (?, ?, ?, ?)');
        const result = statement.run(request.body.username, slug, avatar, pw_hash);
        idUser = result.lastInsertRowid;
        //mettre la génération du token dans le try ?
        return reply.code(200).send({ username: request.body.username, slug: slug }); //mettre token, username, slug
    }
    catch (err)
    {
        db.prepare("DELETE FROM users WHERE id = ?").run(idUser);
        console.log("ERRRRROR : " + err.message);
        request.log.error(err);
        return reply.status(500).send({ error: "User creation failed" });
    }
    
    //mettre status a la place de code ?? 

    //consruit la reponse http (res) a partir de send : 
    // va sérialiser l’objet { token, username, slug } 
    //en JSON dans le corps de la réponse HTTP, 
    //définir les en-têtes (ex: Content-Type: application/json) et envoyer un statut HTTP 201.
    //Le client peut faire await res.json() pour récupérer les données envoyées par le serveur.

}

function generateUniqueSlug(baseSlug, db)
{
    let slug = baseSlug;
    let counter = 1;

    const dbFindings = db.prepare("SELECT COUNT(*) AS count FROM users WHERE slug = ?");
    while (dbFindings.get(slug).count > 0)
    {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
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
