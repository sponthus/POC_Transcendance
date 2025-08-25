
export default async function updateUsername (request, reply)
{
    const db = request.server.db;
    const newUsername = request.body.username;
    const idUser = request.user.idUser;
    const slug = request.params.slug;

    //verifier que le username existe et qu'il est valide
    try 
    {
       /* const elapsedTime = checkIfUserCanUpdateUsername(db, idUser);
        if (elapsedTime < 24)
        {
            const hoursRemaining = 24 - elapsedTime;
            return reply.code(400).send( { error: "Username can only be changed once a day : " + hoursRemaining.toFixed(1) + " hours remaining" } );
        }*/
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

function checkIfUserCanUpdateUsername (db, idUser)
{
    const   date = db.prepare("SELECT last_username_change FROM users WHERE id = ?").get(idUser);
    const   creationTime = new Date(date.last_username_change);
    const   actualTime = new Date();

    const   diff = (actualTime - creationTime) / (1000 * 60 * 60);
    console.log('diff = ', diff);
    return diff;
}