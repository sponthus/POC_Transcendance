
export default async function updateUsername (request, reply)
{
    const db = request.server.db;
    const newUsername = request.body.username;
    const idUser = request.user.idUser;
    const slug = request.params.slug;
    console.log("idUser  = " + idUser);
    try 
    {
        const alreadyExistingUser = db.prepare("SELECT * FROM users WHERE username = ?").get(newUsername);
        if (alreadyExistingUser)
            return reply.code(401).send( {error: "Username already used"} );

        db.prepare("UPDATE users SET username = ? WHERE id = ?").run(newUsername, idUser);
        //mise a jour du token avec le nouveau username
        const token = await reply.jwtSign({ idUser, newUsername, slug});
        return reply.code(200).send( { user: { newUsername, slug }, token : token } );
    }
    catch (err)
    {
        return reply.code(500).send( {error : "Internal Server Error"} );
    }
}