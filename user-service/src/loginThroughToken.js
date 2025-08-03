

export default async function loginThroughToken (request, reply)
{
        console.log("Login through token");
        const db = request.server.db;
        const idUser = request.user.idUser;

        const userData = db.prepare("SELECT * FROM users WHERE id = ?").get(idUser);
        return reply.code(200).send({ username: userData.username, slug: userData.slug });
}