import Ajv from "ajv"

export default async function updateUsername (request, reply)
{
    if (checkFormat(request) == false)
        return reply.code(400).send( {error : "Invalid format for username"} );

    const db = request.server.db;
    const newUsername = request.body.username;
    const idUser = request.user.idUser;
    const slug = request.params.slug;
    console.log("idUser  = " + idUser);

    //verifier que le username existe et qu'il est valide
    try 
    {
        /*if (checkIfUserCanUpdateUsername(db, idUser) == false) //recuperer travail ecole
            return reply.code(400).send( { error: "Username can be change only once a day" } );*/

        const alreadyExistingUser = db.prepare("SELECT * FROM users WHERE username = ?").get(newUsername);
        if (alreadyExistingUser)
            return reply.code(401).send( {error: "Username already used"} );

        db.prepare("UPDATE users SET username = ? WHERE id = ?").run(newUsername, idUser);
        db.prepare("UPDATE users SET last_username_change = CURRENT_TIMESTAMP WHERE id = ?").run(idUser);
        //mise a jour du token avec le nouveau username
        const token = await reply.jwtSign({ idUser, newUsername, slug}, {expiresIn: '1h'});
        return reply.code(200).send( { user: { newUsername, slug }, token : token } );
    }
    catch (err)
    {
        return reply.code(500).send( {error : "Internal Server Errore"} );
    }
}

function    checkFormat(request)
{
    const schema = 
    {
        type: "object",
        properties:
        {
            username: { type: "string", minLength: 3, maxLength: 15, pattern: "^(?=.*[a-zA-Z]).+$"},

        },
        required: ["username"],
        additionalProperties: false
    };
    const ajv = new Ajv();
    const contract = ajv.compile(schema);
    const valid = contract(request.body);
    if (!valid)
        return (false);
    return (true);
}

function checkIfUserCanUpdateUsername (db, idUser)
{
    const   Date = db.prepare("SELECT last_username_change FROM users WHERE id = ?").get(idUser);
    const   creationTime = new Date(Date.last_username_change);
    const   actualTime = new Date();

    const   diff = (actualTime - creationTime) / (1000 * 60 * 60);
    
}