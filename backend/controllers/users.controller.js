import Ajv from "ajv"; // json data validation, fastify built-in support
import slugify from "slugify";
import bcrypt from "bcrypt";

const ajv = new Ajv;

// Define the schema for post data
const postSchema = {
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 3,
            maxLength: 15,
            pattern: "^(?=.*[a-zA-Z]).+$",
        },
        password: {
            type: "string",
            minLength: 6,
            maxLength: 15,
            pattern: "^(?=.*[a-zA-Z0-9]).+$",
        },
    },
    required: ["username", "password"],
    additionalProperties: false,
};

// Compiles validation scheme into a validation function
const validatePost = ajv.compile(postSchema);

const saltRounds = 10;

export function createUser(request, reply) {
    console.log("Creating user");
    const { username, password } = request.body;

    const valid = validatePost({ username, password });
    if (!valid) {
        return reply.status(400).send({
            error: "Invalid input",
            details: validatePost.errors,
        });
    }

    const slug = slugify(username, { lower: true, strict: true });

    const pw_hash = bcrypt.hashSync(password, saltRounds);

    const { db } = request.server;

    const insertStatement = db.prepare(
        "INSERT INTO users (username, slug, pw_hash) VALUES (?, ?, ?)"
    );
    insertStatement.run(username, slug, pw_hash);

    return reply.status(201).send({ success: true });
}

export function loginUser(request, reply) {
    const { username, password } = request.body;

    if (!username || !password) {
        return reply.status(400).send({ error: "Missing username or password" });
    }

    const { db } = request.server;

    const statement = db.prepare("SELECT * FROM users WHERE username = ?");
    const user = statement.get(username);

    if (!user) {
        return reply.status(401).send({ error: "User not found" });
    }

    const passwordMatches = bcrypt.compareSync(password, user.pw_hash);
    if (!passwordMatches) {
        return reply.status(401).send({ error: "Invalid password" });
    }

    // TODO : Generate JWT token, right now just responds OK
    return reply.status(200).send({ success: true, user: { username: user.username } });
}

// export function authenticateUser(username, password) {
//     const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
//     const user = stmt.get(username);
//     if (!user) return null;
//
//     const match = bcrypt.compareSync(password, user.password_hash);
//     return match ? user : null;
// }