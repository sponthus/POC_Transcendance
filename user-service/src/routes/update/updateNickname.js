import Ajv from "ajv"

export default async function   updateNickname (request, reply)
{
    if (checkFormat(request) == false)
        return reply.code(400).send( {error : "Invalid format nickname"} );

    const db = request.server.db;
    const newNickname = request.body.nickname;
    const idUser = request.user.idUser;
       
    try
    {
        db.prepapre ("UPDATE users SET nickname = ? WHERE id = ?").run(newNickname, idUser);
        return reply.code(200).send( {} )
    }
}

function    checkFormat(request)
{
    const schema = 
    {
        type: "object",
        properties:
        {
            nickname: { type: "string", minLength: 3, maxLength: 15, pattern: "^[A-Za-z0-9._-]{3,15}$"}, //autoriser chiffre et certain char speciaux
        },
        required: ["nickname"],
        additionalProperties: false //si autre chose dans properties que nickname --> refuse
    };
    const ajv = new Ajv();
    const contract = ajv.compile(schema);
    const valid = contract(request.body);
    if (!valid)
        return (false);
    return (true);
}