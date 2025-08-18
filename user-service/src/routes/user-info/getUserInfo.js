export default async function   getUserInfo (request, reply)
{
    const   db = request.server.db;
    const   idUser = request.user.idUser;

    try
    {
       const user = db.prepare("   SELECT \
                                        username, nickname, avatar, slug \
                                    FROM \
                                        users \
                                    WHERE \
                                        id = ?").get(idUser);
       return reply.code(200).send({ userInfo: user }) 
    }
    catch (err)
    {
        return reply.code(500).send({ error: "Internal Server Error" });
    }
}