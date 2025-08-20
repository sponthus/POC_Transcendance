export async function   addFriend(request, reply)
{
    const   db = request.db.server;
    const   idUser = request.user.idUser;
    const   friendUsername = request.body.username;

    try
    {
        //faire un check si already friend PAS COMME EN DESSOUS
        /*const alreadyFriend = db.prepare("  SELECT \
                                                1 \
                                            FROM \
                                                friends \")*/

        const idFriend = db.prepare("   SELECT \
                                            id \
                                        FROM \
                                            users \
                                        WHERE \
                                            username = ?").get(friendUsername);
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