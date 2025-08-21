export async function   addFriend(request, reply)
{
    const   db = request.db.server;
    const   idUser = request.user.idUser;
    const   friendUsername = request.body.username;

    try
    {
       
        const idFriend = db.prepare("   SELECT \
                                            id \
                                        FROM \
                                            users \
                                        WHERE \
                                            username = ?").get(friendUsername);

         //faire un check si already friend dans la ta table friend PAS COMME EN DESSOUS
         //faire un check que l'utilisateur existe aussi dans la base donnée ?
        /*const alreadyFriend = db.prepare("  SELECT \
                                                1 \
                                            FROM \
                                                friends \")*/

        const statement = db.prepare("  INSERT INTO \
                                            friends (frie_user_id, frie_friend_user_id) \
                                        VALUES \
                                            (?, ?)");
        statement.run(idUser, idFriend);
        return reply.code(200); //renvoyer un truc ??
    }
    catch (err)
    {
        return reply.code(500).send({ error: "Internal Servor Error" });
    }
}