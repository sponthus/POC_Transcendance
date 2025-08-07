
export default async function updateUsername (request, reply)
{
    const db = request.server.db;
    const newUsername = request.body.username;
    const idUser = request.user.idUser;
    const slug = request.params.slug;
    console.log("idUser  = " + idUser);

    //verifier que le username existe et qu'il est valide
    try 
    {
        const usernameDate = db.prepare("SELECT last_username_change FROM users WHERE id = ?").get(idUser);
        if ()

        const alreadyExistingUser = db.prepare("SELECT * FROM users WHERE username = ?").get(newUsername);
        if (alreadyExistingUser)
            return reply.code(401).send( {error: "Username already used"} );

        db.prepare("UPDATE users SET username = ? WHERE id = ?").run(newUsername, idUser);
        db.prepare("UPDATE users SET last_username_change = ? WHERE id = ?").run(CURRENT_TIMESTAMP, idUser);
        //mise a jour du token avec le nouveau username
        const token = await reply.jwtSign({ idUser, newUsername, slug}, {expiresIn: '1h'});
        return reply.code(200).send( { user: { newUsername, slug }, token : token } );
    }
    catch (err)
    {
        return reply.code(500).send( {error : "Internal Server Errore"} );
    }
}