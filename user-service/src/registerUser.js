import bcrypt from "bcrypt";
import slugify from "slugify";

export default async function registerUser(request, reply) 
{
    const db = request.server.db;
    const avatar = 'default.jpg'
    const username = request.body.username;
    const password = request.body.password;
    let idUser = -1;

    //verifier si user et password respectent la norme
    //pourquoi le username peut pas etre defaut ?

    const existingUser = db.prepare('SELECT 1 FROM users WHERE username = ?').get(username);
    if (existingUser) ////get renvoie soit un objet sur la cmd au dessus ou un undefined
        return reply.code(409).send({error: "Username already exist"});

    //Generer slug
    const baseSlug = slugify(username, { lower: true, strict: true });
    const slug = generateUniqueSlug(baseSlug, db); //verifier pas doublon

    //Hacher mdp
    let saltRounds = 10;//nombre de tour de calcul
    const pw_hash = bcrypt.hashSync(password, saltRounds);
    try 
    {
        const statement = db.prepare('INSERT INTO users (username, slug, avatar, last_username_change, pw_hash) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)');
        const result = statement.run(username, slug, avatar, pw_hash);
        idUser = result.lastInsertRowid;
        //generation token : pas mis de date d'expiration
        const token = await reply.jwtSign({ idUser, username, slug }, {expiresIn: '1h'});
        return reply.code(200).send({ token: token, username: username, slug: slug }); //mettre token, username, slug
    }
    catch (err)
    {
        db.prepare("DELETE FROM users WHERE id = ?").run(idUser);
        console.log("ERRRREUR " + err.message);
        return (reply.code(500).send( {error : "Internal Server Error"} ));
    }
    //mettre status a la place de code ?? 
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
